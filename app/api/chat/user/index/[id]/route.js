import dbConnect from "@/lib/db";
import Message from "@/models/messagesModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const { id } = await params; // Extract the message ID from the parameters
    const { senderId, isSender } = await req.json(); // Extract senderId and isSender from the request body

    try {
        await dbConnect(); // Connect to the database

        if (isSender) {
            // If the sender deletes the message, remove it entirely
            const result = await Message.deleteOne({ tempId: id });

            if (result.deletedCount > 0) {
                return NextResponse.json(
                    { message: 'Message deleted successfully by sender' },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { error: 'Message not found or already deleted' },
                    { status: 404 }
                );
            }
        } else {
            // If the receiver deletes the message, update `deletedByReceiver` to true
            const result = await Message.updateOne(
                { tempId: id },
                { $set: { deletedByReceiver: true } }
            );

            if (result.modifiedCount > 0) {
                return NextResponse.json(
                    { message: 'Message marked as deleted by receiver' },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { error: 'Message not found or already updated' },
                    { status: 404 }
                );
            }
        }
    } catch (error) {
        console.error('Error handling message delete request:', error);
        return NextResponse.json(
            { error: 'Error processing the delete request', details: error.message },
            { status: 500 }
        );
    }
}