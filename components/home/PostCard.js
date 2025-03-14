'use client';
import { Button } from '@/components/ui/button'; 
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import { deletePost, likeOrUnlikePost, updateDeletePost, updateLikeIntoPost } from '@/redux/slices/postSlice';
import { useDispatch } from 'react-redux';
import { timeAgo } from '@/utils/timeAgo';
import { useUser } from '@/hooks/useUser';
import { getAblyClient } from '@/lib/ablyClient';

export default function PostCard({ post, isLoading }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const {ablyClient} = getAblyClient();

  const publishEvent = (eventName, data) => {
    if (!ablyClient) {
      console.error("Ably client is not connected yet");
      return;
    }
  
    const channel = ablyClient.channels.get("post-actions");
    channel.publish(eventName, data, (err) => {
      if (err) console.error("Error publishing event:", err);
      else console.log(`Event "${eventName}" published successfully`);
    });
  };
  const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];


  const handleLike = async () => {
    if (!ablyClient) return; // Ensure Ably client is initialized

    // Emit the like event to Ably
    publishEvent("like-post", { postId: post?._id, userId: user?._id })
    // Dispatch like action
    await dispatch(likeOrUnlikePost({ postId: post?._id, userId: user?._id })).unwrap();
  };

  const handleDelete = async (postId) => {
    if (!ablyClient) return; // Ensure Ably client is initialized

    // Dispatch delete action
    const res = await dispatch(deletePost(postId)).unwrap();
    if (res.status === 200) {
      // Emit the delete event to Ably
      ablyClient.channels.get("post-actions").publish("delete-post", { postId: postId });
    }
  };

  useEffect(() => {
    if (!ablyClient) return;


    const channel = ablyClient.channels.get("post-actions");
    
    // Listen for the post-liked event from Ably
    channel.subscribe("like-post", (data) => {
      if (data?.postId === post._id) {
        dispatch(updateLikeIntoPost({ postId: data.postId, userId: data.userId }));
      }
    });

    // Listen for the post-deleted event from Ably
    channel.subscribe("post-deleted", (data) => {
      if (data?.postId === post._id) {
        dispatch(updateDeletePost({ postId: data.postId }));
      }
    });

    // Clean up listeners when the component unmounts
    return () => {
      channel.unsubscribe("post-liked");
      channel.unsubscribe("post-deleted");
    };
  }, [dispatch, ablyClient, post._id]);

  const renderMedia = () => {
    if (fileTypes.includes(post?.contentType) && post?.mediaUrl) {
      return (
        <div className="relative w-full max-h-80 overflow-hidden mb-4">
          <Image
            src={post?.mediaUrl}
            alt="Preview"
            className="w-full max-h-60 object-contain"
            width={100}
            height={100}
          />
        </div>
      );
    }

    if (post?.contentType === 'video/mp4' && post?.mediaUrl) {
      return (
        <div className="relative overflow-hidden mb-4">
          <video controls className="max-h-96 w-full object-cover rounded-lg">
            <source src={post?.mediaUrl} type={post?.contentType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (post?.contentType === 'text/plain' && post?.content) {
      return (
        <p
          className="mb-4 text-sm break-words"
          style={{ whiteSpace: 'pre-line' }}
          dangerouslySetInnerHTML={{
            __html: post?.content
              ?.match(/.{1,32}/g) // Split the content into chunks of 50 characters
              ?.join('<br />'),   // Join chunks with <br /> tags
          }}
        ></p>
      );
    }

    return null; // If no content type matches
  };

  return (
    <Card className="mb-6 relative max-w-lg mx-auto sm:max-w-xl md:max-w-2xl">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <Image
                src={post?.user?.profilePicture || '/default-avatar.png'} // Fallback if no profile picture
                alt={post?.user?.username}
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
            </Avatar>
            <div className="truncate">
              <h3 className="font-semibold text-sm md:text-base">{post?.user?.username}</h3>
              <p className="text-xs text-muted-foreground">{timeAgo(post?.createdAt)}</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
              <Button variant="ghost" size="icon" >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className=""
            >
              <DropdownMenuItem >Edit</DropdownMenuItem>
              <DropdownMenuItem >Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(post?._id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                {isLoading === 'deletePost' ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render media based on contentType */}
        {renderMedia()}

        <div className="flex items-center justify-start space-x-4 mt-4">
          <Button onClick={handleLike} variant="ghost" size="sm" className="flex items-center">
            <Heart
              className={`w-5 h-5 mr-2 ${post.likes.includes(user?._id) ? 'text-red-600' : ''}`}
            />
            <span className="text-xs sm:text-sm">{post?.likes?.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            <span className="text-xs sm:text-sm">{post?.comments?.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            <span className="text-xs sm:text-sm">Share</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
