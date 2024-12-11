import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const GroupModal = ({
  handleCreateGroup,
  handleJoinGroup,
  showGroupModal,
  setShowGroupModal,
  groupName,
  setGroupName,
  groupsFriends,
  groupUsers,
  setGroupUsers,
  chatLoading,
}) => {
  const [activeTab, setActiveTab] = useState("create"); // State to manage active tab
  const [joinGroupId, setJoinGroupId] = useState(""); // State for group ID input in Join Group tab

  return (
    <div>
      {/* Group Modal with Tabs */}
      <Dialog open={showGroupModal} onOpenChange={setShowGroupModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "create" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("create")}
                >
                  Create Group
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "join" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("join")}
                >
                  Join Group
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "create" ? (
              // Create Group Tab
              <div>
                <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mb-4"
                />
                <div className="text-sm text-muted-foreground mb-4">
                  Select users to add to this group.
                </div>
                <div className="space-y-2">
                  {groupsFriends?.map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={groupUsers.includes(user._id)}
                        onChange={() =>
                          setGroupUsers((prev) =>
                            prev.includes(user._id)
                              ? prev.filter((id) => id !== user._id)
                              : [...prev, user._id]
                          )
                        }
                      />
                      <Avatar>
                        <img src={user?.profilePicture} alt={user?.username} className="w-8 h-8 rounded-full" />
                      </Avatar>
                      <span>{user?.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Join Group Tab
              <div>
                <Input
                  placeholder="Enter Group ID"
                  value={joinGroupId}
                  onChange={(e) => setJoinGroupId(e.target.value)}
                  className="mb-4"
                />
                <Button
                  onClick={() => handleJoinGroup(joinGroupId)}
                  disabled={chatLoading === "joinGroup"}
                >
                  {chatLoading === "joinGroup" ? "Joining..." : "Join Group"}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGroupModal(false)}>
              Close
            </Button>
            {activeTab === "create" && (
              <Button onClick={handleCreateGroup} disabled={chatLoading === "joinGroup"}>
                {chatLoading === "createGroup" ? "Creating..." : "Create Group"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupModal;
