import React from 'react'
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import useFollowStatus from '@/hooks/useFollowStatus';
import { acceptFollowRequest, removeFollowRequest, sendFollowRequest } from "@/redux/slices/FollowSlice";
import { useDispatch } from "react-redux";



const FollowButton = ({suggestion,user}) => {
    const dispatch = useDispatch();

    const { isFollowed, isRequested } = useFollowStatus();

    const handleFollowRequest = (userId, targetUserId) => {
        dispatch(sendFollowRequest({ userId, targetUserId }));
      };
    
      const handleUnfollow = (userId, targetUserId) => {
        dispatch(removeFollowRequest({ userId, targetUserId }));
      };
    
      const handleAcceptFollowRequest = (userId, targetUserId) => {
        dispatch(acceptFollowRequest({ userId, targetUserId }));
      };

    return (
        <div>
            {isFollowed(suggestion._id, 'confirmed') ? (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-green-500"
                        onClick={() => handleUnfollow(user?._id, suggestion._id)}
                    >
                        <CheckCircle className="mr-1" />
                        Following
                    </Button>
                </div>
            ) : (isRequested(suggestion?._id, 'requested') && suggestion?.follows?.targetUserId === user?._id) ? (
                // Receiver's Side: "Confirm" and "Delete"
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcceptFollowRequest(suggestion._id, user?._id)}
                    >
                        <CheckCircle className="mr-1" />
                        Confirm
                    </Button>
                    <X
                        className="cursor-pointer text-red-500"
                        onClick={() => handleUnfollow(suggestion._id, user?._id)}
                    />
                </div>
            ) : (isRequested(suggestion?._id, 'requested') && suggestion?.follows?.userId === user?._id) ? (
                // Sender's Side: "Requested"
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(user?._id, suggestion._id)}
                    >
                        Cancel Request
                    </Button>
                </div>
            ) : (
                // Both sides: "Follow"
                <Button
                    onClick={() => handleFollowRequest(user?._id, suggestion._id)}
                    variant="outline"
                    size="sm"
                >
                    Follow
                </Button>
            )}
        </div>
    )
}

export default FollowButton