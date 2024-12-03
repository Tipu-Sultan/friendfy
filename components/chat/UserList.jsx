import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function UserList({ users, setSelectedUser, setIsMobileView, selectedUser, isMobileView }) {
  return (
    <div className={`md:col-span-1 ${selectedUser && isMobileView ? 'hidden' : 'block'}`}>
      <Card className="h-full overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-xl">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {users.map((user) => (
            <button
              key={user.id}
              className="w-full p-4 flex items-center space-x-3 hover:bg-secondary transition-colors border-b"
              onClick={() => {
                setSelectedUser(user);
                setIsMobileView(window.innerWidth < 768);
              }}
            >
              <div className="relative">
                <Avatar>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                </Avatar>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {user.lastMessage}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{user.time}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
