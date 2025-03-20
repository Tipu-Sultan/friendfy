import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import useFollowStatus from "@/hooks/useFollowStatus";
import {
  acceptFollowRequest,
  removeFollowRequest,
  sendFollowRequest,
} from "@/redux/slices/FollowSlice";
import { useDispatch } from "react-redux";
import useFollowSocket from "@/hooks/useFollowSocket";
import { getAblyClient } from "@/lib/ablyClient";

const FollowButton = ({ suggestion, user }) => {
  const dispatch = useDispatch();
  const ablyClient = getAblyClient(user?.id);
  const channelName = `follow-${[suggestion._id, user?.id].sort().join("-")}`;
  const userChannel = ablyClient?.channels?.get(channelName);
  const { isFollowed, isRequested } = useFollowStatus();

  const publishEvent = (eventName, data) => {
    if (!ablyClient) {
      console.error("Ably client is not connected yet");
      return;
    }

    // Publish the event only to that user's channel
    userChannel.publish(eventName, data, (err) => {
      if (err) {
        console.error("Error publishing event:", err);
      } else {
        console.log(
          `Event "${eventName}" published to user-${data.targetUserId} successfully`
        );
      }
    });
  };

  const handleFollowRequest = (userId, targetUserId) => {
    publishEvent("follow-request-sent", { userId, targetUserId });
    dispatch(sendFollowRequest({ userId, targetUserId }));
  };

  const handleUnfollow = (userId, targetUserId) => {
    publishEvent("follow-request-deleted", { userId, targetUserId });
    dispatch(removeFollowRequest({ userId, targetUserId }));
  };

  const handleAcceptFollowRequest = (userId, targetUserId) => {
    publishEvent("follow-update", {
      userId,
      targetUserId,
      status: "confirmed",
    });
    dispatch(acceptFollowRequest({ userId, targetUserId }));
  };

  useFollowSocket(userChannel, ablyClient);

  return (
    <div>
      {isFollowed(suggestion._id, "confirmed") ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-500"
            onClick={() => handleUnfollow(user?.id, suggestion._id)}
          >
            <CheckCircle className="mr-1" />
            Following
          </Button>
        </div>
      ) : isRequested(suggestion?._id, "requested") &&
        suggestion?.follows?.targetUserId === user?.id ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAcceptFollowRequest(suggestion._id, user?.id)}
          >
            <CheckCircle className="mr-1" />
            Confirm
          </Button>
          <X
            className="cursor-pointer text-red-500"
            onClick={() => handleUnfollow(suggestion._id, user?.id)}
          />
        </div>
      ) : isRequested(suggestion?._id, "requested") &&
        suggestion?.follows?.userId === user?.id ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUnfollow(user?.id, suggestion._id)}
          >
            Cancel Request
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => handleFollowRequest(user?.id, suggestion._id)}
          variant="outline"
          size="sm"
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default FollowButton;
