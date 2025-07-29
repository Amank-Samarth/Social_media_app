import React, { useState, useEffect } from "react";
import {
  ChatBubbleOutlineOutlined,
  DeleteOutlined,
  EditOutlined,
  SendOutlined,
  ThumbDownOutlined,
  ThumbDownAltOutlined,
  ThumbUpOutlined,
  ThumbUpAltOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  Avatar,
  TextField,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setPost, setPosts, setFriends } from "state";
import { postApis, userApis } from "utils/api";
import WidgetWrapper from "components/WidgetWrapper";
import CommentItem from "./CommentItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  dislikes,
  comments,
  createdAt,
  incrementViews = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id, picturePath: loggedInUserPicture } = useSelector((state) => state.user);
  const friends = useSelector((state) => state.user.friends);

  // Check if the viewed user is already a friend
  const isFriend = friends.find((friend) => friend._id === postUserId);

  // Handle adding/removing friend
  const handleFriendAction = async () => {
    try {
      const response = await userApis.toggleFriend(postUserId);
      
      // Update friends in Redux store
      dispatch(setFriends({ friends: response.friends }));
      
      // Optional: Show a toast or snackbar notification
      toast.success(isFriend ? 'Removed from friends' : 'Friend request sent');
    } catch (error) {
      console.error('Friend action failed:', error);
      toast.error('Friend action failed. Please try again.');
    }
  };

  // Navigate to user profile
  const navigateToProfile = () => {
    navigate(`/profile/${postUserId}`);
  };

  const [isComments, setIsComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const [isLiked, setIsLiked] = useState(
    likes ? Object.keys(likes).includes(_id) : false
  );
  const [isDisliked, setIsDisliked] = useState(
    dislikes ? Object.keys(dislikes).includes(_id) : false
  );
  const [likeCount, setLikeCount] = useState(
    likes ? Object.keys(likes).length : 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    dislikes ? Object.keys(dislikes).length : 0
  );

  useEffect(() => {
    if (likes) {
      const userLiked = likes instanceof Map 
        ? likes.has(_id) 
        : Object.keys(likes).includes(_id);
      setIsLiked(userLiked);
      setLikeCount(likes instanceof Map ? likes.size : Object.keys(likes).length);
    }

    if (dislikes) {
      const userDisliked = dislikes instanceof Map 
        ? dislikes.has(_id) 
        : Object.keys(dislikes).includes(_id);
      setIsDisliked(userDisliked);
      setDislikeCount(dislikes instanceof Map ? dislikes.size : Object.keys(dislikes).length);
    }
  }, [likes, dislikes, _id]);

  useEffect(() => {
    if (!incrementViews) return;
    let timer;
    let didSend = false;
    // Only increment view after 30 seconds
    timer = setTimeout(async () => {
      try {
        if (didSend) return;
        didSend = true;
        const post = await postApis.getPostAndIncrementViews(postId);
        setViewCount(post.views || 0);
      } catch (err) {
        console.error('Failed to fetch/increment views', err);
      }
    }, 30000); // 30 seconds
    return () => {
      clearTimeout(timer);
    };
  }, [postId, incrementViews]);

  const handleLike = async () => {
    try {
      const userId = _id;
      console.log('Like Action - User ID:', userId);
      console.log('Current Likes:', JSON.stringify(Object.fromEntries(likes instanceof Map ? likes : new Map(Object.entries(likes || {})))));
      console.log('Current Dislikes:', JSON.stringify(Object.fromEntries(dislikes instanceof Map ? dislikes : new Map(Object.entries(dislikes || {})))));

      const updatedPost = await postApis.likePost(postId, userId);
      console.log('Updated Post after Like:', updatedPost);
      
      // Convert likes and dislikes to Map for consistent handling
      const newLikes = updatedPost.likes instanceof Map 
        ? updatedPost.likes 
        : new Map(Object.entries(updatedPost.likes || {}));
      
      const newDislikes = updatedPost.dislikes instanceof Map 
        ? updatedPost.dislikes 
        : new Map(Object.entries(updatedPost.dislikes || {}));

      // Determine like state
      const isCurrentlyLiked = newLikes.has(userId.toString());
      console.log('Is Currently Liked:', isCurrentlyLiked);

      // Update state based on server response
      setIsLiked(isCurrentlyLiked);
      setIsDisliked(false);
      setLikeCount(newLikes.size);
      setDislikeCount(newDislikes.size);

      // Update Redux store
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post. Please try again.");
    }
  };

  const handleDislike = async () => {
    try {
      const userId = _id;
      console.log('Dislike Action - User ID:', userId);
      console.log('Current Likes:', JSON.stringify(Object.fromEntries(likes instanceof Map ? likes : new Map(Object.entries(likes || {})))));
      console.log('Current Dislikes:', JSON.stringify(Object.fromEntries(dislikes instanceof Map ? dislikes : new Map(Object.entries(dislikes || {})))));

      const updatedPost = await postApis.dislikePost(postId, userId);
      console.log('Updated Post after Dislike:', updatedPost);
      
      // Convert likes and dislikes to Map for consistent handling
      const newLikes = updatedPost.likes instanceof Map 
        ? updatedPost.likes 
        : new Map(Object.entries(updatedPost.likes || {}));
      
      const newDislikes = updatedPost.dislikes instanceof Map 
        ? updatedPost.dislikes 
        : new Map(Object.entries(updatedPost.dislikes || {}));

      // Determine dislike state
      const isCurrentlyDisliked = newDislikes.has(userId.toString());
      console.log('Is Currently Disliked:', isCurrentlyDisliked);

      // Update state based on server response
      setIsDisliked(isCurrentlyDisliked);
      setIsLiked(false);
      setDislikeCount(newDislikes.size);
      setLikeCount(newLikes.size);

      // Update Redux store
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error disliking post:", error);
      toast.error("Failed to dislike post. Please try again.");
    }
  };

  const handleEdit = async () => {
    if (!editedDescription.trim()) {
      toast.error("Post description cannot be empty");
      return;
    }

    try {
      const updatedPost = await postApis.editPost(postId, editedDescription);
      dispatch(setPost({ post: updatedPost }));
      setIsEditing(false);
      toast.success("Post edited successfully");
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error(error.message || "Failed to edit post. Please try again.");
    }
  };

  const handleDeletePost = async () => {
    setShowDeleteDialog(false);
    try {
      await postApis.deletePost(postId);
      dispatch(setPosts({ posts: await postApis.getFeedPosts() }));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Failed to delete post. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setLoading(true);
    try {
      // Get the logged-in user's ID
      const userId = _id;
      
      // Log the comment details for debugging
      console.log('Adding Comment:', {
        postId,
        comment: newComment,
        userId
      });

      // Send comment with user ID
      const updatedPost = await postApis.addComment(postId, {
        comment: newComment,
        userId
      });

      // Log the updated post for verification
      console.log('Updated Post after Comment:', updatedPost);

      // Update Redux store with the new post
      dispatch(setPost({ post: updatedPost }));

      // Reset the comment input
      setNewComment("");
      
      // Optionally, open comments section
      setIsComments(true);
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message || "Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render comments section
  const renderComments = () => {
    if (!isComments || !comments || comments.length === 0) return null;

    return (
      <Box 
        sx={{
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          Comments 
          <Typography 
            component="span" 
            variant="caption" 
            color="text.disabled"
          >
            {comments.length} comments
          </Typography>
        </Typography>
        
        <Box>
          {comments.map((comment, index) => (
            <CommentItem 
              key={comment.id || `comment-${index}`} 
              comment={comment} 
              postId={postId}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Render comment input
  const renderCommentInput = () => {
    if (!isComments) return null;

    return (
      <Box 
        sx={{
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            src={loggedInUserPicture 
              ? `http://localhost:3001/assets/${loggedInUserPicture}` 
              : undefined
            } 
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid',
              borderColor: 'primary.light'
            }}
          />
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            maxRows={3}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': { 
                borderRadius: 3,
                bgcolor: 'background.default'
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton 
                  color="primary" 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{ 
                    visibility: newComment.trim() ? 'visible' : 'hidden',
                    p: 0.5
                  }}
                >
                  <SendOutlined fontSize="small" />
                </IconButton>
              )
            }}
          />
        </Box>
      </Box>
    );
  };

  // Format timestamp function
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';

    const postDate = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // For older posts, return formatted date
    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <WidgetWrapper 
      m="2rem 0" 
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
        }
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      {/* Post Header */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={2} 
        pb={1} 
        sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Box 
          display="flex" 
          alignItems="center" 
          gap={2} 
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Avatar
            src={`http://localhost:3001/assets/${userPicturePath}`}
            onClick={navigateToProfile}
            sx={{
              width: 56,
              height: 56,
              border: '3px solid',
              borderColor: 'primary.light',
              boxShadow: 2,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          <Box 
            sx={{ 
              flexGrow: 1,
              ml: 2
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight={600} 
              color="text.primary"
              onClick={navigateToProfile}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {name}
            </Typography>
            
            <Box 
              display="flex" 
              alignItems="center" 
              gap={1}
            >
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                {location}
              </Typography>
              
              {/* Time of Post */}
              <Typography 
                variant="caption" 
                color="text.disabled"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 0.5 
                }}
              >
                <AccessTimeOutlined 
                  sx={{ 
                    fontSize: 14,
                    color: 'text.disabled' 
                  }} 
                />
                {formatTimeAgo(createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Friend Action Button */}
          {postUserId !== _id && (
            <Button
              variant={isFriend ? "outlined" : "contained"}
              color={isFriend ? "secondary" : "primary"}
              size="small"
              onClick={handleFriendAction}
              sx={{ 
                ml: 2,
                minWidth: '100px'
              }}
            >
              {isFriend ? 'Remove Friend' : 'Add Friend'}
            </Button>
          )}
        </Box>
        
        {_id === postUserId && (
          <Box display="flex" alignItems="center" gap={1}>
            {isEditing ? (
              <>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small" 
                  onClick={handleEdit}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="small" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedDescription(description);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <IconButton 
                  color="primary" 
                  size="small" 
                  onClick={() => setIsEditing(true)}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Post Content */}
      <Box px={2} mb={2}>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2 
              }
            }}
          />
        ) : (
          <Typography 
            component="span" 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} 
            sx={{ 
              wordBreak: 'break-word',
              lineHeight: 1.6,
              fontStyle: description.length > 200 ? 'italic' : 'normal',
              opacity: description.length > 200 ? 0.8 : 1
            }}
          />
        )}
      </Box>
      
      {/* Post Views */}
      <Box display="flex" alignItems="center" gap={1} mt={1} mb={0.5}>
        <Typography variant="body2" color="textSecondary">
          {viewCount.toLocaleString()} views
        </Typography>
      </Box>

      {/* Post Image */}
      {picturePath && (
        <Box 
          sx={{
            width: '100%',
            maxHeight: '500px',
            overflow: 'hidden',
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ 
              objectFit: 'contain',
              borderRadius: '8px',
              maxWidth: '100%',
              transition: 'transform 0.3s ease'
            }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        </Box>
      )}
      
      {/* Interaction Buttons */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        px={2}
        py={1}
        sx={{ 
          borderTop: '1px solid', 
          borderBottom: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Box display="flex" alignItems="center" gap={3}>
          {/* Like Button */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={handleLike} 
              color={isLiked ? "primary" : "default"}
              size="small"
              aria-label={isLiked ? "Unlike post" : "Like post"}
              tabIndex={0}
            >
              {isLiked ? <ThumbUpOutlined /> : <ThumbUpAltOutlined />}
            </IconButton>
            <Typography 
              color={isLiked ? "primary.main" : "text.secondary"}
              variant="body2"
            >
              {likeCount}
            </Typography>
          </Box>

          {/* Dislike Button */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={handleDislike} 
              color={isDisliked ? "error" : "default"}
              size="small"
              aria-label={isDisliked ? "Undislike post" : "Dislike post"}
              tabIndex={0}
            >
              {isDisliked ? <ThumbDownOutlined /> : <ThumbDownAltOutlined />}
            </IconButton>
            <Typography 
              color={isDisliked ? "error.main" : "text.secondary"}
              variant="body2"
            >
              {dislikeCount}
            </Typography>
          </Box>

          {/* Comments Button */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={() => setIsComments(!isComments)}
              color={isComments ? "secondary" : "default"}
              size="small"
              aria-label={isComments ? "Hide comments" : "Show comments"}
              tabIndex={0}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography 
              color={isComments ? "secondary.main" : "text.secondary"}
              variant="body2"
            >
              {comments ? comments.length : 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Comments Section */}
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
      ) : (
        renderComments()
      )}

      {/* Comment Input */}
      {renderCommentInput()}

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this post?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeletePost} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

PostWidget.propTypes = {
  postId: PropTypes.string.isRequired,
  postUserId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  location: PropTypes.string,
  picturePath: PropTypes.string,
  userPicturePath: PropTypes.string,
  likes: PropTypes.object,
  dislikes: PropTypes.object,
  comments: PropTypes.array,
  createdAt: PropTypes.string,
  incrementViews: PropTypes.bool,
};

export default PostWidget;
