import { AspectRatio, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const {socket} = useAuth();
  const token = localStorage.getItem("token");
  const isLogin = localStorage.getItem("userData");
  const user = isLogin ? JSON.parse(isLogin) : null;
  const API_HOST = process.env.REACT_APP_API_HOST;
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendAction, SetIsSendAction] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkEditPost, setCheckEditPost] = useState(false);
  const [editPost, setEditPost] = useState(null);


  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const [postText, setPostText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [posts, setPosts] = useState([]);

  const handlePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (postText.trim() !== "") {
        formData.append("content", postText);
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      formData.append("user", user._id);
      formData.append("username", user.username);
      formData.append("profileImage", user.profileImage);
      formData.append(
        "contentType",
        selectedFile ? selectedFile.type : "text/plain"
      );

      const response = await axios.post(
        `${API_HOST}/api/post/addpost`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setPostText("");
        setSelectedFile(null);
        setLoading(false);
        handleCloseModal();
        const newPostData = response.data.newPost;
        socket.emit('addPost', newPostData)
      } else {
        setLoading(false);
        console.error("Failed to create post");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };


  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${API_HOST}/api/post/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userID: user.username }),
      });

      if (response.ok) {
        const postsData = await response.json();
        socket.emit('handleLike', postsData)
      } else {
        console.error('Failed to update likes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addComment = async (postId) => {
    try {
      const response = await axios.post(
        `${API_HOST}/api/post/add-comment/${postId}`,
        {
          userID: user._id,
          profileImage: user.profileImage,
          username: user.username,
          text: commentText,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const postIndex = posts.findIndex((post) => post._id === postId);
        const commentData = response.data.commentPost.comments
        socket.emit('addComment', postIndex, commentData);
        setCommentText('');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const deleteComment = async (postId, cmtId) => {
    try {
      const response = await axios.delete(
        `${API_HOST}/api/post/delete-comment/${postId}/${cmtId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            const updatedComments = post.comments.filter(comment => comment._id !== cmtId);
            return {
              ...post,
              comments: updatedComments,
            };
          }
          return post;
        });
        socket.emit('deleteComment', updatedPosts);
        setCommentText('');
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteAuthPost = async (postId) => {
    try {
      const response = await axios.delete(`${API_HOST}/api/post/delete-post/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedPosts = posts.filter((post) => post._id !== postId);
        socket.emit('deletePost', updatedPosts);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch(`${API_HOST}/api/post/getposts`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
  }, []);

  const RenderContent = (contentType, media, content) => {
    if (contentType === "image") {
        return (
            <>
                {content && <Text py={2}>{content}</Text>}
                <Image
                    borderRadius="lg"
                    src={`${media}`}
                    alt="Post Image"
                    objectFit="cover"
                />
            </>
        );
    } else if (contentType === "video") {
        return (
            <>
                {content && <Text py={2}>{content}</Text>}
                <AspectRatio ratio={16 / 9}>
                    <video
                        src={`${media}`}
                        title="Post Video"
                        allowFullScreen
                        muted
                        controls
                        style={{ width: '100%', height: '100%' }} // Set video dimensions
                    ></video>
                </AspectRatio>
            </>
        );
    } else if (contentType === "audio") {
        return (
            <>
                {content && <Text py={2}>{content}</Text>}
                <audio
                    src={`${media}`}
                    title="Post Audio"
                    controls
                ></audio>
            </>
        );
    } else if (contentType === "text") {
        // Split content by new lines and map each line to a separate <Text> element
        const lines = content.split('\n').map((line, index) => (
          <Text key={index} mb="2">{line}</Text>
      ));
      return <>{lines}</>;
    } else {
        return <Text mb="4">Unsupported content type</Text>;
    }
};


  useEffect(() => {
    socket?.on('addComment', (postIndex, commentData) => {
      if (postIndex !== -1) {
        const updatedPosts = [...posts];
        updatedPosts[postIndex].comments = commentData;
        setPosts(updatedPosts)
      }
    });

    socket?.on('deleteComment', (updatedPosts) => {
      setPosts(updatedPosts);
    });

    socket?.on('handleLike', (postsData) => {
      setPosts((prevPosts) => {
        return prevPosts.map((post) =>
          post._id === postsData.likedPost._id ? postsData.likedPost : post
        );
      });
    });

    socket?.on('deletePost', (updatedPosts) => {
      setPosts(updatedPosts);
    });
    socket?.on('addPost', (newPostData) => {
      setPosts((prevPosts) => [...prevPosts, newPostData]);
    });

    return () => {
      socket?.off('addPost');
      socket?.off('deletePost');
      socket?.off('addComment');
      socket?.off('deleteComment');
      socket?.off('handleLike');
    };

  }, [posts]);

  const handleSharePost = (postId, media, type) => {
    navigator.clipboard.writeText(media);
    navigate('/chat')
    SetIsSendAction(true);
  }

  const EditPostByAuthUser = (post) =>{
    handleOpenModal(true);
    setCheckEditPost(true);
    setEditPost(post)
  }

  return (
    <PostContext.Provider
      value={{
        isSendAction,
        handleSharePost,
        RenderContent,
        user,
        posts,
        setPosts,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        loading,
        selectedFile,
        handleFileChange,
        handlePost,
        postText,
        setPostText,
        handleLike,
        addComment,
        deleteComment,
        setCommentText,
        commentText,
        deleteAuthPost,
        EditPostByAuthUser,
        checkEditPost,
        editPost,
        setCheckEditPost,
        setEditPost
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
