import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedFrineds } from "../redux/slices/FollowSlice";
import { useUser } from "./useUser";

const useFetchFriends = () => {
  const dispatch = useDispatch();
  const { user} = useUser();

  // Access suggested friends from Redux state
  const { suggestedFriends, status, error } = useSelector((state) => state.follow);

  useEffect(() => {
    // Fetch friends only if the list is empty
    if (suggestedFriends?.length === 0 && user?.id) {
      dispatch(fetchSuggestedFrineds(user?.id));
    }
  }, [dispatch, suggestedFriends?.length, user?.id]);

  return { suggestedFriends, status, error };
};

export default useFetchFriends;
