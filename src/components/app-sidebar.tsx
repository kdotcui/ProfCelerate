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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
import { toast } from 'sonner';

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

interface UserProfile {
  full_name: string;
  institution: string;
  department: string;
}

export function AppSidebar({ mainItems, secondaryItems }: AppSidebarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

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
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile?.full_name || user?.email || ''
                    )}&background=random`}
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {profile?.full_name
                      ? getInitials(profile.full_name)
                      : user?.email?.[0].toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs">
                  <span className="font-medium">
                    {profile?.full_name || 'Loading...'}
                  </span>
                  <span className="text-muted-foreground">
                    {user?.email || 'Loading...'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
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
