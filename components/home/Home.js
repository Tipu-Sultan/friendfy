"use client";
import AddPostSection from "@/components/home/AddPostSection";
import FriendSuggestions from "@/components/home/FriendSuggestions";
import PostCard from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPosts } from "@/redux/slices/postSlice";
import { useUser } from "@/hooks/useUser";
import usePostCard from "@/hooks/usePostCard";

const Home = ({ posts: initialPosts }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const [loading, setLoading] = useState(true); // Track API loading state
  const { user } = useUser();
  const [editingPost, setEditingPost] = useState(null);

  const {
    postChannel,
    fileTypes,
    showComments,
    showReportModal,
    setShowComments,
    setReportModal,
    handleDeletePost,
    handleLikePost,
  } = usePostCard();

  useEffect(() => {
    if (initialPosts.length > 0) {
      dispatch(setPosts(initialPosts));
    }
    setTimeout(() => setLoading(false), 1000); // Simulating API delay
  }, [dispatch, initialPosts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-8 lg:px-16">
      {/* Left Section */}
      <div className="lg:col-span-2 mx-auto w-full max-w-[550px]">
        <AddPostSection
          editingPost={editingPost}
          setEditingPost={setEditingPost}
        />

        {/* Friend Suggestions (Mobile Only) */}
        <div className="lg:hidden md:block py-4">
          {loading ? (
            <Card>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <FriendSuggestions />
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-40 w-full mt-4 rounded-md" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          // No Posts Message
          <div className="flex flex-col items-center justify-center text-center mt-8">
            <img
              src="/images/no-posts.svg"
              alt="No posts"
              className="w-48 h-48 object-contain"
            />
            <p className="text-lg font-semibold text-gray-700 mt-4">
              Oops! No posts yet.
            </p>
            <p className="text-sm text-gray-500">
              Be the first to share something!
            </p>
          </div>
        ) : (
          // Display Posts
          posts
            .slice()
            .reverse()
            .map((post) => (
              <PostCard
                key={post._id}
                user={user}
                post={post}
                setEditingPost={setEditingPost}
                fileTypes={fileTypes}
                showComments={showComments}
                showReportModal={showReportModal}
                setShowComments={setShowComments}
                setReportModal={setReportModal}
                handleDeletePost={handleDeletePost}
                handleLikePost={handleLikePost}
              />
            ))
        )}
      </div>

      {/* Right Section (Desktop Only) */}
      <div className="hidden lg:block sticky top-20">
        {loading ? (
          <Card>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <FriendSuggestions />
        )}
      </div>
    </div>
  );
};

export default Home;
