import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateFollowStatus, removeFollowStatus } from "@/redux/slices/FollowSlice";
import { useSocket } from "@/components/socketContext";

const useFollowSocket = () => {
  const privateSocket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!privateSocket) return;

    privateSocket?.on("follow-request-sent", ({ userId, targetUserId }) => {
      dispatch(updateFollowStatus({ userId, targetUserId, status: "requested" }));
    });

    privateSocket?.on("follow-request-received", ({ userId, targetUserId }) => {
      dispatch(updateFollowStatus({ userId, targetUserId, status: "requested" }));
    });

    privateSocket?.on("follow-update", ({ userId, targetUserId, status }) => {
      dispatch(updateFollowStatus({ userId, targetUserId, status }));
    });

    privateSocket?.on("follow-request-deleted", ({ userId, targetUserId }) => {
      dispatch(removeFollowStatus({ userId, targetUserId }));
    });

    // Clean up the socket listeners on unmount
    return () => {
      privateSocket.off("follow-request-sent");
      privateSocket.off("follow-request-received");
      privateSocket.off("follow-update");
      privateSocket.off("follow-request-deleted");
    };
  }, [dispatch, privateSocket]);
};

export default useFollowSocket;
