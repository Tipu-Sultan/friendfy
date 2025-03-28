const Chats = require('../models/chats');
const Friends = require('../models/friends');
const User = require('../models/users');

const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // You need to create the 'uploads' directory in your project
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
});

async function storeChats(req, res) {
    try {
        const { senderUsername, receiverUsername, message, roomId,blockStatus } = req.body;

        let filepath = '';
        let contentType = 'text';

        if (req.file) {
            filepath = req.file.path;
            const fileType = req.file.mimetype.split('/')[0];

            // Update content type based on the file type
            switch (fileType) {
                case 'image':
                    contentType = 'image';
                    break;
                case 'video':
                    contentType = 'video';
                    break;
                case 'application':
                    contentType = 'document';
                    break;
                default:
                    contentType = 'text';
            }
        }

        const newMessage = new Chats({
            senderUsername,
            receiverUsername,
            message: message !== '' ? message : '',
            contentType,
            filepath,
            roomId,
            blockStatus
        });

        await newMessage.save();
        res.status(201).json({ message: 'Chat message stored successfully.', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const getFollowedUsers = async (req, res) => {
    try {
        const { username } = req.params;

        const followedFriends = await Friends.find({
            $or: [
                { senderUsername: username, action: 'Following' },
                { receiverUsername: username, action: 'Following' },
            ],
        });

        const userIds = Array.from(
            new Set(
                followedFriends.map((friend) =>
                    friend.senderUsername === username ? friend.receiverUsername : friend.senderUsername
                )
            )
        );

        const followedUsers = await User.find({ username: { $in: userIds } }).select('-password -otp -token');

        res.json({ followedUsers});
    } catch (error) {
        console.error('Error fetching followed users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSenderRecievrMsg = async (req, res) => {
    const { senderUsername, receiverUsername } = req.body;
    try {
        // Fetch messages
        const chats = await Chats.find({
            $or: [
                { senderUsername, receiverUsername },
                { senderUsername: receiverUsername, receiverUsername: senderUsername },
            ],
        });

        const followedFriends = await Friends.find({
            $or: [
              { senderUsername: senderUsername, receiverUsername: receiverUsername, action: 'Following' },
              { senderUsername: receiverUsername, receiverUsername: senderUsername, action: 'Following' }
            ],
        });

        await Chats.updateMany(
            { senderUsername: receiverUsername, receiverUsername: senderUsername, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ chats,followedFriends });
    } catch (error) {
        console.error('Error fetching or updating chat messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllMessags = async (req, res) => {
    try {
        // Fetch all messages from the database
        const messages = await Chats.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteMsgById = async (req, res) => {
    try {
        const { msgId } = req.params;

        const deletedMessage = await Chats.findByIdAndDelete(msgId);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteMultiMsgById = async (req, res) => {
    try {
        const { selectedMessages, username } = req.body;
        const messageIds = selectedMessages.map(msg => msg.messageId);

        // Update the messages where senderUsername matches and set isMsgDelete to true
        await Chats.updateMany(
            { _id: { $in: messageIds }, receiverUsername: username },
            { $set: { isMsgDelete: true } }
        );

        // Delete the messages where receiverUsername matches
        await Chats.deleteMany(
            { _id: { $in: messageIds }, senderUsername: username }
        );

        res.status(200).json({ message: 'Messages updated/deleted successfully' });
    } catch (error) {
        console.error('Error deleting messages:', error);
        res.status(500).json({ error: 'Failed to delete messages. Please try again.' });
    }
};

module.exports = {
    storeChats,
    getFollowedUsers,
    getSenderRecievrMsg,
    deleteMsgById,
    getAllMessags,
    deleteMultiMsgById
}