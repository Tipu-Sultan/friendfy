import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Icon, Flex, Text, Avatar } from "@chakra-ui/react";
import { MdArrowUpward, MdArrowDownward, MdPlayArrow, MdPause, MdFavorite } from "react-icons/md";
import { FaHeart } from 'react-icons/fa';
import { usePost } from '../context/PostContext';

const Reels = () => {
    const { posts, handleLike, user } = usePost();
    const videoPosts = posts.filter(post => post.contentType.split("/")[0] === "video");
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [direction, setDirection] = useState("next"); 
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [currentReelIndex]);

    const playNextReel = () => {
        setCurrentReelIndex((prevIndex) => {
            if (direction === "next") {
                return (prevIndex + 1) % videoPosts.length;
            } else {
                return prevIndex; // If direction is previous, don't change the index
            }
        });
    };

    const playPreviousReel = () => {
        setCurrentReelIndex((prevIndex) => {
            if (direction === "previous") {
                return (prevIndex - 1 + videoPosts.length) % videoPosts.length;
            } else {
                return prevIndex; // If direction is next, don't change the index
            }
        });
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const currentPost = videoPosts[currentReelIndex];
    const media = currentPost ? currentPost.media : '';
    const content = currentPost ? currentPost.content : '';
    const username = currentPost ? currentPost.username : ''; // Assuming you have a username field in your post data
    const avatarUrl = currentPost ? currentPost.avatarUrl : ''; // Assuming you have an avatarUrl field in your post data

    return (
        <Box
            maxW="400px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            mx="auto"
            my="4"
            position="relative"
            backgroundColor="white"
        >
            {/* Video */}
            {currentPost && (
                <Box position="relative" overflow="hidden" h={'600px'} borderRadius="md" maxW="400px">
                    <video
                        key={currentReelIndex} // Key prop to force re-render on index change
                        ref={videoRef}
                        controls
                        width="100%"
                        style={{ objectFit: 'cover' }}
                        autoPlay
                    >
                        <source src={`${media}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    {/* Play/Pause Button */}
                    <IconButton
                        aria-label={isPlaying ? "Pause" : "Play"}
                        icon={<Icon as={isPlaying ? MdPause : MdPlayArrow} />}
                        size="lg"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        onClick={handlePlayPause}
                        color="white"
                        bg="rgba(0, 0, 0, 0.5)"
                        _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
                    />
                </Box>
            )}

            {/* Up and Down Arrow Buttons */}
            <Box position="absolute" left="10px" top="50%" transform="translateY(-50%)" textAlign="center">
                <IconButton aria-label="Up Arrow" icon={<Icon as={MdArrowUpward} />} size="lg" m="1" onClick={() => { setDirection("previous"); playPreviousReel(); }} />
            </Box>
            <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" textAlign="center">
                <IconButton aria-label="Down Arrow" icon={<Icon as={MdArrowDownward} />} size="lg" m="1" onClick={() => { setDirection("next"); playNextReel(); }} />
            </Box>

            {/* Like Button and Count */}
            <Flex position="absolute" bottom="60px" left="10px" align="center">
                <IconButton
                    aria-label="Like"
                    icon={<Icon as={FaHeart} />}
                    size="lg"
                    color={currentPost?.likes.some((like) => like.user === user?.username) ? "red" : "gray"}
                    onClick={() => handleLike(currentPost._id)}
                    bg="rgba(0, 0, 0, 0.5)"
                    _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
                />
                <Text ml="2" color="white" fontSize="lg">{currentPost?.likes.length}</Text>
            </Flex>
            
            {/* User Info and Title */}
            <Flex position="absolute" bottom="10px" left="10px" align="center" bg="rgba(0, 0, 0, 0.7)" borderRadius="md" p="2" width="calc(100% - 20px)">
                <Avatar src={avatarUrl} size="sm" mr="2" />
                <Box>
                    <Text color="white" fontSize={'sm'} fontWeight="bold">{username}</Text>
                    <Text color="white" fontSize="sm">{content}</Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default Reels;
