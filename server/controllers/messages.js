import Message from "../models/Message.js";
import User from "../models/User.js";

/* CREATE */
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
    });
    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "firstName lastName picturePath"
    );
    
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "firstName lastName picturePath")
      .populate("receiverId", "firstName lastName picturePath")
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .populate("senderId", "firstName lastName picturePath")
      .populate("receiverId", "firstName lastName picturePath")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json(message);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const markAllMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Message.updateMany(
      { receiverId: userId, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All messages marked as read" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
