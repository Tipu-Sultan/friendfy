import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChats';
import { Send, Paperclip,FileAudio,FileVideo,Image,FileMinus } from 'lucide-react';
import { useRef, useState } from 'react';
import AttachFile from '@/components/ui-modols/AttachFile'
import { useDispatch, useSelector } from 'react-redux';
import { setContent } from '@/redux/slices/chatSlice';

export default function ChatInput({isTyping, setIsTyping,sendTypingEvent, selectedUser, user,handleMessageSend}) {
  const dispatch = useDispatch()
  const {content} = useSelector((state)=>state.chat)
  const textareaRef = useRef(null);
  const [showModal, setShowModal] = useState(false);


  const handleInputChange = (e) => {
    e.stopPropagation();
    dispatch(setContent(e.target.value));
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;


    if (!isTyping) {
      sendTypingEvent(true);
    }

    // Stop typing after 2 seconds of inactivity
    setTimeout(() => {
      setIsTyping(false);
      sendTypingEvent(false);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) return; // Allow Shift + Enter for new lines
      e.preventDefault();
      if (content.trim() !== '') {
        handleMessageSend(user?.id, selectedUser?.id,selectedUser?.type);
        dispatch(setContent(''));
        textareaRef.current.style.height = 'auto'; // Reset height
        sendTypingEvent(false);
      }
    }
  };

  return (
    <div className="p-4 border-t relative">
      <div className="flex items-center space-x-2">
        {/* Paperclip Icon for Attachment */}
        <Button
          size="icon"
          onClick={() => setShowModal(!showModal)}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <textarea
          ref={textareaRef}
          value={content}
          placeholder="Type a message..."
          className="flex-1 bg-secondary rounded-lg px-4 py-2 focus:outline-none resize-none overflow-y-auto max-h-32"
          rows={1}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <Button
          onClick={() => {
            if (content.trim() !== '') {
              handleMessageSend(user?._id, selectedUser?.id,selectedUser?.type);
              setContent('');
              textareaRef.current.style.height = 'auto';
            }
          }}
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal for Media Attachments */}
      {showModal &&
      <AttachFile showModal={showModal} setShowModal={setShowModal}/>
      }
    </div>
  );
}
