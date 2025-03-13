import { fetchPaginationsMessages } from "@/redux/slices/chatSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { timeAgo } from "@/utils/timeAgo";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";

export default function ChatMessages({
  handleMsgDelete,
  chatLoading,
  selectedUser,
  currentUser,
  
}) {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = async () => {
    const container = chatContainerRef.current;

    if (
      container.scrollTop === 0 &&
      chatLoading !== "fetchPaginationsMessages" &&
      currentPage < totalPages
    ) {
      const nextPage = currentPage + 1;
      const res = await dispatch(
        fetchPaginationsMessages({
          sender: currentUser?.id,
          receiver: selectedUser?.id,
          page: nextPage,
        })
      ).unwrap();
      setTotalPages(res.totalPages);
      setCurrentPage(nextPage);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const isGroupChat = selectedUser?.type === "group";
    const senderId = isGroupChat ? message?.sender?._id : message?.sender;
    const isSender = senderId === currentUser?.id;
  
    // ✅ If both sender and receiver deleted, remove the message completely
    if (message.deletedBySender && message.deletedByReceiver) return false;
  
    // ✅ If sender deleted, show a placeholder message to the receiver
    if (message.deletedBySender && !isSender) return true;
  
    // ✅ If receiver deleted, hide it only for them
    if (!isSender && message.deletedByReceiver) return false;
  
    return true;
  });
  
  

  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth p-4 space-y-4"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      onScroll={handleScroll}
      ref={chatContainerRef}
    >
      {chatLoading === "fetchPaginationsMessages" && (
        <div className="w-full flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {chatLoading === "fetchMessages"
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-start">
              <Skeleton className="w-2/3 h-12 rounded-lg" />
            </div>
          ))
        : filteredMessages?.map((message, i) => {
            const senderDetails =
              selectedUser?.type === "group" ? message?.sender : null;
            const senderId =
              selectedUser?.type === "group"
                ? message?.sender?._id
                : message?.sender;
            const isSender =
              senderDetails?._id === currentUser?.id ||
              message?.sender === currentUser?.id;
            const isPending = message?.status === "pending";
            const isFailed = message?.status === "failed";

            return (
              <div
                key={i}
                className={`relative flex ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start space-x-2 group">
                  {selectedUser?.type === "group" &&
                    !isSender &&
                    senderDetails && (
                      <img
                        src={
                          senderDetails?.profilePicture ||
                          "/default-profile.png"
                        }
                        alt={senderDetails?.username || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    )}

                  <div
                    className={`relative px-4 py-2 rounded-lg break-words whitespace-pre-wrap 
                      ${
                        isSender
                          ? "bg-blue-600 text-white" // Sender message on right
                          : "bg-gray-100 text-gray-900" // Receiver message on left
                      }`}
                      style={{ wordBreak: "break-word", maxWidth: "300px" }}
                    
                  >
                    {selectedUser?.type === "group" &&
                      !isSender &&
                      senderDetails && (
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          {senderDetails?.username || "Unknown User"}
                        </p>
                      )}

                    {/* ✅ WhatsApp-like Delete Message Logic */}
                    <p
                      className={`text-sm ${
                        message.deletedBySender ? "italic text-gray-500" : ""
                      }`}
                    >
                      {message.deletedBySender
                        ? isSender
                          ? "You deleted this message." // Sender sees "You deleted this message"
                          : "This message was deleted." // Receiver sees "This message was deleted"
                        : message.content}
                    </p>

                    {isSender && (
                      <span className="text-xs opacity-70 mt-1 block">
                        {isPending
                          ? "Sending..."
                          : isFailed
                          ? "Failed to send"
                          : timeAgo(message.createdAt)}
                      </span>
                    )}

                    {!isSender && (
                      <span className="text-xs opacity-70 mt-1 block">
                        {timeAgo(message.createdAt)}
                      </span>
                    )}

                    <DropdownMenu>
                      {!message.deletedBySender && ( // ✅ Hide options when message is deleted
                        <DropdownMenuTrigger asChild>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer">
                            <MoreVertical className="w-5 h-5" />
                          </div>
                        </DropdownMenuTrigger>
                      )}
                      {!message.deletedBySender && (
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>React</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleMsgDelete(
                                message.tempId,
                                senderId,
                                isSender
                              )
                            }
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}

      <div ref={endOfMessagesRef} />
    </div>
  );
}
