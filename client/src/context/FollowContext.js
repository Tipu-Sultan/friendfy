import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const {socket} = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState([]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("token");
  const isLogin = localStorage.getItem("userData");
  const isUser = isLogin ? JSON.parse(isLogin) : null;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const usersResponse = await fetch(`${API_HOST}/api/auth/get-users`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
  }, [API_HOST, token]);

  const handleFollow = async (username, action) => {
    try {
      const response = await axios.post(
        `${API_HOST}/api/follow/follow-reuqest`,
        { senderUsername: isUser.username, receiverUsername: username, action: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const { followingbyreceiver, followedbySender } = response.data;

        localStorage.setItem("userData", JSON.stringify(followedbySender));
        const logginUser = isUser.username;
        socket.emit('follow-request', followingbyreceiver, followedbySender, username, logginUser);

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };


  const AlgoliaSearch = async () => {
    if (query.length > 1) {
      try {
        const filteredUsers = users.filter(user => {
          return (
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.firstname.toLowerCase().includes(query.toLowerCase())||
            user.lastname.toLowerCase().includes(query.toLowerCase())
          );
        });
        setResults(filteredUsers);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  useEffect(() => {
   
    socket?.on('follow-request', (followingbyreceiver, followedbySender, username, logginUser) => {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.username === username) {
            return followingbyreceiver;
          }
          if (user.username === logginUser) {
            return followedbySender;
          }

          return user;
        });
      });
    });

    return () => {
      socket?.off('follow-request');
    };
  }, [socket]);


  return (
    <FollowContext.Provider
      value={{
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        users,
        isUser,
        setUsers,
        handleFollow,
        AlgoliaSearch,
        results,
        setResults,
        query,
        setQuery,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
