import React, { useState } from "react";
import {
    Grid,
    GridItem,
    Heading,
    Avatar,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
} from "@chakra-ui/react";
import { useFollow } from "../context/FollowContext";
import { DeleteFollowModal } from "../ui-modals/DeleteModal";

const FollowButton = ({ text, onClick, bgColor }) => (
    <Button
        w={"full"}
        mt={8}
        bg={bgColor}
        color={'white'}
        rounded={"md"}
        _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
        }}
        onClick={onClick}
    >
        {text}
    </Button>
);

export default function Follow() {
    const [rid, setRid] = useState();
    const [filter, setFilter] = useState("followers"); // State to track the filter option
    const bgColor = useColorModeValue("gray.100", "gray.900");
    const { users, handleFollow, isUser, handleOpenModal } = useFollow();

    const isFollowed = (username, action) => {
        return isUser.followers?.some(follower => follower.followersUsername === username && follower.action === action && follower.logginUsername === isUser.username);
    };

    const isFollowing = (username, action) => {
        return isUser.following?.some(follow => follow.followingUsername === username && follow.action === action && follow.logginUsername === isUser.username);
    };

    const filteredUsers = users?.filter(user => {
        if (filter === "followers") {
            return isFollowed(user?.username, 'Following');
        } else if (filter === "following") {
            return isFollowing(user?.username, 'Following');
        }
        return true;
    });

    return (
        <Box>
            <Flex  mb={4}>
                <Button
                    onClick={() => setFilter("followers")}
                    colorScheme={filter === "followers" ? "blue" : "gray"}
                    mr={2}
                >
                    Followers
                </Button>
                <Button
                    onClick={() => setFilter("following")}
                    colorScheme={filter === "following" ? "blue" : "gray"}
                >
                    Following
                </Button>
            </Flex>
            <Grid
                templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }}
                gap={4}
            >
                {filteredUsers?.map((user, i) => (
                    <GridItem key={user._id}>
                        <Box
                            maxW={'auto'}
                            w={'full'}
                            bg={bgColor}
                            boxShadow={'2xl'}
                            rounded={'md'}
                            overflow={'hidden'}
                        >
                            {/* User Profile Section */}
                            <Image
                                h={"120px"}
                                w={"full"}
                                src={`${user.coverImage}`}
                                objectFit="cover"
                                alt={user.coverImage}
                            />
                            <Flex justify={"center"} mt={-12}>
                                <Avatar
                                    size={"xl"}
                                    src={`${user.profileImage}`}
                                    css={{
                                        border: "2px solid white",
                                    }}
                                />
                            </Flex>

                            <Box p={6}>
                                <Stack spacing={0} align={"center"} mb={5}>
                                    <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                                        {user.firstname + ' ' + user.lastname}
                                    </Heading>
                                    <Text color={"gray.500"}>{user.username}</Text>
                                </Stack>

                                <Stack direction={"row"} justify={"center"} spacing={6}>
                                    <Stack spacing={0} align={"center"}>
                                        <Text fontWeight={600}>{user.followers.length}</Text>
                                        <Text fontSize={"sm"} color={"gray.500"}>
                                            Followers
                                        </Text>
                                    </Stack>
                                    <Stack spacing={0} align={"center"}>
                                        <Text fontWeight={600}>{user.following.length}</Text>
                                        <Text fontSize={"sm"} color={"gray.500"}>
                                            Following
                                        </Text>
                                    </Stack>
                                </Stack>
                                {
                                    isFollowed(user.username, 'Requested') ? (
                                        <Stack key={i} direction={"row"} justify={"center"} spacing={6}>
                                            <FollowButton
                                                text={'Confirm'}
                                                onClick={() => handleFollow(user.username, 'Following')}
                                                bgColor={'gray.400'}
                                            />
                                            <FollowButton
                                                text={'Delete'}
                                                onClick={() => handleFollow(user.username, 'Delete')}
                                                bgColor={'red.400'}
                                            />
                                        </Stack>
                                    ) : (
                                        <FollowButton
                                            key={i}
                                            text={'Following'}
                                            bgColor={'rgba(0, 0, 0, 0)'}
                                            onClick={() => { setRid(user.username); handleOpenModal(); }}
                                        />
                                    )
                                }
                            </Box>
                        </Box>
                        <DeleteFollowModal rid={rid} />
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
}

