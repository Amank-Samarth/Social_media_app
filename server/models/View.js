import mongoose from "mongoose";

const viewSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: String,
      default: null,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 90 // Optional: auto-remove after 90 days
    },
    isBot: {
      type: Boolean,
      default: false
    }
  }
);

const View = mongoose.model("View", viewSchema);
export default View;
