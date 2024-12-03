import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateFollowStatus, removeFollowStatus } from "@/redux/slices/FollowSlice";

const useFollowSocket = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.on("follow-request-sent", ({ userId, targetUserId }) => {
      dispatch(updateFollowStatus({ userId, targetUserId, status: "requested" }));
    });

    socket.on("follow-request-received", ({ userId, targetUserId }) => {
      dispatch(updateFollowStatus({ userId, targetUserId, status: "requested" }));
    });

    socket.on("follow-update", ({ userId, targetUserId, status }) => {
      dispatch(updateFollowStatus({ userId, targetUserId, status }));
    });

    socket.on("follow-request-deleted", ({ userId, targetUserId }) => {
      dispatch(removeFollowStatus({ userId, targetUserId }));
    });

    // Clean up the socket listeners on unmount
    return () => {
      socket.off("follow-request-sent");
      socket.off("follow-request-received");
      socket.off("follow-update");
      socket.off("follow-request-deleted");
    };
  }, [dispatch, socket]);
};

export default useFollowSocket;
