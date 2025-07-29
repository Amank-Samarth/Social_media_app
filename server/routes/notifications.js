import express from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createNotification);

/* READ */
router.get("/:userId", verifyToken, getUserNotifications);

/* UPDATE */
router.patch("/:id/read", verifyToken, markNotificationAsRead);
router.patch("/:userId/read-all", verifyToken, markAllNotificationsAsRead);

export default router;
