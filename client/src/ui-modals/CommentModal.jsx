import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  Flex,
  Avatar,
  Text,
  Box,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import { FaThumbsUp, FaReply, FaTrash } from "react-icons/fa";
import { usePost } from "../context/PostContext";
import { calculateTimeDifference } from "../services/timeConvert";
import { useState } from "react";

const CommentModal = ({
  isOpen,
  onClose,
  postId,
  postComments,
}) => {
  const {
    setCommentText,
    commentText,
    addComment,
    deleteComment,
    user,
  } = usePost();


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comments</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box maxH="400px" overflowY="auto">
            <VStack spacing="4" align="start">
              {postComments.length > 0 ? postComments.map((comment, index) => (
                <Flex key={index} align="start" justify="space-between" w="100%">
                  <Flex align="start">
                    <Avatar size="sm" src={`${comment.profileImage}` || comment.username} />
                    <VStack align="start" ml="2">
                      <Text>
                        <b>{comment?.username}</b> <br />{comment.text}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {calculateTimeDifference(comment.createdAt)}
                      </Text>
                    </VStack>
                  </Flex>
                  <Flex>
                    {comment.user === user._id && <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete Comment"
                      onClick={() => deleteComment(postId, comment._id)}
                      variant="ghost"
                      size="sm"
                    />}
                  </Flex>
                </Flex>
              )) : <b>Comments not yet !</b>}
            </VStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Input
            placeholder="Add a comment..."
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
          />
          <Button isDisabled={commentText.length < 1} colorScheme="blue" onClick={() => addComment(postId)} ml={2}>
            Comment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  );
};

export default CommentModal;
