'use client'
import { use } from 'react';
import UserList from '@/components/chat/UserList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import EmptyChat from '@/components/chat/EmptyChat';
import { Card } from '@/components/ui/card';
import { useUserList } from '@/hooks/useUserList';
import useDynamicView from '@/hooks/useDynamicView';
import { useSelector } from 'react-redux';
import { useChat } from '@/hooks/useChats';
import { useUser } from '@/hooks/useUser';
import { getAblyClient } from '@/lib/ablyClient';
import { useOnlineUsers } from '@/context/OnlineUsersContext';


export default function Chat({ params }) {
    const { username } = use(params);
    const { user} = useUser();
    const isMobileView = useDynamicView();
      const client = getAblyClient(user?.id || null);
    
    const {
        groupData,
        groupName,
        groupsFriends,
        showGroupModal,
        search,
        filteredUsers,
        groupUsers,
        setShowGroupModal,
        setGroupName,
        setGroupUsers,
        handleCreateGroup,
        handleJoinGroup,
        handleModalOpen,
        handleSearch,
        setSelectedUser,
        handleSelectedUsers,
        handleGroupSettings,
        isModalOpen, 
        setIsModalOpen,
        updateGroup,
    } = useUserList(user, username)
    const {
        loadMessages,handleMessageSend, setContent, 
        content,handleMsgDelete,sendTypingEvent,typingUsers,isTyping, setIsTyping} = useChat(user,client)

    const { messages, recentChats,selectedUser,chatLoading } = useSelector((state) => state.chat)

    const onlineUsers = useOnlineUsers();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            <UserList
            onlineUsers={onlineUsers}
            authData={user}
                isMobileView={isMobileView}
                username={username}
                filteredUsers={filteredUsers}
                search={search}
                chatLoading={chatLoading}
                selectedUser={selectedUser}
                handleSearch={handleSearch}
                recentChats={recentChats}
                handleModalOpen={handleModalOpen}
                handleCreateGroup={handleCreateGroup}
                handleJoinGroup={handleJoinGroup}
                showGroupModal={showGroupModal}
                setShowGroupModal={setShowGroupModal}
                groupName={groupName}
                setGroupName={setGroupName}
                groupsFriends={groupsFriends}
                groupUsers={groupUsers}
                setGroupUsers={setGroupUsers}
                handleSelectedUsers={handleSelectedUsers}
                loadMessages={loadMessages}
                message={messages}
                handleGroupSettings={handleGroupSettings}
                groupData={groupData}
                isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        updateGroup={updateGroup}
            />

            <div className={`md:col-span-2 lg:col-span-3 ${!selectedUser && isMobileView ? 'hidden' : 'block'} overflow-y-auto`}>
                {selectedUser ? (
                    <Card className="h-full flex flex-col">
                        <ChatHeader currentUser={user} ablyClient={client} onlineUsers={onlineUsers} typingUsers={typingUsers} isTyping={isTyping}  selectedUser={selectedUser} isMobileView={isMobileView} setSelectedUser={setSelectedUser} />
                        <ChatMessages
                        handleMsgDelete={handleMsgDelete}
                            loadMessages={loadMessages}
                            currentUser={user}
                            selectedUser={selectedUser}
                            messages={messages}
                            chatLoading={chatLoading}
                        />
                        {!selectedUser?.isBlocked && <ChatInput 
                        sendTypingEvent={sendTypingEvent}
                        selectedUser={selectedUser}
                         user={user}
                         isTyping={isTyping} 
                         setIsTyping={setIsTyping}
                         handleMessageSend={handleMessageSend}
                         setContent={setContent}
                         content={content}
                          />}
                    </Card>
                ) : (
                    <EmptyChat />
                )}
            </div>
        </div>
    );
}
