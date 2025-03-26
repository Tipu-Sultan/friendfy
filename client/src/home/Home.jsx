import React from "react";
import { VStack, Button } from "@chakra-ui/react";
import PostCard from "./PostCard"; // Import the PostCard component from the previous example
import ModalPost from "../ui-modals/ModalPost";
import { usePost } from "../context/PostContext";
import StoryList from "./StoryList";

const Home = () => {
  const { handleOpenModal} = usePost()
  return (
    <VStack spacing="4" align="stretch" maxW="600px" mx="auto" width="100%">
      <StoryList/>
      <Button colorScheme="blue" onClick={handleOpenModal}>
        Create a Post
      </Button>

      <PostCard/>

      <ModalPost />
    </VStack>
  );
};

export default Home;
