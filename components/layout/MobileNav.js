"use client";

import {
  Home,
  Menu,
  User,
  Bell,
  MessageCircle,
  Users,
  Compass,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { signOut } from 'next-auth/react';

export default function MobileNav() {
  const { user} = useUser();
  const pathname = usePathname();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help Center', path: '/help' },
  ];

  const closeSheet = () => setIsSheetOpen(false);
  const SignOut = () => {
      signOut({ callbackUrl: "/login" }); // Redirect to login page after logout
    };

  const renderMenuItem = ({ icon: Icon, label, path }) => (
    <Link
      key={path}
      href={path}
      onClick={closeSheet} // Close the Sheet on link click
      className={`flex items-center text-sm px-4 py-3 mb-2 rounded-lg transition-colors ${
        pathname === path
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-secondary'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {menuItems.slice(0, 3).map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            href={path}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              pathname === path ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground">
            <Menu className="w-5 h-5" />
            <span className="text-xs mt-1">Menu</span>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Menu</SheetTitle>
            <div className="py-4 space-y-4">
              {menuItems.map(renderMenuItem)}
              <button
                onClick={SignOut}
                className="flex items-center w-full text-left text-red-600 text-sm font-medium hover:underline"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
