import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, MoreVertical } from "lucide-react";
import { timeAgo } from "@/utils/timeAgo";
import CreateGroup from "@/components/ui-modols/CreateGroup";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GroupSettings from "../ui-modols/GroupSettings";

export default function UserList({
  search,
  chatLoading,
  selectedUser,
  isMobileView,
  handleSearch,
  filteredUsers,
  handleModalOpen,
  handleCreateGroup,
  handleJoinGroup,
  showGroupModal,
  setShowGroupModal,
  groupName,
  setGroupName,
  groupsFriends,
  groupUsers,
  setGroupUsers,
  loadMessages,
  handleSelectedUsers,
  handleGroupSettings,
  groupData,
  isModalOpen,
  setIsModalOpen,
  updateGroup,
  authData,
  onlineUsers,
}) {
  return (
    <div
      className={`md:col-span-1 ${
        selectedUser && isMobileView ? "hidden" : "block"
      } overflow-y-auto`}
    >
      <Card className="h-full overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-xl">Messages</h2>
          <Button variant="ghost" size="icon" onClick={() => handleModalOpen()}>
            <Plus />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search friends"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* User List */}
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          {chatLoading === "fetchRecentChats"
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-4 border-b"
                >
                  <Skeleton className="w-12 h-12 rounded-full" /> {/* Avatar */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" /> {/* Name */}
                    <Skeleton className="h-4 w-3/4" /> {/* Last Message */}
                  </div>
                </div>
              ))
            : filteredUsers
                ?.slice() // Create a shallow copy
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by latest update time
                .map((recentUser, i) => (
                  <div
                    key={i}
                    className={`w-full p-4 flex items-center space-x-3 hover:bg-secondary transition-colors border-b ${
                      selectedUser?.id === recentUser?.id ? "bg-secondary" : ""
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (selectedUser?.id !== recentUser?.id) {
                          handleSelectedUsers(recentUser);
                        }
                      }}
                      className="flex-1 flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="relative">
                        <Avatar>
                          <img
                            src={recentUser?.profilePicture}
                            alt={recentUser?.name}
                            className="w-12 h-12 rounded-full"
                          />
                        </Avatar>
                        {/* Online Status Indicator */}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                            onlineUsers.includes(recentUser?.id)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="font-semibold">{recentUser?.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {recentUser?.lastMessage?.text}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(recentUser?.updatedAt)}
                      </span>
                    </div>

                    {/* User Options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className="focus:outline-none"
                      >
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleGroupSettings(recentUser?.groupId)
                          }
                        >
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
        </div>
      </Card>

      {/* Create Group Modal */}
      <CreateGroup
        handleCreateGroup={handleCreateGroup}
        showGroupModal={showGroupModal}
        setShowGroupModal={setShowGroupModal}
        groupName={groupName}
        setGroupName={setGroupName}
        groupUsers={groupUsers}
        setGroupUsers={setGroupUsers}
        groupsFriends={groupsFriends}
        chatLoading={chatLoading}
        handleJoinGroup={handleJoinGroup}
      />

      <GroupSettings
        groupData={groupData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        updateGroup={updateGroup}
      />
    </div>
  );
}
