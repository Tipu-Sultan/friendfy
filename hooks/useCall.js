import { useState, useEffect, useRef } from "react";
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
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const channelName = selectedUser?.type === "group" ? user.id : [user?.id, selectedUser?.id].sort().join("-");
  const callChannel = ablyClient?.channels?.get(channelName);

  useEffect(() => {
    const handleIncomingCall = (message) => {
      if (message.data.receiverId === user?.id) {
        setCaller(message.data.callerId);
        setCallerName(message.data.callerName);
        setCallerSignal(message.data.signal);
        setCallType(message.data.callType);
        setIsReceiving(true);
        setShowCallModal(true);
      }
    };

    const handleCallAccepted = (message) => {
      if (message.data.callerId === user?.id && peerRef.current) {
        peerRef.current.signal(message.data.signal);
      }
    };

    callChannel.subscribe("incoming-call", handleIncomingCall);
    callChannel.subscribe("call-accepted", handleCallAccepted);
    callChannel.subscribe("call-ended", resetCallState);

    return () => {
      callChannel.unsubscribe("incoming-call", handleIncomingCall);
      callChannel.unsubscribe("call-accepted", handleCallAccepted);
      callChannel.unsubscribe("call-ended", resetCallState);
    };
  }, [callChannel]);

  const startCall = async (receiverId, type) => {
    resetCallState();
    setCallType(type);
    setShowCallModal(true);

    try {
      const constraints = { audio: true, video: type === "video" };
      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(userStream);

      peerRef.current = new Peer({ initiator: true, trickle: false, stream: userStream });

      peerRef.current.on("signal", (signal) => {
        callChannel.publish("incoming-call", { callerId: user?.id, callerName: user?.username, receiverId, callType: type, signal });
      });

      peerRef.current.on("stream", setRemoteStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const acceptCall = async () => {
    if (!callerSignal) return console.error("Caller signal is missing!");

    setCallAccepted(true);
    try {
      const constraints = { audio: true, video: callType === "video" };
      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(userStream);

      peerRef.current = new Peer({ initiator: false, trickle: false, stream: userStream });
      peerRef.current.signal(callerSignal);

      peerRef.current.on("signal", (signal) => callChannel.publish("call-accepted", { callerId: caller, signal }));
      peerRef.current.on("stream", setRemoteStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endCall = () => {
    peerRef.current?.destroy();
    callChannel.publish("call-ended", {});
    resetCallState();
  };

  const resetCallState = () => {
    setShowCallModal(false);
    setIsReceiving(false);
    setCallAccepted(false);
    setCaller(null);
    setCallerSignal(null);
    setCallType("");
    setStream(null);
    setRemoteStream(null);
    peerRef.current = null;
  };

  return { showCallModal, isReceiving, callType, callerName, callAccepted, startCall, acceptCall, endCall, remoteVideoRef, localVideoRef, stream, remoteStream };
};
