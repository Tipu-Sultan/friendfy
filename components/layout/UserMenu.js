"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '../../hooks/useUser';
import { signOut } from 'next-auth/react';


export default function UserMenu() {
  const { user } = useUser();

  const SignOut = () => {
        signOut({ callbackUrl: "/login" }); // Redirect to login page after logout
      };

  return (
    <>
      {user &&
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="cursor-pointer">
              <Image
                src={user?.profilePicture}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                width={8}
                height={8}
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link href={`/profile/${user?.username}`}>
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-3" />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={SignOut}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </>
  );
}