import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Video, X } from "lucide-react";

const CallModal = ({
  showCallModal,
  isReceiving,
  callType,
  acceptCall,
  endCall,
  stream,
  remoteStream,
  localVideoRef,
  remoteVideoRef,
  selectedUser,
  callerName,
  callAccepted,
  callStatus,
  callDuration,
  caller,
}) => {
  useEffect(() => {
    if (localVideoRef?.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
    if (remoteVideoRef?.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [stream, remoteStream]);


  return (
    <Dialog open={showCallModal || isReceiving}>
      <DialogContent className="p-6 text-center bg-gray-900 text-white rounded-lg shadow-lg w-[400px] md:w-[500px] lg:w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <img
              src={selectedUser?.profilePicture}
              alt={selectedUser?.name}
              className="w-10 h-10 rounded-full"
            />
            {`Call with ${selectedUser?.name}`}
          </DialogTitle>

          {callStatus === "In-Call" && (
            <div className="text-sm text-gray-400 mt-2">
              Call Duration: {Math.floor(callDuration / 60)}:
              {callDuration % 60 < 10
                ? `0${callDuration % 60}`
                : callDuration % 60}
            </div>
          )}
        </DialogHeader>
        
        {/* Video/Audio Section */}
        <div className="relative flex justify-center items-center mt-4">
          {remoteStream ? (
            <video
              ref={remoteVideoRef && remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-64 rounded-lg border border-gray-700 shadow-md ${
                callType === "audio" ? "hidden" : ""
              }`}
            />
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-800 rounded-lg text-gray-500 text-lg gap-3">
              <img
                src={selectedUser?.profilePicture}
                alt={selectedUser?.name}
                className="w-16 h-16 rounded-full"
              />

              {callStatus === "Calling..."
                ? "Calling..."
                : callStatus === "Ringing..."
                ? caller === selectedUser?.id
                  ? `${callerName ? callerName : "Unknown"} is calling...`
                  : `ringing...`
                : `Call with ${selectedUser?.name}`}
            </div>
          )}

          {/* Local Video (Small PIP) */}
          {stream && callType === "video" && (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="absolute bottom-4 right-4 w-24 h-24 rounded-lg border border-gray-500 shadow-lg"
            />
          )}
        </div>

        {/* Call Controls */}
        {!callAccepted && isReceiving ? (
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition flex items-center space-x-2"
              onClick={acceptCall}
            >
              {callType === "video" ? <Video size={18} /> : <Phone size={18} />}
              <span>Accept</span>
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition flex items-center space-x-2"
              onClick={endCall}
            >
              <X size={18} />
              <span>Decline</span>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition flex items-center space-x-2 w-full"
              onClick={endCall}
            >
              <Phone size={18} />
              <span>End Call</span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
