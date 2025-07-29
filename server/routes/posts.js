import express from "express";
import { getFeedPosts, getUserPosts, createPost, updatePost, deletePost, 
         likePost, dislikePost, commentPost, updateComment, 
         deleteComment, likeComment, dislikeComment, getPostAndIncrementViews } from "../controllers/posts.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);
router.get("/:id", getPostAndIncrementViews);

/* CREATE */
router.post("/", upload.single("picture"), createPost);
router.post("/:id/comment", commentPost);

/* UPDATE */
router.patch("/:id", upload.single("picture"), updatePost);
router.patch("/:id/like", likePost);
router.patch("/:id/dislike", dislikePost);
router.patch("/:id/comment/:commentId", updateComment);
router.patch("/:id/comment/:commentId/like", likeComment);
router.patch("/:id/comment/:commentId/dislike", dislikeComment);

/* DELETE */
router.delete("/:id", deletePost);
router.delete("/:id/comment/:commentId", deleteComment);

export default router;
