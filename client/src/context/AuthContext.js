import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { setOnlineUser } from '../redux/slices/onlineUserSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const API_HOST = process.env.REACT_APP_API_HOST;
  const isLogin = localStorage.getItem("userData");
  const isUser = isLogin ? JSON.parse(isLogin) : null;

  const remember = localStorage.getItem("rememberMe");
  const isRemember = remember ? JSON.parse(remember) : null;

  const [user, setUser] = useState({ userInput: '', password: '', rememberMe: false });
  const [wait, setwait] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadedUser, setLoadedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isRemember !== null) {
      setUser(prevUser => ({
        ...prevUser,
        userInput: isRemember.userInput,
        password: isRemember.password,
      }));
    }
  }, [isRemember]);

  useEffect(() => {
    if (isUser) {
      const socket = io(process.env.REACT_APP_API_HOST, {
        query: {
          userId: isUser.username,
        }
      });
      setSocket(socket);
      socket?.on('getOnlineUsers', (onlineUser) => {
        setOnlineUsers(onlineUser);
        dispatch(setOnlineUser(onlineUser))
        localStorage.setItem('onlineUsers', JSON.stringify(onlineUser));

      })
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [])



  const handleInput = (e) => {
    const { name, value, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const login = async (userData) => {
    try {
      setwait(true)
      const response = await axios.post(`${API_HOST}/api/auth/login`, userData);

      const token = response?.data?.token;
      if (response.status === 200) {
        localStorage.setItem('token', token);
        const userDetailsResponse = await axios.get(`${API_HOST}/api/auth/user-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.setItem('userData', JSON.stringify(userDetailsResponse?.data));
        if (userData?.rememberMe) {
          localStorage.setItem('rememberMe', JSON.stringify(userData));
        } else {
          localStorage.removeItem('rememberMe');
        }
        toast.success(response?.data?.message);
        setwait(false)
        window.location.href = '/'
      } else if (response.status === 401) {
        toast.error(response?.data?.error);
        setwait(false)
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error(error.response?.data?.error)
      setwait(false)
    }
  };


  const forgotPassword = async (userValue) => {
    try {
      setwait(true);
      const response = await axios.post(`${API_HOST}/api/auth/forgot-password`, { userValue });
      if (response.status === 201) {
        toast.success(response.data.message);
        setwait(false);
        setTimeout(() => { navigate('/reset-password') }, 2000);

      } else {
        toast.error(response.data.error);
        setwait(false);
      }
    } catch (error) {
      console.error('Password reset request failed', error);
      toast.error('An error occurred while processing your request.');
      setwait(false);
    }
  };


  const resetPassword = async (resetInput) => {
    try {
      setwait(true);
      const response = await axios.post(`${API_HOST}/api/auth/reset-password`, resetInput);

      if (response.status === 200) {
        toast.success(response.data.message);
        setwait(false);
      } else {
        toast.error(response.data.error);
        setwait(false);
      }
    } catch (error) {
      console.error('Password reset failed', error);
      toast.error('An error occurred while processing your request.');
      setwait(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setwait(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_HOST}/api/auth/delete-user/${isUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        logout()
      } else {
        setwait(true);
        console.error("Failed to delete user:", response.data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setwait(true);
    }
  };

  const logout = async () => {
    try {
      if (isUser) {
        const token = localStorage.getItem('token');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.post(`${API_HOST}/api/auth/logout`, null, config);
      }

      localStorage.removeItem('userData');
      localStorage.removeItem('token');

      toast.success('Logout was successful');

      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };
  const token = localStorage.getItem('token');
  if (token) {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const tokenExpiration = tokenData.exp * 1000;
    if (Date.now() >= tokenExpiration) {
      logout();
    }
  }


  const getUserByUsername = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_HOST}/api/auth/user-details/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoadedUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        isRemember,
        wait,
        user,
        isUser,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        handleInput,
        login,
        forgotPassword,
        resetPassword,
        logout,
        handleDeleteUser,
        getUserByUsername,
        loadedUser,
        onlineUsers,
        socket
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
