import Image from "next/image";

export default function renderMedia(fileTypes,post){
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