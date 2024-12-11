import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: "" }, 
    contentType:{ type: String, default: 'text/plain' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

// Middleware to update the `updatedAt` field on every save
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Update `updatedAt` to the current date
  next();
});

// Ensure that the model is only created once during server startup
const Post = mongoose?.models?.Post || mongoose?.model("Post", postSchema);

export default Post;
