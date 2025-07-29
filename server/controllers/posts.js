import Post from "../models/Post.js";
import User from "../models/User.js";
import View from "../models/View.js";
import mongoose from 'mongoose';

// In-memory recent views store (replace with MongoDB for production)
const recentViews = new Map(); // key: postId, value: array of { userId/IP, timestamp }

/* CREATE */
export const createPost = async (req, res, next) => {
  try {
    const { userId, description } = req.body;
    // Optional user lookup
    const user = await User.findById(userId);

    const newPost = new Post({
      userId: userId || mongoose.Types.ObjectId(),
      firstName: user?.firstName || 'Anonymous',
      lastName: user?.lastName || 'User',
      location: user?.location || '',
      description,
      userPicturePath: user?.picturePath || '',
      picturePath: req.file?.filename || "",
      likes: new Map(),
      dislikes: new Map(),
      comments: [],
      views: 0
    });

    await newPost.save();

    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(posts);
  } catch (err) {
    next(err);
  }
};

/* READ */
export const getFeedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// Get a single post and increment views
export const getPostAndIncrementViews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    // Basic bot detection (expand as needed)
    const botRegex = /(bot|crawl|spider|slurp|curl|wget|python|scrapy|httpclient|fetch|postman|insomnia)/i;
    const isBot = botRegex.test(userAgent);
    // Throttle: Only count if not viewed in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentView = await View.findOne({
      postId: id,
      $or: [
        userId ? { userId } : { ip }
      ],
      createdAt: { $gte: oneHourAgo },
    });
    let post;
    if (!recentView && !isBot) {
      // Record this view in persistent storage
      await View.create({ postId: id, userId, ip, userAgent, isBot });
      post = await Post.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
    } else {
      post = await Post.findById(id);
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

/* LIKE POST */
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure likes and dislikes are Map
    if (!(post.likes instanceof Map)) {
      post.likes = new Map(Object.entries(post.likes || {}));
    }
    if (!(post.dislikes instanceof Map)) {
      post.dislikes = new Map(Object.entries(post.dislikes || {}));
    }

    // Convert userId to string and handle optional userId
    const userIdStr = userId ? userId.toString() : null;

    if (userIdStr) {
      // If user is already liked, remove like
      if (post.likes.has(userIdStr)) {
        post.likes.delete(userIdStr);
      } 
      // If user was disliking, remove dislike
      else if (post.dislikes.has(userIdStr)) {
        post.dislikes.delete(userIdStr);
        post.likes.set(userIdStr, true);
      } 
      // Add like if not already liked or disliked
      else {
        post.likes.set(userIdStr, true);
      }
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* DISLIKE POST */
export const dislikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure likes and dislikes are Map
    if (!(post.likes instanceof Map)) {
      post.likes = new Map(Object.entries(post.likes || {}));
    }
    if (!(post.dislikes instanceof Map)) {
      post.dislikes = new Map(Object.entries(post.dislikes || {}));
    }

    // Convert userId to string and handle optional userId
    const userIdStr = userId ? userId.toString() : null;

    if (userIdStr) {
      // If user is already disliked, remove dislike
      if (post.dislikes.has(userIdStr)) {
        post.dislikes.delete(userIdStr);
      } 
      // If user was liking, remove like
      else if (post.likes.has(userIdStr)) {
        post.likes.delete(userIdStr);
        post.dislikes.set(userIdStr, true);
      } 
      // Add dislike if not already liked or disliked
      else {
        post.dislikes.set(userIdStr, true);
      }
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* COMMENT POST */
export const commentPost = async (req, res, next) => {
  try {
    console.log('Comment Post Request:', {
      postId: req.params.id,
      body: req.body
    });

    const { id } = req.params;
    const { comment, userId } = req.body;

    // Validate inputs
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find user to get additional details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new comment object
    const newComment = {
      id: new mongoose.Types.ObjectId(),
      userId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath || '',
      comment: comment.trim(), // Trim whitespace
      createdAt: new Date(),
      likes: new Map(),
      dislikes: new Map()
    };

    // Add comment to post
    post.comments.push(newComment);
    const updatedPost = await post.save();

    console.log('Comment Post Response:', {
      postId: updatedPost._id,
      commentCount: updatedPost.comments.length
    });

    res.status(201).json(updatedPost);
  } catch (err) {
    console.error('Comment Post Error:', err);
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* UPDATE COMMENT */
const EDIT_WINDOW_MS = 5 * 60 * 1000;

export const updateComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const { comment, userId } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (c) => c.id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const commentObj = post.comments[commentIndex];

    // Check if the user is the author
    console.log('[Edit Comment Debug] commentObj.userId:', commentObj.userId, 'userId from request:', userId);
    if (commentObj.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own comments." });
    }

    // Check if within edit window
    const created = new Date(commentObj.createdAt).getTime();
    const now = Date.now();
    if (now - created > EDIT_WINDOW_MS) {
      return res.status(403).json({ message: "Edit window has expired for this comment." });
    }

    post.comments[commentIndex].comment = comment;
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments = post.comments.filter(
      (c) => c.id.toString() !== commentId
    );

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* LIKE COMMENT */
export const likeComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (c) => c.id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = post.comments[commentIndex];

    // Ensure likes and dislikes are Map
    if (!(comment.likes instanceof Map)) {
      comment.likes = new Map(Object.entries(comment.likes || {}));
    }
    if (!(comment.dislikes instanceof Map)) {
      comment.dislikes = new Map(Object.entries(comment.dislikes || {}));
    }

    // Convert userId to string and handle optional userId
    const userIdStr = userId ? userId.toString() : null;

    if (userIdStr) {
      // If user is already liked, remove like
      if (comment.likes.has(userIdStr)) {
        comment.likes.delete(userIdStr);
      } 
      // If user was disliking, remove dislike and add like
      else if (comment.dislikes.has(userIdStr)) {
        comment.dislikes.delete(userIdStr);
        comment.likes.set(userIdStr, true);
      } 
      // Add like if not already liked or disliked
      else {
        comment.likes.set(userIdStr, true);
        comment.dislikes.delete(userIdStr);
      }
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* DISLIKE COMMENT */
export const dislikeComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (c) => c.id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = post.comments[commentIndex];

    // Ensure likes and dislikes are Map
    if (!(comment.likes instanceof Map)) {
      comment.likes = new Map(Object.entries(comment.likes || {}));
    }
    if (!(comment.dislikes instanceof Map)) {
      comment.dislikes = new Map(Object.entries(comment.dislikes || {}));
    }

    // Convert userId to string and handle optional userId
    const userIdStr = userId ? userId.toString() : null;

    if (userIdStr) {
      // If user is already disliked, remove dislike
      if (comment.dislikes.has(userIdStr)) {
        comment.dislikes.delete(userIdStr);
      } 
      // If user was liking, remove like and add dislike
      else if (comment.likes.has(userIdStr)) {
        comment.likes.delete(userIdStr);
        comment.dislikes.set(userIdStr, true);
      } 
      // Add dislike if not already liked or disliked
      else {
        comment.dislikes.set(userIdStr, true);
        comment.likes.delete(userIdStr);
      }
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* UPDATE POST */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      { description }, 
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

/* DELETE POST */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};
