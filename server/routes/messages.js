import express from "express";
import {
  sendMessage,
  getUserMessages,
  getConversation,
  markMessageAsRead,
  markAllMessagesAsRead,
} from "../controllers/messages.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, sendMessage);

/* READ */
router.get("/:userId", verifyToken, getUserMessages);
router.get("/:userId/:otherUserId", verifyToken, getConversation);

/* UPDATE */
router.patch("/:id/read", verifyToken, markMessageAsRead);
router.patch("/:userId/read-all", verifyToken, markAllMessagesAsRead);

export default router;
