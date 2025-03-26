import React, { useState } from "react";
import {
  Box,
  HStack,
  Text,
  IconButton,
  CloseButton,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  Flex,
  Tooltip,
  Circle,
} from "@chakra-ui/react";
import { FaHeart, FaComment, FaEllipsisH, FaRegPaperPlane } from "react-icons/fa";
import CommentModal from "../ui-modals/CommentModal";
import { calculateTimeDifference } from "../services/timeConvert";
import { usePost } from "../context/PostContext";


const PostCard = () => {
  const { posts, handleLike, deleteAuthPost, user, RenderContent, handleSharePost, EditPostByAuthUser } = usePost();
  const [commentModalOpen, setCommentModalOpen] = useState(null)

  const filteredPosts = posts.filter(post => {
    return (
      post?.username === user?.username ||
      user.following.some(follow => follow.followingUsername === post?.username && follow.logginUsername === user?.username && follow.action === "Following") ||
      user.followers.some(follower => follower.followersUsername === post?.username && follower.logginUsername === user?.username && follower.action === "Following")
    );
  });

  const handleCommentModal = (postId) => {
    setCommentModalOpen(postId);
  };

  return (
    <>
      {filteredPosts.slice().reverse().map((post, i) => (
        <>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            mb="4"
            maxW="600px"
            mx="auto"
            width="100%"
            position="relative"
            key={i}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing="4" align="center" mb="2">
                <Circle
                  size={'50px'}
                  bg="transparent"
                  border="2px solid #fff"
                  cursor="pointer"
                  position="relative"
                >
                  <Avatar
                    key={post._id}
                    size="md"
                    name={post?.username[1]}
                    src={`${post?.profileImage}`}
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  />
                </Circle>

                <VStack align="start">
                  <Text fontWeight="bold">{post?.username}</Text>
                  <Text color="gray.500">
                    {calculateTimeDifference(post?.createdAt)}
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing="2">
                <Menu>
                  <MenuButton variant={'ghost'} as={IconButton} icon={<Icon as={FaEllipsisH} title="show more" />} />
                  <MenuList>
                    {user._id === post.user && <MenuItem onClick={() => deleteAuthPost(post._id)}>Delete post</MenuItem>}
                    <MenuItem>Report</MenuItem>
                    {user._id === post.user && <MenuItem onClick={() => EditPostByAuthUser(post)}>Edit</MenuItem>}
                  </MenuList>
                </Menu>
                <CloseButton title="Not intrested" />
              </HStack>
            </Flex>

            {RenderContent(
              post.contentType.split("/")[0],
              post.media,
              post.content
            )}

            <HStack justify="space-between" align="center">
              <HStack spacing="1">
                <Tooltip label={post.likes.some((like) => like.user === user?.username) ? "Unlike" : "Like"}>
                  <IconButton
                    icon={
                      <FaHeart
                        color={
                          post.likes.some((like) => like.user === user?.username) ? "red" : "gray"
                        }
                      />
                    }
                    aria-label="Like Post"
                    onClick={() => handleLike(post._id)}
                    mt={1}
                  />
                </Tooltip>
                <Text>{post.likes.length}</Text>

                <IconButton
                  mt={1}
                  variant="ghost"
                  icon={<FaRegPaperPlane />}
                  onClick={() => handleSharePost(post._id, post.media, post.contentType)}
                />
              </HStack>
              <HStack
                spacing="1"
                onClick={() => handleCommentModal(post._id)}
                cursor="pointer"
              >
                <IconButton icon={<FaComment />} aria-label="Comment" mt={1} />
                <Text>{post.comments.length}</Text>
              </HStack>
            </HStack>
          </Box>
          <CommentModal
            isOpen={commentModalOpen === post._id}
            postId={post._id}
            onClose={() => setCommentModalOpen(null)}
            postComments={post.comments}
            username={post?.username}
          />
        </>
      ))}
    </>
  );
};

export default PostCard;
