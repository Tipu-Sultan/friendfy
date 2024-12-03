"use client";

import { Home, MessageCircle, Users, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MobileNav() {
  const pathname = usePathname();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: Users, label: 'Friends', path: '/friends' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                pathname === item.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
        
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground">
            <Menu className="w-5 h-5" />
            <span className="text-xs mt-1">Menu</span>
          </SheetTrigger>
          <SheetContent>
            <div className="py-4">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              {/* Add additional menu items here */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}