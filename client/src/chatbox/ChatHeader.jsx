import {
    Avatar,
    Box,
    CloseButton,
    Flex,
    Icon,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useChats } from '../context/ChatsContext';
import { FaEllipsisH, FaPhone, FaTrash, FaVideo } from 'react-icons/fa';
import { useCall } from '../context/CallContext';
import { HamburgerIcon } from '@chakra-ui/icons';
import { formatLastSeen } from '../services/timeConvert';

const ChatHeader = () => {
    const { isUser, updateBlockUnblock, deleteMultipleMessages,
        selectedMessages, setSelectedMessages, selectMsgDelete,
        setSelectMsgDelete, isOnline, isTyping, typingUser,
        selectedUser, setIsUserListOpen, isUserListOpen,
        isMobile, searchTextInput, setSearchTextInput,friendsList } = useChats();
    const { handleCallClick } = useCall();
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const [searchInput, setSearchInput] = useState(false);

    return (
        <Flex
            align="center"
            justify="space-between"
            bg={bgColor}
            p="2"
            borderBottom="1px"
            borderColor="gray.300"
        >
            <Flex align="center" flex="1">
                {isMobile && (
                    <IconButton
                        icon={<HamburgerIcon />}
                        aria-label="Open Menu"
                        onClick={() => setIsUserListOpen(!isUserListOpen)}
                        mr="2"
                    />
                )}
                <Avatar size="md" src={selectedUser?.profileImage} mr="2" borderRadius="full" border="2px solid" borderColor="gray.200" p="1" />

                <Box flex="1" mr="2">
                    <Text fontWeight="bold">
                        {selectedUser?.firstname} {selectedUser?.lastname}
                    </Text>
                    {isTyping && typingUser ? (
                        <Text fontWeight="bold" color="green.500">
                            Typing...
                        </Text>
                    ) : selectedUser && (
                        <Text fontWeight="bold" fontSize={'small'} color={isOnline?.includes(selectedUser?.username) ? 'green.500' : 'green.400'}>
                            {isOnline?.includes(selectedUser?.username) ? 'online' : formatLastSeen(selectedUser?.lastSeen)}
                        </Text>
                    )}
                </Box>
                {selectedUser && (
                    <>
                        <IconButton
                            icon={<FaPhone />}
                            aria-label="Audio Call"
                            onClick={() => handleCallClick('audio')}
                            mr="2"
                        />
                        <IconButton
                            icon={<FaVideo />}
                            aria-label="Video Call"
                            onClick={() => handleCallClick('video')}
                            mr="2"
                        />
                    </>
                )}
                {searchInput && (
                    <Flex align="center" ml="4" borderRadius="md" p="1">
                        <Input
                            placeholder="Search..."
                            size="sm"
                            autoFocus
                            mr="2"
                            value={searchTextInput}
                            onInput={(e) => setSearchTextInput(e.target.value)}
                            borderRadius={'md'}
                        />
                        <CloseButton size="sm" onClick={() => setSearchInput(false)} />
                    </Flex>
                )}
                {selectMsgDelete && (
                    <Flex align="center" ml="4" borderRadius="lg" p="1">
                        <CloseButton size="sm" onClick={() => { setSelectMsgDelete(false); setSelectedMessages([]); }} />
                    </Flex>
                )}

                {selectMsgDelete && selectedMessages.length > 0 && (
                    <Flex align="center" ml="4" borderRadius="lg" p="1">
                        <IconButton
                            aria-label="Delete selected messages"
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => deleteMultipleMessages(selectedMessages)}
                        />
                    </Flex>
                )}
            </Flex>
            <Menu>
                <MenuButton ml="4" as={IconButton} icon={<Icon as={FaEllipsisH} title="Show more" />} />
                <MenuList>
                    <MenuItem onClick={() => updateBlockUnblock(selectedUser?.username, friendsList?.[0]?.blockStatus)}>{friendsList?.[0]?.blockStatus==='block'?'Unblock':'Block'}</MenuItem>
                    <MenuItem>Clear chats</MenuItem>
                    <MenuItem onClick={() => setSearchInput(true)}>Search chats</MenuItem>
                    <MenuItem onClick={() => setSelectMsgDelete(true)}>Select chats</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default ChatHeader;
