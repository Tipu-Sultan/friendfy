import Image from "next/image";

export default function renderMedia(fileTypes, post) {
  if (!post) return null;

  return (
    <div className="mb-4">
      {/* Display Text Content First */}
      {post?.contentType === "text/plain" && post?.content && (
        <p
          className="mb-2 text-sm break-words"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{
            __html: post.content.replace(/\n/g, "<br />"),
          }}
        ></p>
      )}

      {/* Display Image */}
      {post?.contentType?.startsWith("image") && post?.mediaUrl && (
        <>
          <p
            className="mb-2 text-sm break-words"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br />"),
            }}
          ></p>
          <div className="relative w-full max-h-80 overflow-hidden">
            <Image
              src={post.mediaUrl}
              alt="Preview"
              className="w-full max-h-60 object-contain"
              width={100}
              height={100}
            />
          </div>
        </>
      )}

      {/* Display Video */}
      {post?.contentType?.startsWith("video") && post?.mediaUrl && (
        <>
          <p
            className="mb-2 text-sm break-words"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br />"),
            }}
          ></p>
          <div className="relative overflow-hidden">
            <video controls className="max-h-96 w-full object-cover rounded-lg">
              <source src={post.mediaUrl} type={post.contentType} />
              Your browser does not support the video tag.
            </video>
          </div>
        </>
      )}
    </div>
  );
}
