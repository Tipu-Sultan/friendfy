import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Flex,
  Image,
  Avatar,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Grid,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { FaComment, FaThumbsUp, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { DeleteUserModal } from '../ui-modals/DeleteModal';
import UserEditModal from '../ui-modals/UserEditModal';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../context/FollowContext';

const Profile = () => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const { setQuery } = useFollow()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isUser, handleOpenModal, getUserByUsername, loadedUser } = useAuth();
  const { posts, deleteAuthPost, RenderContent } = usePost();
  const { username } = useParams();
  useEffect(() => {
    getUserByUsername(username);
    setQuery('')
  }, [username]);

  const isCurrentUser = isUser.username === username;
  const bgColor = useColorModeValue('gray.100', 'gray.900')

  return (
    loadedUser &&
    <Container maxW={'full'} p={0}>
      <Box w={'full'} bg={bgColor} boxShadow={'lg'} rounded={'md'}>
        <Image
          h={'200px'}
          w={'full'}
          src={`${loadedUser.coverImage}`}
          objectFit="cover"
          alt="Cover Image"
        />
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            src={`${loadedUser.profileImage}`}
            css={{
              border: '4px solid white',
            }}

            alt="Avatar Image"
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={2} align={'center'} mb={5}>
            <Heading fontSize={'3xl'} fontWeight={600} fontFamily={'body'}>
              {loadedUser.username}
            </Heading>
            <Text color={'gray.500'}>{`${loadedUser.firstname} ${loadedUser.lastname}`}</Text>
            <Text>{loadedUser.email}</Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Link to={'/friends'}>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>{loadedUser.followers.length}</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Followers
                </Text>
              </Stack>
            </Link>
            <Link to={'/friends'}>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>{loadedUser.following.length}</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Following
                </Text>
              </Stack>
            </Link>
          </Stack>

          {
            loadedUser.bio.split('\n').map((bio, index) => (
              <Text key={index} mb="2">{bio}</Text>
            ))}

          {isCurrentUser && (
            <HStack>
              <Button
                w={'full'}
                mt={8}
                bg={bgColor}
                color={'white'}
                rounded={'md'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                onClick={onOpen}
              >
                Edit
              </Button>
              <Button
                w={'full'}
                mt={8}
                bg={bgColor}
                color={'white'}
                rounded={'md'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                onClick={handleOpenModal}
              >
                Delete Account
              </Button>
            </HStack>
          )}

          <Text py={5}>Posts by {loadedUser.username}</Text>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)',
            }}
            gap={6}
            overflowX="auto"
          >
            {posts.map((post, i) => (
              loadedUser._id === post.user && (
                <SimpleGrid key={i} overflow={'hidden'} columns={1} spacing={4} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
                  <Box>
                    {RenderContent(
                      post.contentType.split("/")[0],
                      post.media,
                      post.content
                    )}

                    <Text color="gray.600" fontSize="sm" mb={4}>
                      {post.description}
                    </Text>

                    <HStack spacing={4} alignItems="center" mb={5}>
                      <Text>
                        <FaThumbsUp /> {post.likes.length}
                      </Text>
                      <Text>
                        <FaComment /> {post.comments.length}
                      </Text>
                      {isCurrentUser && (
                        <IconButton icon={<FaTrash />} onClick={() => deleteAuthPost(post._id)} />
                      )}
                    </HStack>
                  </Box>
                </SimpleGrid>
              )
            ))}
          </Grid>
        </Box>
      </Box>
      <DeleteUserModal />
      <UserEditModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default Profile;
