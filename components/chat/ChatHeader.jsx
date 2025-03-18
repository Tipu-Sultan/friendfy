import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, PhoneCall, User, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { setSelectedUser, updateBlockStatus } from "@/redux/slices/chatSlice";
import { useRouter } from "next/navigation";
import CallModal from "../ui-modols/CallModal";
import { useCall } from "@/hooks/useCall";

export default function ChatHeader({
  typingUsers,
  isTyping,
  selectedUser,
  isMobileView,
  ablyClient,
  currentUser,
  onlineUsers,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setSelectedUser(null));
    router.push(`/chat`);
  };

  const {
    showCallModal,
    isReceiving,
    callType,
    caller,
    callerName,
    callAccepted,
    stream,
    remoteStream,
    remoteVideoRef,
    localVideoRef,
    acceptCall,
    endCall,
    startCall,
    setShowCallModal,
    callStatus,
    callDuration,
  } = useCall(selectedUser, currentUser, ablyClient);

  const handleBlock = async () => {
    try {
      const res = await dispatch(
        updateBlockStatus({ currentUser: currentUser.id, UserId: selectedUser?.id })
      ).unwrap();

      console.log("Block status updated:", res);
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {isMobileView && (
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <Avatar>
          <img
            src={selectedUser.profilePicture}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full"
          />
        </Avatar>
        <div>
          <h3 className="font-semibold">{selectedUser.name}</h3>
          <p className="text-sm text-muted-foreground">
            {selectedUser.type === "group"
              ? typingUsers.length > 0
                ? `${typingUsers.join(", ")} ${
                    typingUsers.length === 1 ? "is" : "are"
                  } typing...`
                : "Online"
              : isTyping
              ? "Typing..."
              : onlineUsers.includes(selectedUser.id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {selectedUser.type === "user" && (
          <>
            <Button
              onClick={() => startCall(selectedUser?.id, "audio")}
              variant="ghost"
              size="icon"
            >
              <PhoneCall className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => startCall(selectedUser?.id, "video")}
              variant="ghost"
              size="icon"
            >
              <Video className="w-5 h-5" />
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleBlock}
              className="text-destructive"
            >
              {!selectedUser?.isBlocked?"Block":"Unblock"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CallModal
        selectedUser={selectedUser}
        showCallModal={showCallModal}
        setShowCallModal={setShowCallModal}
        isReceiving={isReceiving}
        callType={callType}
        callerName={callerName}
        caller={caller}
        acceptCall={acceptCall}
        callAccepted={callAccepted}
        endCall={endCall}
        stream={stream}
        remoteStream={remoteStream}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        callStatus={callStatus}
        callDuration={callDuration}
      />
    </div>
  );
}
