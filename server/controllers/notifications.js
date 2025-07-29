import Notification from "../models/Notification.js";
import User from "../models/User.js";

/* CREATE */
export const createNotification = async (req, res) => {
  try {
    const { userId, type, message, relatedUserId, postId } = req.body;
    const newNotification = new Notification({
      userId,
      type,
      message,
      relatedUserId,
      postId,
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .populate("relatedUserId", "firstName lastName picturePath")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
