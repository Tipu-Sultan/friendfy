import { NextResponse } from "next/server";
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import GroupMessage from '@/models/groupMessagesModel'; // GroupMessage model
import Group from '@/models/GroupModel'; // GroupMessage model



export async function POST(req, { params }) {
    const { id } = await params; // Extract the message ID from the parameters
    const { senderId, isSender } = await req.json(); // Extract senderId and isSender from the request body

    try {
        await dbConnect(); // Connect to the database

        if (isSender) {
            // If the sender deletes the message, remove it entirely
            const result = await GroupMessage.deleteOne({ tempId: id });

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
            const result = await GroupMessage.updateOne(
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


export async function GET(req, { params }) {
    const { id } = await params; // Extract the message ID from the parameters

    try {
        await dbConnect(); // Connect to the database

        // Retrieve group data by group ID and populate admins and members
        const result = await Group.findOne({ groupId: id })
            .populate({
                path: 'admins',
                select: '_id username profilePicture email',
            })
            .populate({
                path: 'members',
                select: '_id username profilePicture email',
            });

        if (!result) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { groupData: result },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error handling group data request:', error);
        return NextResponse.json(
            { error: 'Error retrieving group data', details: error.message },
            { status: 500 }
        );
    }
}



