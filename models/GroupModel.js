const mongoose = require('mongoose');

// Define the Group schema
const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    groupId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    }],
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    }],
    groupImage: {
      type: String,
      default: "https://example.com/default-group-image.jpg", // Default image URL
    },
    settings: {
      isPrivate: {
        type: Boolean,
        default: false, // Determines whether the group is private or public
      },
      isArchived: {
        type: Boolean,
        default: false, // Determines whether the group is archived
      },
      allowInvite: {
        type: Boolean,
        default: true, // Whether members can invite others to the group
      },
    },
    lastActive: {
      type: Date,
      default: Date.now, // Tracks the last time the group was active
    },
    groupType: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'public', // Group type (e.g., open group, closed group, etc.)
    },
    notificationsEnabled: {
      type: Boolean,
      default: true, // Whether notifications are enabled for this group
    },
    pinnedMessages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Reference to the Message model (for pinned messages)
    }],
    archivedMessages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Reference to the Message model (for archived messages)
    }],
    isMuted: {
      type: Boolean,
      default: false, // Whether the group is muted for a user
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Group model
const Group = mongoose.models.Group || mongoose.model('Group', GroupSchema);
module.exports = Group;
