import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
    const { socket } = useAuth();
    const isLogin = localStorage.getItem("userData");
    const isUser = isLogin ? JSON.parse(isLogin) : null;
    const API_HOST = process.env.REACT_APP_API_HOST;
    const [stories, setStories] = useState([]);
    const [wait, setWait] = useState(false);


    const [selectedFile, setSelectedFile] = useState(null);
    const [textData, setTtextData] = useState(null);
    const [contentType, setContentType] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedUserStories, setSelectedUserStories] = useState([]);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const handleContentTypeChange = (type) => {
        setContentType(type);
    };

    const handleSubmit = async () => {
        try {
            setWait(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("username", isUser?.username);
            formData.append("profileImage", isUser.profileImage);
            if (contentType === "text") {
                formData.append("text", textData);
                formData.append("contentType", 'text');
            } else if (contentType === "file" && selectedFile) {
                formData.append("file", selectedFile);
                const fileType = selectedFile.type.split("/")[0];
                formData.append("contentType", fileType);
            }

            const response = await axios.post(`${API_HOST}/api/story/store-story`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                toast.success('Story added successfully')
                const newStoryData = response.data.newStory;
                socket.emit('addStory', newStoryData)
                setWait(false);
            }

            onClose();
        } catch (error) {
            console.error("Error submitting story:", error.message);
            setWait(false);
        }
    };

    const handleDeleteStory = async (_id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.delete(`${API_HOST}/api/story/delete-story/${_id}`, { headers });

            if (response.status === 200) {
                const updatedStories = stories.filter((story) => story._id !== _id);
                socket.emit('deleteStory', updatedStories)
            } else {
                console.error('Failed to delete story:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting story:', error.message);
        }
    };


    useEffect(() => {
        fetch(`${API_HOST}/api/story/get-stories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch stories');
                }
                return response.json();
            })
            .then(data => {
                setStories(data);
            })
            .catch(error => {
                console.error('Error fetching stories:', error);
            });
    }, []);

    useEffect(() => {
        socket?.on('storyDeleted', (updatedStories) => {
            setStories(updatedStories);
        });
        socket?.on('storyAdded', (newStoryData) => {
            setStories((prevStories) => [...prevStories, newStoryData]);
        });

        return () => {
            socket?.off('deleteStory');
            socket?.off('addStory');
        };
    }, [stories]);



    return (
        <StoryContext.Provider
            value={{
                wait,
                isUser,
                stories,
                isOpen,
                onOpen,
                onClose,
                handleContentTypeChange,
                handleSubmit,
                setContentType,
                contentType,
                selectedFile,
                setSelectedFile,
                textData,
                setTtextData,
                selectedUserStories,
                setSelectedUserStories,
                selectedStoryIndex,
                setSelectedStoryIndex,
                handleDeleteStory,
            }}
        >
            {children}
        </StoryContext.Provider>
    );
};

export const useStory = () => {
    const context = useContext(StoryContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
