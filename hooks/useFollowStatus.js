import { useSelector } from "react-redux";

const useFollowStatus = () => {
  const { suggestedFriends } = useSelector((state) => state.follow);

  // Check if the target user is followed
  const isFollowed = (targetUserId, action) => {
    return suggestedFriends?.find(
      (follow) =>
        (follow?.follows?.targetUserId === targetUserId || follow?.follows?.userId === targetUserId) &&
        follow?.follows?.status === action
    );
  };

  // Check if there is a follow request (either sent or received)
  const isRequested = (targetUserId, action) => {
    return suggestedFriends?.some(
      (follow) =>
        (follow?.follows?.userId === targetUserId || follow?.follows?.targetUserId === targetUserId) &&
        follow?.follows?.status === action
    );
  };

  return { isFollowed, isRequested };
};

export default useFollowStatus;
