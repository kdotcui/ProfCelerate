import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "../ui/button";
import { User as UserIcon, Menu} from "lucide-react";
import { Link } from "react-router-dom";
import ProfessorIcon from "@/icons/Professor";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { User } from '@supabase/supabase-js';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { toCamelCase } from '@/lib/utils';

interface UserProfile {
  userId: string;
  fullName: string;
}

export const NavigationBar = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // Set loading to true at start
        const { data: { user } } = await supabase.auth.getUser()
        console.log(`User`,user)
        setCurrentUser(user);
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          console.log('profile', profileData);
          if (profileData) {
            setProfile(toCamelCase(profileData));
          }
        }
      } catch (error) {
        setCurrentUser(null);
        console.error("Error fetching user:", error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false); // Set loading to false when done
      }
    }
    fetchUser();
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a href="/" className="ml-2 font-bold text-xl flex gap-x-1">
              <ProfessorIcon color="black" size={30}/>
              ProfCelerate
            </a>
          </NavigationMenuItem>

          {/* desktop */}
          <div className="hidden md:flex gap-2">
            <a href="#features" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Features
            </a>
            <a href="#demo" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Demo
            </a>
            <a href="#testimonials" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Customers
            </a>
            <a href="#pricing" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Pricing
            </a>
            {/* <Link to="/dashboard" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Dashboard
            </Link> */}
          </div>

          <div className="hidden md:flex gap-2">
            {!currentUser ? (
              <Link to="/login" className={`text-large ${buttonVariants({ variant: "secondary" })}`}>
                <UserIcon />
                Login
              </Link>
            ) : (
              <DropdownMenu>
                
                <DropdownMenuTrigger className={`text-large ${buttonVariants({ variant: "secondary" })}`}>
                  <UserIcon />
                  Hello {profile?.fullName?.split(" ")[0] || currentUser?.email}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleLogout}>Logout</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            )}

          </div>

          {/* mobile */}
          <span className="flex md:hidden">
            <div className="px-2">
              <Menu className="flex md:hidden h-5 w-5">
                <span className="sr-only">Menu Icon</span>
              </Menu>
            </div>
          </span>


        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
