'use client'
import { useState } from 'react';
import UserList from '@/components/chat/UserList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import EmptyChat from '@/components/chat/EmptyChat';
import { Card } from '@/components/ui/card';

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const users = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: true,
      lastMessage: 'Hey, how are you?',
      time: '2m ago',
    },
    // Add more users
  ];

  const messages = [
    {
      id: 1,
      sender: 'Alice Johnson',
      content: 'Hey, how are you?',
      timestamp: '2:30 PM',
      isSender: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'I m doing great! How about you?',
      timestamp: '2:31 PM',
      isSender: true,
    },
    {
      id: 3,
      sender: 'Alice Johnson',
      content: 'Hey, how are you?',
      timestamp: '2:30 PM',
      isSender: false,
    },
    {
      id: 4,
      sender: 'Alice Johnson',
      content: 'Hey, how are you?',
      timestamp: '2:30 PM',
      isSender: false,
    },
    {
      id: 5,
      sender: 'Alice Johnson',
      content: 'Hey, how are you?',
      timestamp: '2:30 PM',
      isSender: false,
    },
    {
      id: 6,
      sender: 'Alice Johnson',
      content: 'Hey, how are you?',
      timestamp: '2:30 PM',
      isSender: false,
    },
    {
      id: 7,
      sender: 'Alice Johnson',
      content: 'Hey, how are you?',
      timestamp: '2:30 PM',
      isSender: false,
    },
    // Add more messages
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      <UserList users={users} setSelectedUser={setSelectedUser} setIsMobileView={setIsMobileView} selectedUser={selectedUser} isMobileView={isMobileView} />
      
      <div className={`md:col-span-2 lg:col-span-3 ${!selectedUser && isMobileView ? 'hidden' : 'block'} overflow-y-auto`}>
        {selectedUser ? (
          <Card className="h-full flex flex-col">
            <ChatHeader selectedUser={selectedUser} isMobileView={isMobileView} setSelectedUser={setSelectedUser} />
            <ChatMessages messages={messages} />
            <ChatInput />
          </Card>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}
