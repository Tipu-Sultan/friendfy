import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "../ui/checkbox";

const GroupSettings = ({ groupData, isModalOpen, setIsModalOpen, updateGroup }) => {
  const [activeTab, setActiveTab] = useState("general"); // Track active tab
  const [updatedData, setUpdatedData] = useState(groupData); // Clone group data for editing

  // Handle setting updates
  const handleUpdate = (field, value) => {
    setUpdatedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Group Settings</DialogTitle>
          <div className="flex justify-center space-x-6 mt-4 border-b pb-2">
            {[
              { id: "general", label: "General" },
              { id: "privacy", label: "Privacy" },
              { id: "admins", label: "Admins" },
              { id: "members", label: "Members" },
              { id: "notifications", label: "Notifications" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium transition-colors duration-200 text-sm ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="mt-6">
          {activeTab === "general" && (
            <div>
              <Input
                placeholder="Group Name"
                value={groupData?.name ?? ""}
                onChange={(e) => handleUpdate("name", e.target.value)}
                className="mb-4"
              />
              <Input
                placeholder="Group Description"
                value={groupData?.description ?? ""}
                onChange={(e) => handleUpdate("description", e.target.value)}
                className="mb-4"
              />
              <div className="mb-4">
                <span className="text-sm font-medium">Group Type:</span> {groupData?.groupType}
              </div>
              <Checkbox
                label="Mute Group"
                checked={groupData?.isMuted ?? false}
                onCheckedChange={(value) => handleUpdate("isMuted", value)}
              />
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-3">
              <Checkbox
                label="Private Group"
                checked={groupData?.settings?.isPrivate ?? false}
                onCheckedChange={(value) =>
                  handleUpdate("settings", { ...groupData?.settings, isPrivate: value })
                }
              />
              <Checkbox
                label="Allow Invites"
                checked={groupData?.settings?.allowInvite ?? false}
                onCheckedChange={(value) =>
                  handleUpdate("settings", { ...groupData?.settings, allowInvite: value })
                }
              />
              <Checkbox
                label="Archived"
                checked={groupData?.settings?.isArchived ?? false}
                onCheckedChange={(value) =>
                  handleUpdate("settings", { ...groupData?.settings, isArchived: value })
                }
              />
            </div>
          )}

          {activeTab === "admins" && (
            <div className="space-y-3">
              {groupData?.admins?.map((admin) => (
                <div key={admin?._id} className="flex items-center space-x-3">
                  <Avatar>
                    <img
                      src={admin?.profilePicture ?? ""}
                      alt={admin?.username ?? ""}
                      className="w-8 h-8 rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <span className="block font-medium">{admin?.username ?? "Unknown"}</span>
                    <span className="text-sm text-muted-foreground">{admin?.email}</span>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleUpdate(
                        "admins",
                        groupData?.admins?.filter((id) => id !== admin?._id)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-3">
              {groupData?.members?.map((member) => (
                <div key={member?._id} className="flex items-center space-x-3">
                  <Avatar>
                    <img
                      src={member?.profilePicture ?? ""}
                      alt={member?.username ?? ""}
                      className="w-8 h-8 rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <span className="block font-medium">{member?.username ?? "Unknown"}</span>
                    <span className="text-sm text-muted-foreground">{member?.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-3">
              <Checkbox
                label="Enable Notifications"
                checked={groupData?.notificationsEnabled ?? false}
                onCheckedChange={(value) => handleUpdate("notificationsEnabled", value)}
              />
              <div className="text-sm font-medium">
                Pinned Messages: {groupData?.pinnedMessages?.length ?? 0}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              updateGroup(groupData);
              setIsModalOpen(false);
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupSettings;
