const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      village: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    verificationToken: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: "" },
    passwordExpires: { type: Date, default: null },
    lastLogin: { type: String, default: "" },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    recentChats: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to group or user
        groupId: {
          type: String,
          default:''
        },
        name: { type: String, default: '' }, // Group or user name
        type: { type: String, enum: ['user', 'group'], required: true }, // Type of chat
        profilePicture: { type: String, default: '' }, // Profile picture URL
        lastMessage: {
          text: { type: String, default: "" },
          date: { type: Date, default: Date.now },
        },
        lastSeen: { type: String, default: "" },
        isBlocked: { type: Boolean, default:false },
        updatedAt: { type: Date, default: Date.now }, // When the chat was last updated
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

