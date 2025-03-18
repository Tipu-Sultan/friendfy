import mongoose from "mongoose";

// Reply Schema
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);


// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    replies: [replySchema], // Embed reply schema
  },
  { timestamps: true }
);


// Post Schema
const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: "" },
    contentType: { type: String, default: "text/plain" },
    isEdited:{type: Boolean, default:false},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema], // Embed comment schema
  },
  { timestamps: true }
);

// Middleware to update the `updatedAt` field only when changes occur
postSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Ensure the model is created only once
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
