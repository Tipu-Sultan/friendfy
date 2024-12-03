"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Image, Users, Bookmark } from 'lucide-react';

export default function Profile() {
  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
      likes: 42,
      comments: 12,
    },
    // Add more posts
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">John Doe</h1>
              <Button>Edit Profile</Button>
            </div>
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="font-bold">142</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">2.1k</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">1.2k</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
            <p className="text-sm">
              Software developer and tech enthusiast. Love coding and sharing knowledge.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tagged
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square relative group cursor-pointer"
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4">
                  <div className="flex items-center">
                    <Image className="h-5 w-5 mr-2" />
                    {post.likes}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {post.comments}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-12 text-muted-foreground">
            No saved posts yet
          </div>
        </TabsContent>

        <TabsContent value="tagged">
          <div className="text-center py-12 text-muted-foreground">
            No tagged posts yet
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}