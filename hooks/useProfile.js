import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUsersDetails } from '../redux/slices/authSlice'; // Replace with actual slice import
import { addRecentChat, createUser } from '../redux/slices/chatSlice'; // Replace with actual slice import
import useAuthData from './useAuthData'; // Replace with actual hook path
import { useRouter } from 'next/navigation';

export const useProfile = (username) => {
  const { user } = useAuthData();
  const router = useRouter();
  const dispatch = useDispatch();

  const { profileData} = useSelector((state) => state.auth);
  const { chatLoading, error } = useSelector((state) => state.chat);


  useEffect(() => {
    if (username) {
      dispatch(fetchUsersDetails(username));
    }
  }, [dispatch, username]);

  const handleMessageClick = async (profileData) => {
    const userData = {
      createdBy: user?._id,
      id: profileData?._id,
      name: profileData.username,
      type: 'user',
      profilePicture: profileData.profilePicture,
      lastMessage: 'new message',
    };
    dispatch(addRecentChat(userData));
    const res = await dispatch(createUser(userData)).unwrap();
    if(resizeBy.status===201){
      router.push(`/chat/${username}`);
    }
  };

  return {
    chatLoading,
    error,
    profileData,
    handleMessageClick,
  };
};