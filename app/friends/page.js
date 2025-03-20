"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, Users, Handshake } from "lucide-react";
import useFetchFriends from "@/hooks/useFetchFriends";
import FollowButton from "@/components/home/FollowButton";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function Friends() {
  const { user } = useUser();

  const { suggestedFriends } = useFetchFriends();
  const [activeTab, setActiveTab] = useState("followers");

  // Find users you are following (where userId === user._id)
  const following = suggestedFriends.filter(
    (follow) =>
      follow?.follows?.userId === user?.id &&
      follow?.follows?.status === "confirmed"
  );

  // Find users who are following you (where targetUserId === user._id)
  const followers = suggestedFriends.filter(
    (follow) =>
      follow?.follows?.targetUserId === user?.id &&
      follow?.follows?.status === "confirmed"
  );

  // Find users who are suggested (not already in followers or following)
  const suggestions = suggestedFriends.filter(
    (suggestion) =>
      suggestion?.follows?.status !== "confirmed" ||
      (suggestion?.follows?.status === "requested" &&
        suggestion?.follows?.userId !== user?.id &&
        suggestion?.follows?.targetUserId !== user?.id)
  );

  // Find users who have requested to follow you but you haven't confirmed yet
  const requested = suggestedFriends.filter(
    (request) =>
      request?.follows?.status === "requested" &&
      request?.follows?.targetUserId === user?.id
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Friends</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search friends..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="followers" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="followers"
            className="flex items-center gap-2"
            onClick={() => setActiveTab("followers")}
          >
            <Users className="h-4 w-4" />
            Followers
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="flex items-center gap-2"
            onClick={() => setActiveTab("following")}
          >
            <UserPlus className="h-4 w-4" />
            Following
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="flex items-center gap-2"
            onClick={() => setActiveTab("suggestions")}
          >
            <UserMinus className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger
            value="Requested"
            className="flex items-center gap-2"
            onClick={() => setActiveTab("Requested")}
          >
            <Handshake className="h-4 w-4" />
            Requested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers">
          <div className="grid gap-4">
            {followers?.map((follower) => (
              <Card key={follower._id} className="p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${follower?.username}`}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={follower.profilePicture}
                        alt={follower.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{follower.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {follower.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <FollowButton suggestion={follower} user={user} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following">
          <div className="grid gap-4">
            {following?.map((follow) => (
              <Card key={follow._id} className="p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${follow?.username}`}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={follow.profilePicture}
                        alt={follow.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{follow.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {follow.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <FollowButton  suggestion={follow} user={user} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion._id} className="p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${suggestion?.username}`}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={suggestion.profilePicture}
                        alt={suggestion.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{suggestion.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {0} mutual friends
                        </p>
                      </div>
                    </div>
                  </Link>
                  <FollowButton  suggestion={suggestion} user={user} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Requested">
          <div className="grid gap-4">
            {requested?.map((suggestion) => (
              <Card key={suggestion._id} className="p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${suggestion?.username}`}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={suggestion.profilePicture}
                        alt={suggestion.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{suggestion.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {0} mutual friends
                        </p>
                      </div>
                    </div>
                  </Link>
                  <FollowButton suggestion={suggestion} user={user} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
