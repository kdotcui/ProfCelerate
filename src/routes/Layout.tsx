// src/routes/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useLocation } from 'react-router-dom';
import { Home, Inbox, LayoutDashboard, Calendar, Search } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

// Main navigation items
const mainItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  //   {
  //     title: 'Inbox',
  //     url: '/inbox',
  //     icon: Inbox,
  //     badge: '12',
  //   },
  //   {
  //     title: 'Projects',
  //     url: '/projects',
  //     icon: LayoutDashboard,
  //   },
  //   {
  //     title: 'Calendar',
  //     url: '/calendar',
  //     icon: Calendar,
  //   },
  //   {
  //     title: 'Search',
  //     url: '/search',
  //     icon: Search,
  //   },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const pageTitle =
    location.pathname === '/'
      ? 'Home'
      : location.pathname.replace('/', '').replace('-', ' ').toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* AppSidebar is your existing sidebar component */}
        <AppSidebar mainItems={mainItems} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 h-16 border-b bg-background flex items-center px-6">
            {/* SidebarTrigger is your toggle for the sidebar */}
            <SidebarTrigger className="h-8 w-8 md:mr-4" />

            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xl font-semibold">{pageTitle}</h1>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {/* Use Outlet for react-router-dom nested routes or children prop */}
            {/* Checking if Outlet is available, otherwise render children */}
            {typeof Outlet === 'function' ? (
              <Outlet />
            ) : React.isValidElement(children) ? (
              children
            ) : null}
          </div>

          <footer className="border-t py-4 px-6 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} ProfCelerate</p>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
