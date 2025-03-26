import { CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, IconButton, Textarea } from '@chakra-ui/react';
import React from 'react';
import { FaPaperclip, FaRegPaperPlane } from 'react-icons/fa';
import { useChats } from '../context/ChatsContext';

const ChatInput = () => {
    const {
        checkTyping, handleSendClick, fileInputRef,
        selectedFileName,
        setSelectedFile,
        setSelectedFileName,
        selectedUser, handleSendMessage,
        messageText, setMessageText,friendsList
    } = useChats();

    const handleAttachFile = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setSelectedFileName(file.name);
    };

    const handleClearFile = () => {
        fileInputRef.current.value = ''; 
        setSelectedFileName(null); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(messageText, selectedUser && selectedUser.username,friendsList?.[0]?.blockStatus);
            setMessageText('');
        }
    };

    return (
        <Flex p="3">
            <Textarea
                placeholder="Type your message..."
                variant="filled"
                size="lg"
                flex="1"
                mr="2"
                value={messageText}
                onKeyDown={handleKeyDown}
                onChange={(e) => setMessageText(e.target.value)}
                onInput={() => checkTyping()}
                resize="none" 
                whiteSpace="pre-wrap" 
            />
            <IconButton
                mt={1}
                variant="ghost"
                icon={<FaRegPaperPlane />}
                onClick={handleSendClick}
            />
            <IconButton
                icon={<FaPaperclip />}
                aria-label="Attach file"
                variant="ghost"
                mt={1}
                onClick={handleAttachFile}
            />
            {selectedFileName && (
                <Button variant="ghost" onClick={handleClearFile}>
                    <CloseIcon />
                </Button>
            )}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
        </Flex>
    );
};

export default ChatInput;
