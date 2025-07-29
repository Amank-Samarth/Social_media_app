import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/friends/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id", verifyToken, upload.single("picture"), updateProfile);

export default router;
