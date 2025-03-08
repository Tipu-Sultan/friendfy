import { Bell, Search } from 'lucide-react';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

export default function Topbar() {
  return (
    <header className="h-16 fixed top-0 right-0 left-0 md:left-64 bg-card border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-full text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-secondary rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}