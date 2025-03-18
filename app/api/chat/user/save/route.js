import dbConnect from "@/lib/db";
import Message from "@/models/messagesModel";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();

  const { tempId, sender, receiver, content, media, contentType } = await req.json();

  if (!sender || !receiver || !content) {
    return NextResponse.json(
      { error: "Sender, receiver, and content are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch sender and receiver users
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if sender is blocked by receiver or vice versa
    const senderBlocked = receiverUser.recentChats.some(
      (chat) => chat.id.toString() === sender && chat.isBlocked
    );

    const receiverBlocked = senderUser.recentChats.some(
      (chat) => chat.id.toString() === receiver && chat.isBlocked
    );

    if (senderBlocked || receiverBlocked) {
      return NextResponse.json(
        { error: "Message cannot be sent. User is blocked." },
        { status: 403 }
      );
    }

    // Create and store message
    const newMessage = new Message({
      tempId,
      sender,
      receiver,
      content,
      contentType,
      media: media || null,
      isRead: false,
      reactions: [],
      deletedBySender: false,
      deletedByReceiver: false,
      edited: false,
      editedAt: null,
    });

    await newMessage.save();

    // Prepare lastMessage object
    const lastMessage = {
      text: content,
      date: new Date(),
    };

    // Update recentChats for both sender and receiver
    await updateLastMessage(sender, receiver, lastMessage);
    await updateLastMessage(receiver, sender, lastMessage);

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error storing message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// Function to update only the lastMessage field in recentChats
async function updateLastMessage(senderId, receiverId, lastMessage) {
  try {
    // Find both users in a single query
    const users = await User.find({
      _id: { $in: [senderId, receiverId] },
    });

    if (!users || users.length !== 2) return; // Ensure both users exist

    // Loop through both users and update their recentChats
    for (const user of users) {
      const chatPartnerId =
        user._id.toString() === senderId.toString() ? receiverId : senderId;

      const chatIndex = user.recentChats.findIndex(
        (chat) => chat.id.toString() === chatPartnerId.toString()
      );

      if (chatIndex !== -1) {
        // If chat exists, update lastMessage
        user.recentChats[chatIndex].lastMessage = lastMessage;
        user.recentChats[chatIndex].updatedAt = new Date();
      }
      // Save user
      await user.save();
    }
  } catch (error) {
    console.error("Error updating recentChats:", error);
  }
}
