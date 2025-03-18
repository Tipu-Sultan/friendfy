import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "Spam",
        "Harassment",
        "Hate Speech",
        "Violence",
        "Misinformation",
        "Nudity",
        "Other",
      ],
      required: true,
    },
    details: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Action Taken"],
      default: "Pending",
    },
    isBadContent: {
      type: Boolean,
      default: false, // Marked bad? Prevents from trending
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Reports = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Reports;
