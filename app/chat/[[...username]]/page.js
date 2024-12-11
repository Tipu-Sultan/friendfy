'use client'
import { use, useEffect } from 'react';
import UserList from '@/components/chat/UserList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import EmptyChat from '@/components/chat/EmptyChat';
import { Card } from '@/components/ui/card';
import { useUserList } from '@/hooks/useUserList';
import useAuthData from '@/hooks/useAuthData';
import useDynamicView from '@/hooks/useDynamicView';
import { useSelector } from 'react-redux';
import { useChat } from '@/hooks/useChats';
import { useSocket } from '../../../components/socketContext';


export default function Chat({ params }) {
    const privateSocket = useSocket();
    const { username } = use(params);
    const isMobileView = useDynamicView();
    const { user } = useAuthData()

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
    } = useUserList(user, username,privateSocket)
    const {loadMessages,handleMessageSend, setContent, content} = useChat(user, username,privateSocket)

    const { messages, recentChats,selectedUser,chatLoading } = useSelector((state) => state.chat)




    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            <UserList
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
                handleGroupSettings={handleGroupSettings}
                groupData={groupData}
                isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        updateGroup={updateGroup}
            />

            <div className={`md:col-span-2 lg:col-span-3 ${!selectedUser && isMobileView ? 'hidden' : 'block'} overflow-y-auto`}>
                {selectedUser ? (
                    <Card className="h-full flex flex-col">
                        <ChatHeader selectedUser={selectedUser} isMobileView={isMobileView} setSelectedUser={setSelectedUser} />
                        <ChatMessages
                            loadMessages={loadMessages}
                            currentUser={user}
                            selectedUser={selectedUser}
                            messages={messages}
                            privateSocket={privateSocket}
                            chatLoading={chatLoading}
                        />
                        <ChatInput 
                        selectedUser={selectedUser}
                         user={user}
                         handleMessageSend={handleMessageSend}
                         setContent={setContent}
                         content={content}
                          />
                    </Card>
                ) : (
                    <EmptyChat />
                )}
            </div>
        </div>
    );
}
