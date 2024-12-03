import AddPostSection from '@/components/home/AddPostSection';
import FriendSuggestions from '@/components/home/FriendSuggestions';
import FriendsCarousel from '@/components/FriendSuggestion/FriendsCarousel';
import PostCard from '@/components/home/PostCard';
import dbConnect from '@/lib/db';
import Post from '@/models/PostModel';


const Home = async () => {
  await dbConnect()
  const posts = await Post?.find()
    ?.populate('user', 'username profilePicture')
    ?.lean();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 xl:max-w-2xl mx-auto">
        <AddPostSection />
        <div className="lg:hidden md:block py-2">
          <FriendSuggestions />
        </div>
        {posts?.reverse()?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <FriendSuggestions />
        </div>
      </div>
    </div>
  );
}

export default Home