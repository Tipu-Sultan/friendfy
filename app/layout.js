import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ReduxProvider } from "@/redux/ReduxProvider";
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import ClientProvider from './ClientProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { OnlineUsersProvider } from '@/context/OnlineUsersContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Social Media App',
  description: 'A modern social media application',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ReduxProvider>
        <ClientProvider
        >
          <div className="min-h-screen bg-background">
          <Toaster/>
          {session && <Sidebar />}
          {session && <Topbar />}
          <OnlineUsersProvider userId={session?.user?.id}>
            <main className={session ?'pt-16 pb-16 md:pb-0 md:ml-64':''}>
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
            </OnlineUsersProvider>
            {session && <MobileNav />}
          </div>
          </ClientProvider>
        </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}