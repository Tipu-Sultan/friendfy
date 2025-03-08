"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Image, Users, Bookmark, LetterText } from 'lucide-react';
import { use } from 'react';
import RenderMedia from '@/components/RenderMedia'
import {useProfile} from '@/hooks/useProfile'
import { useUser } from '@/hooks/useUser';

export default function Profile({ params }) {
  const { user } = useUser();
  const { username } = use(params);
  const { chatLoading, error, profileData, handleMessageClick } = useProfile(username);
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row  items-center gap-6">
          <img
            src={profileData?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{profileData?.username || 'Loading...'}</h1>
              <Button>Edit Profile</Button>
              {
                profileData?.username!==user?.username&&(
                  <Button onClick={() => handleMessageClick(profileData)}>{chatLoading==='createUser'?'wait...':'Message'}</Button>
                )
              }
            </div>
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="font-bold">{profileData?.posts?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profileData?.followers?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profileData?.following?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
            <p className="text-sm">{profileData?.bio || 'Software developer and tech enthusiast. Love coding and sharing knowledge.'}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="texts" className="flex items-center gap-2">
            <LetterText className="h-4 w-4" />
            texts
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
            {profileData?.posts?.map((post) => (
              <RenderMedia type={'media'} key={post._id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="texts">
          <div className="text-center py-12 text-muted-foreground">
            <div className="grid grid-cols-3 gap-1">
              {profileData?.posts?.map((post) => (
                <RenderMedia type={'text/plain'} key={post._id} post={post} />
              ))}
            </div>
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
