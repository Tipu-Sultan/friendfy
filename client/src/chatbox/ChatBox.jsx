import { Box, Button, Flex, IconButton, Image, Text, VStack, Divider, Center } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaFileDownload, FaTrash } from 'react-icons/fa';
import { useChats } from '../context/ChatsContext';
import { formatChatTimestamp, formatChatDate } from '../services/timeConvert';
import Lottie from 'react-lottie';
import animationData from '../assets/typing.json';

const ChatBox = ({ SelectedUsername }) => {
    const {
        dowloadMessageFile, editableMessageId, isUser, filteredMessages,
        handleDeleteMessage, chatboxRef, API_HOST, setEditableMessageId,
        selectedUser, searchTextInput, selectMsgDelete, selectedMessages, toggleMessageSelection
    } = useChats();

    const [lastTap, setLastTap] = useState(0);
    const [doubleTapTimeout, setDoubleTapTimeout] = useState(null);

    const handleDoubleClick = (messageId) => {
        setEditableMessageId(messageId);
    };

    const handleSingleClick = () => {
        setEditableMessageId(null);
    };

    const handleTap = (messageId) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        clearTimeout(doubleTapTimeout);

        if (tapLength < 300 && tapLength > 0) {
            handleDoubleClick(messageId);
        } else {
            const timeout = setTimeout(() => {
                handleSingleClick();
            }, 300);
            setDoubleTapTimeout(timeout);
        }

        setLastTap(currentTime);
    };

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [chatboxRef, filteredMessages]);

    const groupMessagesByDate = (messages) => {
        return messages.reduce((acc, message) => {
            const date = new Date(message.timestamp).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(message);
            return acc;
        }, {});
    };

    const groupedMessages = groupMessagesByDate(filteredMessages);

    return (
        <Box p="4" flex="1" overflowY="scroll" ref={chatboxRef} position="relative">
            {SelectedUsername || selectedUser ? (
                filteredMessages.length > 0 ? (
                    Object.entries(groupedMessages).map(([date, messages]) => (
                        <React.Fragment key={date}>
                            <Flex align="center" my="4">
                                <Divider flex="1" />
                                <Text px="3"  color="gray.500">{formatChatDate(date)}</Text>
                                <Divider flex="1" />
                            </Flex>
                            {messages.map((message) => (
                                <Flex
                                    key={message._id}
                                    mb="3"
                                    justifyContent={message.senderUsername === isUser.username ? 'flex-end' : 'flex-start'}
                                    alignItems="flex-end"
                                    style={{
                                        transform: editableMessageId === message._id ? `translateX(${message.senderUsername === isUser.username ? '-50px' : '50px'})` : 'none',
                                        transition: 'transform 0.3s ease-in-out',
                                        position: 'relative',
                                    }}
                                    onDoubleClick={() => handleDoubleClick(message._id)}
                                    onClick={() => handleTap(message._id)}
                                >
                                    {selectMsgDelete && (
                                        <Box position="absolute" top="10px" right={message.senderUsername === isUser.username ? '5px' : ''}>
                                            <input
                                                type="checkbox"
                                                checked={selectedMessages && selectedMessages.some(msg => msg.messageId === message._id)}
                                                onChange={() => toggleMessageSelection(message._id, message.senderUsername, message.receiverUsername)}
                                            />
                                        </Box>
                                    )}
                                    <Box
                                        maxWidth="80%"
                                        bg={message.senderUsername === isUser.username ? 'blue.400' : 'gray.200'}
                                        color={message.senderUsername === isUser.username ? 'white' : 'black'}
                                        p="3"
                                        style={message.senderUsername === isUser.username ? { borderRadius: '30px 0px 30px 30px' } : { borderRadius: '0px 30px 30px 30px' }}
                                    >
                                        {message.contentType === 'text' ? (
                                            <Text whiteSpace="pre-wrap">{message.message}</Text>
                                        ) : message.contentType === 'image' ? (
                                            <>
                                                <Image src={`${API_HOST}/${message.filepath}`} alt="Image" />
                                                {message.message && <Text whiteSpace="pre-wrap">{message.message}</Text>}
                                            </>
                                        ) : message.contentType === 'video' ? (
                                            <>
                                                <video width="100%" controls>
                                                    <source src={`${API_HOST}/${message.filepath}`} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                {message.message && <Text whiteSpace="pre-wrap">{message.message}</Text>}
                                            </>
                                        ) : message.contentType === 'document' ? (
                                            <>
                                                <Text>{message.contentType}:</Text>
                                                <Button
                                                    as="a"
                                                    href={`${API_HOST}/${message.filepath}`}
                                                    target="_blank"
                                                    download
                                                    colorScheme="blue"
                                                    mt="2"
                                                >
                                                    <FaFileDownload />
                                                </Button>
                                                {message.message && <Text whiteSpace="pre-wrap">{message.message}</Text>}
                                            </>
                                        ) : null}
                                        <Text fontSize="xs" color={message.senderUsername === isUser.username ? 'white' : 'black'} textAlign="right">
                                            {formatChatTimestamp(message.timestamp)}
                                        </Text>
                                    </Box>

                                    {editableMessageId === message._id && (
                                        <Box position="absolute" top="10px" right={message.senderUsername === isUser.username ? '5px' : ''}>
                                            <Flex align="center">
                                                {message.senderUsername === isUser.username && (
                                                    <IconButton
                                                        icon={<FaTrash />}
                                                        size="sm"
                                                        aria-label="Delete Message"
                                                        onClick={() => handleDeleteMessage(message._id, message.roomId)}
                                                        mr="2"
                                                    />
                                                )}
                                                {message.contentType !== 'text' && (
                                                    <IconButton
                                                        icon={<FaFileDownload />}
                                                        color={'black'}
                                                        size="sm"
                                                        aria-label="Download Message"
                                                        onClick={() => dowloadMessageFile(message.filepath)}
                                                        mr="2"
                                                    />
                                                )}
                                            </Flex>
                                        </Box>
                                    )}
                                </Flex>
                            ))}
                        </React.Fragment>
                    ))
                ) : (
                    searchTextInput && <Flex align="center" justify="center" h="100%">
                        <Text>No chats found with the search "{searchTextInput}".</Text>
                    </Flex>
                )
            ) : (
                <Flex align="center" justify="center" h="100%">
                    <VStack>
                        <Image src="https://peopulse.vercel.app/static/media/peopulse.11f71b903ae566685966.png" alt="Start Chat" w="200px" h="auto" />
                        <Text fontSize="lg">Start chats with friends</Text>
                    </VStack>
                </Flex>
            )}
        </Box>
    );
}

export default ChatBox;
