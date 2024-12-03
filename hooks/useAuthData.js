import { useSelector } from 'react-redux';

const useAuthData = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux store
  const isAuthenticated = localStorage.getItem('authToken');

  return { user, isAuthenticated };
};

export default useAuthData;
