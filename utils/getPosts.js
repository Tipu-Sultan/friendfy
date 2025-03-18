import dbConnect from '@/lib/db';
import Post from '@/models/PostModel';

export async function getPosts() {
    try {
        await dbConnect();

        const posts = await Post.find()
            .populate({
                path: 'user',
                select: 'username profilePicture',
            })
            .populate({
                path: 'comments.user',
                select: 'username profilePicture',
            })
            .populate({
                path: 'comments.replies.user', // Populate reply users
                select: 'username profilePicture',
            })
            .lean();

        const serializedPosts = posts.map((post) => ({
            ...post,
            _id: post._id.toString(),
            user: post.user
                ? {
                    ...post.user,
                    _id: post.user._id.toString(),
                    profilePicture: post.user.profilePicture 
                        ? post.user.profilePicture.toString('base64') 
                        : null,
                }
                : null,
            likes: post.likes.map((like) => like.toString()),

            comments: post.comments.map((comment) => ({
                ...comment,
                _id: comment._id.toString(),
                user: comment.user
                    ? {
                        ...comment.user,
                        _id: comment.user._id.toString(),
                        profilePicture: comment.user.profilePicture 
                            ? comment.user.profilePicture.toString('base64') 
                            : null,
                    }
                    : null,
                replies: comment.replies.map((reply) => ({
                    ...reply,
                    _id: reply._id.toString(),
                    user: reply.user
                        ? {
                            ...reply.user,
                            _id: reply.user._id.toString(),
                            profilePicture: reply.user.profilePicture 
                                ? reply.user.profilePicture.toString('base64') 
                                : null,
                        }
                        : null,
                    createdAt: reply.createdAt.toISOString(),
                    updatedAt: reply.updatedAt.toISOString(),
                })),
                createdAt: comment.createdAt.toISOString(),
                updatedAt: comment.updatedAt.toISOString(),
            })),

            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }));

        return serializedPosts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
    }
}
