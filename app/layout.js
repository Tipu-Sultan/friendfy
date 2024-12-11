import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ReduxProvider } from "@/redux/ReduxProvider";
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import { SocketProvider } from "@/components/socketContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Social Media App',
  description: 'A modern social media application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ReduxProvider>
        <SocketProvider>

          <div className="min-h-screen bg-background">
            <Sidebar />
            <Topbar />
            <main className="pt-16 pb-16 md:pb-0 md:ml-64">
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
          </SocketProvider>

        </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}