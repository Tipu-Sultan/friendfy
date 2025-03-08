import dbConnect from '@/lib/db';
import Post from '@/models/PostModel';
import User from '@/models/UserModel'; // Ensure User model is registered

export async function getPosts() {
    try {
        await dbConnect(); // Ensure DB connection

        const posts = await Post.find()
            .populate('user', 'username profilePicture') 
            .lean();

        const serializedPosts = posts.map((post) => ({
            ...post,
            _id: post._id.toString(),
            user: post.user ? { 
                ...post.user, 
                _id: post.user._id.toString(),
            } : null, // Handle cases where `user` is null
            likes: post.likes.map((like) => like.toString()),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }));

        return serializedPosts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
    }
}
