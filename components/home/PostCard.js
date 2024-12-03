import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


export default function PostCard({ post }) {
  
  const renderMedia = () => {
    if (post?.contentType === 'image/jpeg' && post?.mediaUrl) {
      return (
        <div className="relative w-full max-h-80 overflow-hidden mb-4">
          <Image
            src={post?.mediaUrl}
            className="rounded-lg"
            width={500}
            height={500}
            alt={post?.mediaUrl}
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
    <Card className="mb-6 relative">
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
            <div>
              <h3 className="font-semibold">{post?.user?.username}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(post?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} className="z-50">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Clear Chat</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render media based on contentType */}
        {renderMedia()}

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" >
            <Heart className="w-5 h-5 mr-2" />
            {post?.likes?.length}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-5 h-5 mr-2" />
            {post?.comments?.length}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
}
