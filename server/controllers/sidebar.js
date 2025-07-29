import User from '../models/User.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

// Get trending topics (hashtags) based on recent posts
export const getTrendingTopics = async (req, res, next) => {
  try {
    // Find hashtags in the latest 100 posts
    const posts = await Post.find().sort({ createdAt: -1 }).limit(100);
    const hashtagCounts = {};
    posts.forEach(post => {
      const hashtags = (post.description.match(/#\w+/g) || []).map(tag => tag.toLowerCase());
      hashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });
    // Sort hashtags by frequency and return top 5
    const trending = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
    res.status(200).json(trending);
  } catch (err) {
    next(err);
  }
};

// Get people you may know (suggestions)
export const getSuggestions = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });
    // Get current user's friends
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Suggest users who are not the current user and not already friends
    const suggestions = await User.find({
      _id: { $ne: userId, $nin: user.friends },
    }).limit(5).select('_id firstName lastName occupation location picturePath');
    res.status(200).json(suggestions);
  } catch (err) {
    next(err);
  }
};
