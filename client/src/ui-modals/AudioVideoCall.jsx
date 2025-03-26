import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Text,
    Box,
    Button,
} from "@chakra-ui/react";
import { useCall } from "../context/CallContext";

const AudioVideoCall = ({
    isOpen,
    onClose,
    selectedUser,
}) => {

    const {
        callType,
        stream,
        callAccepted,
        myVideo,
        userVideo,
        caller,
        answerCall,
        declineCall,
        leaveCall,
        receivingCall,
        isUser,
        callEnded,
        callDuration,
        formatTime
    } = useCall();
    return (
        <Modal isOpen={isOpen && !callEnded} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{callType === "video" ? "Video" : "Audio"} Call</ModalHeader>
                <ModalCloseButton onClick={declineCall}/>
                <ModalBody>
                    <Box>
                        {(callType === "video" || callType === "audio") && stream && (
                            <>
                                <Box>
                                    <Text>{selectedUser?.firstname + ' ' + selectedUser?.lastname} Calling...</Text>
                                </Box>

                                <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                            </>
                        )}
                    </Box>
                    <Box>
                        {(callType === "video" || callType === "audio") && callAccepted && (
                            <>
                                <Text>{selectedUser?.firstname} <h2>Call Duration: {formatTime(callDuration)}</h2></Text>
                                <Text>{isUser?.firstname}</Text>
                                <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                            </>

                        )}
                    </Box>
                    {!callAccepted && receivingCall && (
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Incoming Call</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text>{caller} is calling...</Text>
                                </ModalBody>
                                <ModalFooter>
                                    <Button colorScheme="green" mr={3} onClick={answerCall}>
                                        Answer
                                    </Button>
                                    <Button colorScheme="red" onClick={declineCall}>Decline</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    )}
                    {callAccepted && (
                        <Button onClick={leaveCall}>Hang Up</Button>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AudioVideoCall;
