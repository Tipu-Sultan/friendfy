"use client";
import { Home, MessageCircle, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthData from '@/hooks/useAuthData'
import { logoutUser } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthData();
  const pathname = usePathname();

  const handleLogout = async ()=>{
    await dispatch(logoutUser())
    window.location.href = '/auth/login'
  }

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card fixed left-0 top-0 border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Social App</h1>
      </div>

      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        {
          isAuthenticated ? (
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          ) : (
            <Link href={'/auth/login'} className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Login</span>
            </Link>
          )
        }
      </div>
    </aside>
  );
}