"use client";
import {
  Home,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  Search,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const { user} = useUser();
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);

  const pathname = usePathname();

  

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Messages", path: "/chat", matchPath: "/chat" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const SignOut = () => {
    signOut({ callbackUrl: "/login" }); // Redirect to login page after logout
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card fixed left-0 top-0 border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Peopulse.com</h1>
      </div>

      <nav className="flex-1 px-2 py-4">
        <button
          onClick={() => setIsSearchSheetOpen(true)}
          className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors hover:bg-secondary`}
        >
          <Search className="w-5 h-5 mr-3" />
          <span>Search</span>
        </button>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.matchPath
              ? pathname.startsWith(item.matchPath)
              : pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Sheet
        open={isSearchSheetOpen}
        onOpenChange={setIsSearchSheetOpen}
      >
        <SheetContent side="left">
          <SheetTitle>Search</SheetTitle>
          <div className="border-b my-4"></div>
          <div className="py-4 space-y-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary"
            />
            <div>Search results will appear here...</div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="p-4 border-t">
        {user ? (
          <button
            onClick={SignOut}
            className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            href={"/login"}
            className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
