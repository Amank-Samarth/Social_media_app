import React, { useState, useMemo } from "react";
import {
  ThumbDownOutlined,
  ThumbDownAltOutlined,
  ThumbUpOutlined,
  ThumbUpAltOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Avatar,
  TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "state";
import { postApis } from "utils/api";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

const CommentItem = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.user);

  const [isLiked, setIsLiked] = useState(() => {
    if (comment.likes instanceof Map) {
      return comment.likes.has(loggedInUser?._id);
    }
    return comment.likes && comment.likes[loggedInUser?._id] === true;
  });

  const [isDisliked, setIsDisliked] = useState(() => {
    if (comment.dislikes instanceof Map) {
      return comment.dislikes.has(loggedInUser?._id);
    }
    return comment.dislikes && comment.dislikes[loggedInUser?._id] === true;
  });

  const [likeCount, setLikeCount] = useState(() => {
    if (comment.likes instanceof Map) {
      return comment.likes.size;
    }
    return Object.keys(comment.likes || {}).length;
  });

  const [dislikeCount, setDislikeCount] = useState(() => {
    if (comment.dislikes instanceof Map) {
      return comment.dislikes.size;
    }
    return Object.keys(comment.dislikes || {}).length;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const EDIT_WINDOW_MS = 5 * 60 * 1000;

  const canEdit = useMemo(() => {
    if (loggedInUser?._id !== comment.userId) return false;
    if (!comment.createdAt) return false;
    const created = new Date(comment.createdAt).getTime();
    const now = Date.now();
    return now - created < EDIT_WINDOW_MS;
  }, [loggedInUser, comment.userId, comment.createdAt, EDIT_WINDOW_MS]);

  const handleCommentLike = async () => {
    try {
      const userId = loggedInUser?._id;
      const updatedPost = await postApis.likeComment(postId, comment.id, userId);
      const updatedComment = updatedPost.comments.find(
        (c) => c.id.toString() === comment.id.toString()
      );
      const newLikes = updatedComment.likes instanceof Map
        ? updatedComment.likes
        : new Map(Object.entries(updatedComment.likes || {}));
      const newDislikes = updatedComment.dislikes instanceof Map
        ? updatedComment.dislikes
        : new Map(Object.entries(updatedComment.dislikes || {}));
      setIsLiked(newLikes.has(userId));
      setIsDisliked(false);
      setLikeCount(newLikes.size);
      setDislikeCount(newDislikes.size);
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleCommentDislike = async () => {
    try {
      const userId = loggedInUser?._id;
      const updatedPost = await postApis.dislikeComment(postId, comment.id, userId);
      const updatedComment = updatedPost.comments.find(
        (c) => c.id.toString() === comment.id.toString()
      );
      const newLikes = updatedComment.likes instanceof Map
        ? updatedComment.likes
        : new Map(Object.entries(updatedComment.likes || {}));
      const newDislikes = updatedComment.dislikes instanceof Map
        ? updatedComment.dislikes
        : new Map(Object.entries(updatedComment.dislikes || {}));
      setIsDisliked(newDislikes.has(userId));
      setIsLiked(false);
      setDislikeCount(newDislikes.size);
      setLikeCount(newLikes.size);
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    if (!editedComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    try {
      const updatedPost = await postApis.updateComment(postId, comment.id, {
        comment: editedComment,
        userId: loggedInUser?._id,
      });
      dispatch(setPost({ post: updatedPost }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing comment:", error);
      alert(error.message || "Failed to edit comment. Please try again.");
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const updatedPost = await postApis.deleteComment(postId, comment.id);
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.message || "Failed to delete comment. Please try again.");
    }
  };

  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
        {comment.firstName?.[0]}
      </Avatar>
      <Box flex={1}>
        {isEditing ? (
          <TextField
            fullWidth
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            variant="outlined"
            size="small"
            multiline
            maxRows={4}
          />
        ) : (
          <Typography variant="body2" component="span" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.comment) }} />
        )}
        <Box display="flex" alignItems="center" mt={1}>
          <IconButton
            size="small"
            color={isLiked ? "primary" : "default"}
            onClick={handleCommentLike}
            aria-label={isLiked ? "Unlike comment" : "Like comment"}
            tabIndex={0}
          >
            {isLiked ? <ThumbUpOutlined /> : <ThumbUpAltOutlined />}
            <Typography ml={0.5} variant="caption">{likeCount}</Typography>
          </IconButton>
          <IconButton
            size="small"
            color={isDisliked ? "error" : "default"}
            onClick={handleCommentDislike}
            aria-label={isDisliked ? "Undislike comment" : "Dislike comment"}
            tabIndex={0}
          >
            {isDisliked ? <ThumbDownOutlined /> : <ThumbDownAltOutlined />}
            <Typography ml={0.5} variant="caption">{dislikeCount}</Typography>
          </IconButton>
          {loggedInUser?._id === comment.userId && (
            <>
              {canEdit ? (
                isEditing ? (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={handleUpdateComment}
                      tabIndex={0}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => setIsEditing(false)}
                      tabIndex={0}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit comment"
                    tabIndex={0}
                  >
                    <EditOutlined />
                  </IconButton>
                )
              ) : (
                <Typography variant="caption" color="textSecondary">
                  (Edit window expired)
                </Typography>
              )}
              <IconButton
                size="small"
                color="error"
                onClick={handleDeleteComment}
                aria-label="Delete comment"
                tabIndex={0}
              >
                <DeleteOutlined />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
};

export default CommentItem;
