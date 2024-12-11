import Image from "next/image";
import { Users,Image as LImage } from "lucide-react"; // You can use any icon library you prefer

const RenderMedia = ({ type, post }) => {
  // Render media (image/video)
  if (type === 'media') {
    if (post?.contentType === 'image/jpeg' && post?.mediaUrl) {
      return (
        <div className="aspect-square relative group cursor-pointer">
          <Image
            src={post?.mediaUrl}
            alt="Post"
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4">
            <div className="flex items-center">
              <LImage className="h-5 w-5 mr-2" />
              {post?.likes.length || 0} 
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {post?.comments.length || 0} 
            </div>
          </div>
        </div>
      );
    }

    if (post?.contentType === 'video/mp4' && post?.mediaUrl) {
      return (
        <div className="aspect-square relative group cursor-pointer">
          <video controls className="w-full h-full object-cover rounded-lg">
            <source src={post?.mediaUrl} type={post?.contentType} />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4">
            <div className="flex items-center">
              <LImage className="h-5 w-5 mr-2" />
              {post?.likes.length || 0}
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {post?.comments.length || 0}
            </div>
          </div>
        </div>
      );
    }
  }

  // Render text
  if (type === 'text/plain' && post?.content) {
    return (
      <p
        className="mb-4 text-sm break-words"
        style={{ whiteSpace: 'pre-line' }}
        dangerouslySetInnerHTML={{
          __html: post?.content
            ?.match(/.{1,32}/g) // Split the content into chunks of 32 characters
            ?.join('<br />'),   // Join chunks with <br /> tags
        }}
      ></p>
    );
  }

  return null; 
};

export default RenderMedia;
