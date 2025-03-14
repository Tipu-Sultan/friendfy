import AddPostSection from '@/components/home/AddPostSection';
import FriendSuggestions from '@/components/home/FriendSuggestions';
import PostCard from '@/components/home/PostCard';
import { Skeleton } from '@/components/ui/skeleton';

const Home = ({posts}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Section */}
      <div className="lg:col-span-2 max-w-[500px] min-w-[400px] mx-auto">
        {/* Add Post Section */}
        <AddPostSection />

        {/* Friend Suggestions for Mobile */}
        <div className="lg:hidden md:block py-2">
          <FriendSuggestions />
        </div>

        {/* Posts Section */}
        {posts.length===0? (
          // Skeletons for loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-44 w-full" />
              <div className="flex space-x-2 mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))
        ) : (
          [...posts]?.reverse().map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <FriendSuggestions />
        </div>
      </div>
    </div>
  );
};

export default Home;
