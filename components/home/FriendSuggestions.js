"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthData from "@/hooks/useAuthData";
import useSocket from "@/hooks/useSocket";
import useFetchFriends from "@/hooks/useFetchFriends";
import useFollowSocket from "@/hooks/useFollowSocket"; // Import custom hook
import FollowButton from '@/components/home/FollowButton';


export default function FriendSuggestions() {
  const socket = useSocket();
  const { user } = useAuthData();
  const { suggestedFriends } = useFetchFriends();

  useFollowSocket(socket);

  return (
    <Card>
      <CardHeader>
        <CardTitle>People you might know</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desktop: Vertical List */}
        <div className="hidden lg:block">
          {suggestedFriends?.map(
            (suggestion) =>
              suggestion?._id !== user?._id && (
                <div
                  key={suggestion.username}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={suggestion?.profilePicture}
                        alt={suggestion.username}
                      />
                      <AvatarFallback>{suggestion.username}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{suggestion.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.username}
                      </p>
                    </div>
                  </div>

                  <FollowButton suggestion={suggestion} user={user} />
                </div>
              )
          )}
        </div>

        {/* Mobile/Tablet: Horizontal Scrollable Carousel */}
        <div className="flex space-x-4 overflow-x-auto lg:hidden scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-200 py-2">
          {suggestedFriends?.map(
            (suggestion) =>
              suggestion?._id !== user?._id && (
                <div
                  key={suggestion.username}
                  className="min-w-[100px] flex-shrink-0 p-4 border rounded-md transition"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={suggestion?.profilePicture}
                        alt={suggestion.username}
                      />
                      <AvatarFallback>{suggestion.username}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-medium">{suggestion.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.username}
                      </p>
                    </div>
                    <FollowButton suggestion={suggestion} user={user} />
                  </div>
                </div>
              )
          )}
        </div>
      </CardContent>

    </Card>
  );
}