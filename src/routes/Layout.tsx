import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useLocation } from 'react-router-dom';
import {
  Home,
  Inbox,
  LayoutDashboard,
  Calendar,
  Search,
  FolderSearch2,
} from 'lucide-react';

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
  {
    title: 'Classes',
    url: '/dashboard/classes',
    icon: FolderSearch2,
  },
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
  const getTitleByLocation = () => {
    // First, try to find a match in your mainItems
    const matchedItem = mainItems.find(
      (item) => location.pathname === item.url
    );
    if (matchedItem) return matchedItem.title;

    // If no match found, extract from path
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Home';

    // Find the last non-numeric segment
    let lastTextSegment = '';
    for (let i = paths.length - 1; i >= 0; i--) {
      if (isNaN(Number(paths[i]))) {
        lastTextSegment = paths[i];
        break;
      }
    }

    // If no text segment found, use the last segment
    if (!lastTextSegment) {
      lastTextSegment = paths[paths.length - 1];
    }

    // Convert to title case with multiple word handling
    return lastTextSegment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageTitle = location.pathname === '/' ? 'Home' : getTitleByLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
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

          <div className="flex-1 p-6 overflow-auto ">
            {/* Use Outlet for react-router-dom nested routes or children prop */}
            {/* Checking if Outlet is available, otherwise render children */}
            <div className="w-full">
              {typeof Outlet === 'function' ? (
                <Outlet />
              ) : React.isValidElement(children) ? (
                children
              ) : null}
            </div>
          </div>

          <footer className="border-t p-2 text-sm text-center text-muted-foreground">
            ©{new Date().getFullYear()} ProfCelerate
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
