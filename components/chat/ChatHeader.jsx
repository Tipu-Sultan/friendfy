import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "@/redux/slices/chatSlice";
import { useRouter } from "next/navigation";

export default function ChatHeader({
  typingUsers,
  isTyping,
  selectedUser,
  isMobileView,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch online users only when the component mounts
  const handleBack = () => {
    dispatch(setSelectedUser(null));
    router.push(`/chat`);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Clear Chat</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Block User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
