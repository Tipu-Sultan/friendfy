import mongoose from "mongoose";

// Comment Schema for nested comments
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who commented
    text: { type: String, required: true }, // Comment content
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Nested replies (optional)
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Post Schema
const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Post creator
    content: { type: String, required: true }, // Post text content
    mediaUrl: { type: String, default: "" }, // Optional media URL
    contentType: { type: String, default: "text/plain" }, // Type of content (text, image, video, etc.)
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
    comments: [commentSchema], // Embed comment schema for better structure
  },
  { timestamps: true } // Auto-manages createdAt & updatedAt
)

// Middleware to update the `updatedAt` field on every save
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Update `updatedAt` to the current date
  next();
});

// Ensure that the model is only created once during server startup
const Post = mongoose?.models?.Post || mongoose?.model("Post", postSchema);

export default Post;
