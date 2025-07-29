import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
      default: {}
    },
    dislikes: {
      type: Map,
      of: Boolean,
      default: {}
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
      },
      userId: String,
      firstName: String,
      lastName: String,
      userPicturePath: String,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: {
        type: Map,
        of: Boolean,
        default: {}
      },
      dislikes: {
        type: Map,
        of: Boolean,
        default: {}
      }
    }]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
