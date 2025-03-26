import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Circle,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import StoryModal from "../ui-modals/StoryModal";
import { useStory } from "../context/StoryContext";
import StoryPreview from "./StoryPreview";

const Story = ({ username, image, isAddStory, stories }) => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const {
    isUser,
    selectedUserStories,
    setSelectedUserStories,
    setSelectedStoryIndex,
    onOpen,
    isOpen,
    onClose
  } = useStory();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

  const handleStoryClick = () => {
    setSelectedUserStories(stories);
    setSelectedStoryIndex(0);
    onPreviewOpen()
  };
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const avatarSize = "50px";

  if (isAddStory) {
    return (
      <Box>
        <Flex direction="column" alignItems="center">
          <Circle
            size={avatarSize}
            bg="gray.200"
            color="gray.600"
            borderWidth="2px"
            borderColor={borderColor}
            justify="center"
            align="center"
            onClick={onOpen}
            cursor={"pointer"}
            mt={3}
          >
            <Text fontSize="xl">+</Text>
          </Circle>
          <Text mt="2">Add</Text>
        </Flex>
        <StoryModal isOpen={isOpen} onClose={onClose} />
      </Box>
    );
  }

  return (
    <Box>
      <Flex direction="column" alignItems="center">
        <Circle
          size={avatarSize}
          borderColor={borderColor}
          borderWidth="2px"
          mt={3}
          onClick={handleStoryClick}
          cursor="pointer"
        >
          <Circle
            size="65px"
            bg="transparent"
            border="2px solid"
            borderColor={borderColor}
            position="absolute"
            zIndex="1"
          />
          <Avatar src={`${image}`} position="absolute" />
        </Circle>
        <StoryPreview loggedInUser={isUser} API_HOST={API_HOST} stories={selectedUserStories} isOpen={isPreviewOpen} onClose={onPreviewClose} />
        <Text mt="2">{username}</Text>
      </Flex>
    </Box>
  );
};

const StoryList = () => {
  const { stories,isUser } = useStory();
  const [filteredStories, setFilteredStories] = useState([]);
  const [loggedInUserStory, setLoggedInUserStory] = useState([]);

  useEffect(() => {
    const now = new Date();
    const filteredStories = stories.filter(story => {
      const createdAt = new Date(story?.createdAt);
      const diffInMs = now - createdAt;
      const diffInHours = diffInMs / (1000 * 60 * 60);
      return diffInHours <= 24;
    });
    setFilteredStories(filteredStories);
  }, [stories]);

  const filteredPosts = filteredStories.filter(story => {
    return (
      story?.username === isUser?.username ||
      isUser?.following.some(follow => follow?.followingUsername === story?.username && follow?.logginUsername === isUser?.username && follow?.action === "Following") ||
      isUser?.followers.some(follower => follower?.followersUsername === story?.username && follower?.logginUsername === isUser?.username && follower?.action === "Following")
    );
  });

  const userStoriesMap = filteredPosts.reduce((acc, curr) => {
    if (!acc[curr?.username]) {
      acc[curr?.username] = [];
    }
    acc[curr?.username].push(curr);
    return acc;
  }, {});

  useEffect(() => {
    const isUserStories = filteredStories.filter(story => story?.username === isUser?.username);
    setLoggedInUserStory(isUserStories);
  }, [filteredStories, isUser?.username]);

  return (
    <Box
      overflowX="auto"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <Stack direction="row" spacing="4" align="center">
        <Story isAddStory={true} />
        {loggedInUserStory.length>0 &&
          (
            <Story
              key={isUser._id}
              username={isUser?.username}
              image={isUser.profileImage}
              totalStories={loggedInUserStory.length}
              stories={loggedInUserStory}
            />
          )}

        {Object.entries(userStoriesMap).map(([username, stories]) => {
          if (username !== isUser?.username) {
            stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return (
              <Story
                key={username}
                username={username}
                image={stories[0]?.profileImage}
                totalStories={stories.length}
                stories={stories}
              />
            );
          }
          return null;
        })}
      </Stack>
    </Box>
  );
};

export default StoryList;
