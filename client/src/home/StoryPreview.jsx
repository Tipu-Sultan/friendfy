import React, { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalFooter, Button, Flex, Box } from "@chakra-ui/react";
import { useStory } from "../context/StoryContext";
import { AiOutlineDelete } from "react-icons/ai"; // Import the delete icon

const StoryPreview = ({ API_HOST, isOpen, onClose, stories, loggedInUser }) => {
  const { selectedStoryIndex, setSelectedStoryIndex, handleDeleteStory } = useStory();
  const totalStories = stories.length;

  const [visibleStories, setVisibleStories] = useState(stories);

  useEffect(() => {    
    const now = new Date();
    const filteredStories = stories.filter(story => {
      const createdAt = new Date(story.createdAt);
      const diffInMs = now - createdAt;
      const diffInHours = diffInMs / (1000 * 60 * 60); 
      return diffInHours <= 24;
    });
    setVisibleStories(filteredStories);
  }, [stories]);
  
  

  const handleNextStory = () => {
    setSelectedStoryIndex((prevIndex) =>
      prevIndex === totalStories - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevStory = () => {
    setSelectedStoryIndex((prevIndex) =>
      prevIndex === 0 ? totalStories - 1 : prevIndex - 1
    );
  };

  const isPrevDisabled = selectedStoryIndex === 0;
  const isNextDisabled = selectedStoryIndex === totalStories - 1;

  const renderContent = () => {
    const currentStory = visibleStories[selectedStoryIndex];
    switch (currentStory?.contentType) {
      case "image":
        return (
          <img
            src={`${currentStory.content}`}
            alt={`Story ${selectedStoryIndex + 1}`}
            style={{ borderRadius: '10px', margin: 'auto', height: "100%", objectFit: "contain" }}
          />
        );
      case "text":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              padding: "20px",
              overflow: "auto"
            }}
          >
            <p style={{ textAlign: "center" }}>{currentStory.content}</p>
          </div>
        );
      case "video":
        return (
          <video
            controls
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          >
            <source
              src={`${currentStory.content}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        );
      case "audio":
        return (
          <audio
            controls
            style={{ width: "50%", height: "50%", margin: 'auto' }}
          >
            <source
              src={`${API_HOST}/${currentStory.content}`}
              type="audio/mp3"
            />
            Your browser does not support the video tag.
          </audio>
        );
      default:
        return null;
    }
  };

  const dashWidth = `${(100 / totalStories) * 0.8}%`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent w="800px" h="600px">
        <Flex flexDirection="column" justifyContent="space-between" alignItems="center" h="100%">
          <Flex alignItems="center" justifyContent="space-between" w="100%" p="4">
            <Button onClick={handlePrevStory} variant="outline" size="sm" isDisabled={isPrevDisabled}>
              Previous
            </Button>
            <Flex alignItems="center" width="60%">
              {[...Array(totalStories)].map((_, index) => (
                <Box
                  key={index}
                  h="2px"
                  borderRadius={'rounded'}
                  w={dashWidth}
                  bg={index <= selectedStoryIndex ? "gray.200" : "transparent"}
                  ml={index > 0 ? `${(100 / totalStories) * 0.2}%` : 0}
                />
              ))}
            </Flex>
            <Button onClick={handleNextStory} variant="outline" size="sm" isDisabled={isNextDisabled}>
              Next
            </Button>
          </Flex>
          <div style={{ width: "100%", height: "80%" }}>
            {isOpen && renderContent()}
          </div>
          {/* Conditionally render delete icon */}
          {visibleStories[selectedStoryIndex]?.username === loggedInUser.username && (
            <Flex justifyContent="center" mt="4">
              <Button onClick={() => handleDeleteStory(visibleStories[selectedStoryIndex]._id)} variant="outline" size="sm">
                <AiOutlineDelete />
              </Button>
            </Flex>
          )}
        </Flex>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StoryPreview;
