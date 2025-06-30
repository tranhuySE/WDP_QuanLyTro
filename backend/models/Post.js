const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    content: { type: String, required: true },
    title: { type: String, required: true },
    tag: {
      type: String,
      enum: [
        "Thông báo",
        "Tin tức",
        "Cảnh báo",
        "Nhắc nhở",
        "Quy định",
      ],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

const Post = model("Post", postSchema);
module.exports = Post;