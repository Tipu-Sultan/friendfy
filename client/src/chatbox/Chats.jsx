import React, { useEffect } from 'react';
import {
  Box, Flex,
  Text, Divider,
} from '@chakra-ui/react';
import { useChats } from '../context/ChatsContext'; // Assuming you have a custom hook for chat logic
import AudioVideoCall from '../ui-modals/AudioVideoCall';
import { useCall } from '../context/CallContext';
import ChatPanel from './ChatPanel';
import ChatHeader from './ChatHeader';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import { useParams } from 'react-router-dom';
const ChatApp = () => {
  const { SelectedUsername } = useParams();
  const {
    setIsMobile,
    selectedFileName,
    selectedUser, isUser,
    getFollowedUser,
    handleUserClick
    , userList
  } = useChats();
  const { isOpen, onClose } = useCall();

  useEffect(() => {
    getFollowedUser();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 796);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const selectedUser = userList.find(user => user.username === SelectedUsername);
    // Call handleUserClick with the selected user
    if (selectedUser) {
      handleUserClick(selectedUser, SelectedUsername);
    }
  }, [SelectedUsername, userList]);


  return (
    <Box height="80vh" display="flex">

      {/* User List Panel */}
      <ChatPanel />

      {/* Header */}
      <Box width={{ base: '100%', md: '70%' }} border="1px" borderRadius="md" borderTopLeftRadius={0} borderBottomLeftRadius={0} overflow="hidden">

        <ChatHeader />

        {/* Chatbox with scrollable content */}
        <Flex direction="column" height="70vh">
          <ChatBox />

          <Divider />

          {/* Input field at bottom of chat card */}
          <ChatInput />
          {selectedFileName && (
            <Box p="3">
              <Text>{selectedFileName}</Text>
            </Box>
          )}
        </Flex>
      </Box>
      <AudioVideoCall
        isOpen={isOpen}
        onClose={onClose}
        selectedUser={selectedUser}
        isUser={isUser}
      />
    </Box>
  );
};

export default ChatApp;
