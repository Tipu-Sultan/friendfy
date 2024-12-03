import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedFrineds } from "../redux/slices/FollowSlice";
import useAuthData from "./useAuthData";

const useFetchFriends = () => {
  const dispatch = useDispatch();
  const { user } = useAuthData();
  
  // Access suggested friends from Redux state
  const { suggestedFriends, status, error } = useSelector((state) => state.follow);

  useEffect(() => {
    // Fetch friends only if the list is empty
    if (suggestedFriends?.length === 0 && user?._id) {
      dispatch(fetchSuggestedFrineds(user?._id));
    }
  }, [dispatch, suggestedFriends?.length, user?._id]);

  return { suggestedFriends, status, error };
};

export default useFetchFriends;
