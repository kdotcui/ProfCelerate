// components/app-sidebar.tsx
import {
  Calendar,
  Home,
  Inbox,
  Info,
  LayoutDashboard,
  Search,
  Settings,
  User,
  LogOut,
  Mail,
  Shield,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProfessorIcon from '@/icons/Professor';

// // Additional items for secondary group
// const secondaryItems = [
//   {
//     title: 'Messages',
//     url: '/messages',
//     icon: Mail,
//   },
//   {
//     title: 'Security',
//     url: '/security',
//     icon: Shield,
//   },
//   {
//     title: 'Billing',
//     url: '/billing',
//     icon: CreditCard,
//   },
//   {
//     title: 'Settings',
//     url: '/settings',
//     icon: Settings,
//   },
//   {
//     title: 'Help',
//     url: '/help',
//     icon: HelpCircle,
//   },
// ];

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string;
}

interface AppSidebarProps {
  mainItems: SidebarItem[];
  secondaryItems?: SidebarItem[];
}

export function AppSidebar({ mainItems, secondaryItems }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              <ProfessorIcon size={16} />
            </span>
          </div>
          <span className="font-semibold">ProfCelerate</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main navigation group */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary group */}
        {secondaryItems && (
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-auto p-2 px-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Profile"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs">
                  <span className="font-medium">John Doe</span>
                  <span className="text-muted-foreground">
                    john@example.com
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
