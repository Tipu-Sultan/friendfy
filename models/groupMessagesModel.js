const { default: mongoose } = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    tempId: {
      type: String, // Text content of the message
      required: true,
    },
    //receiver as GroupId
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference to the Group model
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    content: {
      type: String, 
      required: true, // Text content of the message
    },
    media: {
      type: String, // URL of media like image, video, document, etc.
      default: null,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users mentioned in the message
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // User who reacted to the message
        },
        emoji: {
          type: String, // Emoji representing the reaction (e.g., "👍", "❤️")
        },
      },
    ],
    deletedBySender: {
      type: Boolean, // Flag to indicate if the message was deleted by the sender
      default: false,
    },
    deletedByReceiver: {
      type: Boolean, // Flag to indicate if the message was deleted by the receiver
      default: false,
    },
    edited: {
      type: Boolean,
      default: false, // Flag to indicate whether the message has been edited
    },
    editedAt: {
      type: Date,
      default: null, // Timestamp of when the message was last edited
    },
    deleted: {
      type: Boolean,
      default: false, // Flag to indicate whether the message has been deleted
    },
    deletedAt: {
      type: Date,
      default: null, // Timestamp when the message was deleted
    },
  },
  { timestamps: true } // Automatically creates 'createdAt' and 'updatedAt' fields
);

// Create the GroupMessage model
const GroupMessage = mongoose.models.GroupMessage || mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;
