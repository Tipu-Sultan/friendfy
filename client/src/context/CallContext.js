import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import Peer from 'simple-peer';
import { useChats } from './ChatsContext';
import { useAuth } from './AuthContext';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const {socket} = useAuth()
  const isLogin = localStorage.getItem("userData");
  const isUser = isLogin ? JSON.parse(isLogin) : null;
  const {selectedUser} = useChats()
  const [callType, setCallType] = useState('')
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [callDuration, setCallDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();

  const startTimer = () => {
    const startTime = Date.now();
    setTimer(setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000));
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  useEffect(() => {
    let mediaStream = null;
  
    const requestMediaAccess = async () => {
      try {
        // Request video/audio access based on callType
        const constraints = { 
          video: callType === 'video', 
          audio: false // Start without audio by default
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
  
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
  
    requestMediaAccess();
  
    // Handle incoming calls
    socket?.on('call-made', (data) => {
      onOpen();
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
  
      // Dynamically update call type
      setCallType(data.callType === 'video' ? 'video' : 'audio');
    });
  
    // Handle call answered
    socket?.on('call-answered', (data) => {
      setCallAccepted(true);
      startTimer();
  
      // Dynamically update call type
      setCallType(callType === 'video' ? 'video' : 'audio');
      connectionRef.current.signal(data.signal);
  
      // Ask for audio access if user agrees
      if (callType === 'audio' || callType === 'video') {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((audioStream) => {
            const combinedStream = new MediaStream([
              ...(mediaStream?.getVideoTracks() || []),
              ...audioStream.getAudioTracks(),
            ]);
            setStream(combinedStream);
  
            if (myVideo.current) {
              myVideo.current.srcObject = combinedStream;
            }
          })
          .catch((err) => console.error("Error accessing audio:", err));
      }
    });
  
    // Handle call ended
    socket?.on('call-ended', () => {
      setCallAccepted(false);
      setCallEnded(false);
      setCallerSignal(null);
      setReceivingCall(false);
      setStream(null);
      onClose();
      mediaStream?.getTracks().forEach((track) => track.stop());
    });
  
    return () => {
      socket?.off('call-made');
      socket?.off('call-answered');
      socket?.off('call-ended');
      mediaStream?.getTracks().forEach((track) => track.stop()); // Cleanup media stream
    };
  }, [isOpen, onClose, callAccepted, receivingCall, onOpen, callEnded, callType, socket]);
  


  const callUser = (userToCall) => {
    
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer?.on('signal', (data) => {
      socket?.emit('callUser', {
        userToCall: userToCall,
        signalData: data,
        from: isUser.username,
      });
    });

    peer?.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    startTimer();
    if(callType==='video'){
      setCallType('video')
    }else{
      setCallType('audio')
    }
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer?.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer?.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer?.signal(callerSignal);
    connectionRef.current = peer;
  };

  const declineCall = () => {
    stopTimer()
    setCallAccepted(false);
    setCallEnded(false);
    setCallerSignal(null);
    setReceivingCall(false);
    setStream(null);
    onClose()
    if(callType==='video'){
      setCallType('video')
    }else{
      setCallType('audio')
    }
  };

  const leaveCall = () => {
    stopTimer()
    setCallAccepted(false);
    setCallEnded(false);
    setCallerSignal(null);
    setReceivingCall(false);
    setStream(null);
    onClose()
    socket.emit('call-end', { to: caller });
  };

  const handleCallClick = (type) => {
    setCallType(type);
    onOpen();
    callUser(selectedUser?.username)
  };

  return (
    <CallContext.Provider
      value={{
        declineCall,
        leaveCall,
        answerCall,
        callUser,
        stream,
        callAccepted,
        myVideo,
        userVideo,
        receivingCall,
        caller,
        callType,
        setCallType,
        isOpen,
        onOpen,
        onClose,
        callEnded,
        callDuration,
        formatTime,
        handleCallClick
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within an AuthProvider');
  }
  return context;
};
