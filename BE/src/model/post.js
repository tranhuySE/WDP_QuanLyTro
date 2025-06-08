const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    content: { type: String },
    tag: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

const Post = model("Post", postSchema);
export default Post;
