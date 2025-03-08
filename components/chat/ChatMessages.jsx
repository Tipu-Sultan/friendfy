import { deleteMessage, fetchPaginationsMessages, updateDeleteMessage } from '@/redux/slices/chatSlice';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { MoreVertical } from 'lucide-react'; // Assuming you're using Lucide icons
import { timeAgo } from '@/utils/timeAgo';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '../ui/skeleton';

export default function ChatMessages({chatLoading, selectedUser, currentUser,privateSocket }) {
  const dispatch = useDispatch()
  const {messages } = useSelector((state) => state.chat);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleDelete = (msgId,senderId,isSender) => {
    privateSocket?.emit("delete-message", {msgId,isSender});
    dispatch(deleteMessage({msgId,senderId,isSender}))
  };


  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = async () => {
    const container = chatContainerRef.current;

    if (container.scrollTop === 0 && chatLoading !== 'fetchPaginationsMessages' && currentPage < totalPages) {
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

  useEffect(() => {
    if (privateSocket) {
      privateSocket?.on("message-deleted", ({msgId,isSender}) => {
        dispatch(updateDeleteMessage({msgId,isSender}))
      });

      return () => {
        privateSocket?.off("message-deleted");
      };
    }
  }, [dispatch, privateSocket]);

  const filteredMessages = messages.filter((message) => {
    const senderDetails = selectedUser?.type === 'group' ? message?.sender : null;
    const isSender = senderDetails?._id === currentUser?.id || message?.sender === currentUser?.id;
    // Filter out messages deleted by the receiver if the current user is not the sender
    if (!isSender && message?.deletedByReceiver) return false;
    // Filter out messages deleted by the sender for all users
    if (isSender && message?.deletedBySender) return false;
    return true;
  });
  

  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth p-4 space-y-4"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onScroll={handleScroll}
      ref={chatContainerRef}
    >
      {chatLoading === 'fetchPaginationsMessages' && (
        <div className="w-full flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {chatLoading === 'fetchMessages'
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-start">
              <Skeleton className="w-2/3 h-12 rounded-lg" />
            </div>
          ))
        : filteredMessages?.map((message, i) => {
            const senderDetails = selectedUser?.type === 'group' ? message?.sender : null;
            const senderId = selectedUser?.type === 'group' ? message?.sender?._id : message?.sender ;
            const isSender = senderDetails?._id === currentUser?.id || message?.sender === currentUser?.id;
            const isPending = message?.status === 'pending';
            const isFailed = message?.status === 'failed';

            return (
              <div
                key={i}
                className={`relative flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 group">
                  {selectedUser?.type === 'group' && !isSender && senderDetails && (
                    <img
                      src={senderDetails?.profilePicture || '/default-profile.png'}
                      alt={senderDetails?.username || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div
                    className={`relative max-w-[70%] rounded-lg p-3 ${
                      isSender ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                    style={{ minWidth: '100px', maxWidth: '200px' }}
                  >
                    {selectedUser?.type === 'group' && !isSender && senderDetails && (
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        {senderDetails?.username || 'Unknown User'}
                      </p>
                    )}

                    <p className="text-sm">{message.content}</p>

                    {isSender && (
                      <span className="text-xs opacity-70 mt-1 block">
                        {isPending
                          ? 'Sending...'
                          : isFailed
                          ? 'Failed to send'
                          : timeAgo(message.createdAt)}
                      </span>
                    )}

                    {!isSender && (
                      <span className="text-xs opacity-70 mt-1 block">
                        {timeAgo(message.createdAt)}
                      </span>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer">
                          <MoreVertical className="w-5 h-5" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>React</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(message.tempId,senderId,isSender)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
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
