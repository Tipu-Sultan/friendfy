import { useState, useEffect, useRef, useCallback } from "react";
import Peer from "simple-peer";

export const useCall = (selectedUser, user, ablyClient) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [callType, setCallType] = useState("");
  const [caller, setCaller] = useState(null);
  const [callerName, setCallerName] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("Calling...");
  const [callDuration, setCallDuration] = useState(0);

  const timerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const channelName = selectedUser?.type === "group"
    ? user.id
    : [user?.id, selectedUser?.id].sort().join("-");
  
  const callChannel = ablyClient?.channels?.get(channelName);

  const startCallTimer = useCallback(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
  }, []);

  const stopCallTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setCallDuration(0);
    }
  }, []);

  const startCall = async (receiverId, type) => {
    resetCallState();
    setCallType(type);
    setShowCallModal(true);
    setCallStatus("Calling...");

    try {
      const constraints = { audio: true, video: type === "video" };
      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(userStream);

      peerRef.current = new Peer({ initiator: true, trickle: false, stream: userStream });
      peerRef.current.on("signal", (signal) => {
        callChannel.publish("incoming-call", {
          callerId: user?.id,
          callerName: user?.username,
          receiverId,
          callType: type,
          signal,
        });
        setCallStatus("Ringing...");
      });

      peerRef.current.on("stream", (remote) => {
        setRemoteStream(remote);
        setCallStatus("In-Call");
        startCallTimer();
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const acceptCall = async () => {
    if (!callerSignal) return console.error("Caller signal is missing!");

    setCallAccepted(true);
    setCallStatus("In-Call");
    startCallTimer();

    try {
      const constraints = { audio: true, video: callType === "video" };
      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(userStream);

      peerRef.current = new Peer({ initiator: false, trickle: false, stream: userStream });
      peerRef.current.signal(callerSignal);
      peerRef.current.on("signal", (signal) => callChannel.publish("call-accepted", { callerId: caller, signal }));
      peerRef.current.on("stream", (remote) => setRemoteStream(remote));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endCall = async () => {
    callChannel.publish("call-ended", { endedBy: user?.id, resetState: true });
    resetCallState();
  };

  const resetCallState = () => {
    stopCallTimer();
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
    
    setShowCallModal(false);
    setIsReceiving(false);
    setCallAccepted(false);
    setCaller(null);
    setCallerSignal(null);
    setCallType("");
    setStream(null);
    setRemoteStream(null);
    setCallStatus("");

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  };

  useEffect(() => {
    const handleIncomingCall = (message) => {
      if (message.data.receiverId === user?.id) {
        setCaller(message.data.callerId);
        setCallerName(message.data.callerName);
        setCallerSignal(message.data.signal);
        setCallType(message.data.callType);
        setIsReceiving(true);
        setShowCallModal(true);
        setCallStatus("Ringing...");
      }
    };

    const handleCallAccepted = (message) => {
      if (message.data.callerId === user?.id && peerRef.current) {
        peerRef.current.signal(message.data.signal);
        setCallStatus("In-Call");
        startCallTimer();
      }
    };

    const handleCallEnded = () => resetCallState();

    const updateBlock = (message)=>{

    }

    callChannel.subscribe("incoming-call", handleIncomingCall);
    callChannel.subscribe("call-accepted", handleCallAccepted);
    callChannel.subscribe("call-ended", handleCallEnded);
    callChannel.subscribe("update-block-status", updateBlock);

    return () => {
      callChannel.unsubscribe("incoming-call", handleIncomingCall);
      callChannel.unsubscribe("call-accepted", handleCallAccepted);
      callChannel.unsubscribe("call-ended", handleCallEnded);
      callChannel.unsubscribe("update-block-status", updateBlock);
    };
  }, [callChannel, startCallTimer, resetCallState]);

  return {
    showCallModal,
    isReceiving,
    callType,
    caller,
    callerName,
    callAccepted,
    callStatus,
    callDuration,
    startCall,
    acceptCall,
    endCall,
    remoteVideoRef,
    localVideoRef,
    stream,
    remoteStream,
  };
};