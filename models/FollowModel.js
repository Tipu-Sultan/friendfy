const { default: mongoose } = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isBlocked: { type: Boolean, default: false },
    actionType: { type: String, enum: ["following", "follower"], required: true },
    status: { type: String, enum: ["requested", "confirmed"], default: "requested" },
  },
  { timestamps: true }
);

const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);

module.exports = Follow;
