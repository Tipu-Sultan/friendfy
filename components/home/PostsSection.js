import PostCard from "@/components/home/PostCard";

const PostsSection = async ({posts}) => {
  return (
    <div>
      {[...posts]?.reverse().map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostsSection;
