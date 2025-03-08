import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateFollowStatus, removeFollowStatus } from "@/redux/slices/FollowSlice";

const useFollowSocket = (channel,ablyClient) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ablyClient) return;


    const handleFollowRequestSent = ({ data }) => {
      const { userId, targetUserId } = data;
      dispatch(updateFollowStatus({ userId, targetUserId, status: "requested" }));
    };

    const handleFollowRequestReceived = ({ data }) => {
      const { userId, targetUserId } = data;
      dispatch(updateFollowStatus({ userId, targetUserId, status: "requested" }));
    };

    const handleFollowUpdate = ({ data }) => {
      const { userId, targetUserId, status } = data;
      dispatch(updateFollowStatus({ userId, targetUserId, status }));
    };

    const handleFollowRequestDeleted = ({ data }) => {
      const { userId, targetUserId } = data;
      dispatch(removeFollowStatus({ userId, targetUserId }));
    };

    // Subscribe to Ably events
    channel.subscribe("follow-request-sent", handleFollowRequestSent);
    channel.subscribe("follow-request-received", handleFollowRequestReceived);
    channel.subscribe("follow-update", handleFollowUpdate);
    channel.subscribe("follow-request-deleted", handleFollowRequestDeleted);

    return () => {
      // Unsubscribe when component unmounts
      channel.unsubscribe("follow-request-sent", handleFollowRequestSent);
      channel.unsubscribe("follow-request-received", handleFollowRequestReceived);
      channel.unsubscribe("follow-update", handleFollowUpdate);
      channel.unsubscribe("follow-request-deleted", handleFollowRequestDeleted);
    };
  }, [ablyClient, dispatch]);
};

export default useFollowSocket;
