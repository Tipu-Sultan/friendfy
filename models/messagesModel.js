const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    tempId: {
      type: String, // Text content of the message
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the sender
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the receiver
      required: true,
    },
    content: {
      type: String, // Text content of the message
      required: true,
    },
    contentType: {
      type: String, // Text content of the message
      required: true,
    },
    media: {
      type: String, // URL to media file like an image, video, document, etc.
      default: null,
    },
    isRead: {
      type: Boolean, // Tracks whether the message has been read
      default: false,
    },
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model for the person reacting
        },
        emoji: {
          type: String, // Emoji or reaction symbol like "❤️", "👍"
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
      type: Boolean, // Flag to check if the message was edited
      default: false,
    },
    editedAt: {
      type: Date, // Timestamp when the message was edited
      default: null,
    },
    status: {
      type: String, // Timestamp when the message was edited
      default: null,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Message model
const Message = mongoose?.models?.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
