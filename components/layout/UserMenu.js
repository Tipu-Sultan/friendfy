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
import {logoutUser } from '@/redux/slices/authSlice';
import Image from 'next/image';
import useAuthData from '@/hooks/useAuthData';
import { useDispatch } from 'react-redux';


export default function UserMenu() {
  const dispatch = useDispatch();
  const { isAuthenticated,user } = useAuthData();

  const handleLogout = async () => {
    dispatch(logoutUser())
    window.location.href = '/login'
  }

  return (
    <>
      {isAuthenticated &&
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
              onClick={handleLogout}
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