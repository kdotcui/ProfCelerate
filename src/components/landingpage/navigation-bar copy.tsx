import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "../ui/button";
import { User as UserIcon, Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import ProfessorIcon from "@/icons/Professor";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User } from '@supabase/supabase-js';

export const NavigationBar = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log(`User successfully retrieved`, user)
          setCurrentUser(user);
        } else {
          console.log("User cannot be retrieved")
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
            <a href="#testimonials" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Customers
            </a>
            <a href="#pricing" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
              Pricing
            </a>
            {currentUser && (
              <Link to="/dashboard" className={`text-lg ${buttonVariants({ variant: "ghost" })}`}>
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex gap-2">
            {!currentUser ? (
              <Link to="/login" className={`text-large ${buttonVariants({ variant: "secondary" })}`}>
                <UserIcon className="mr-2 h-5 w-5" />
                Login
              </Link>
            ) : (
              <button 
                onClick={handleLogout}
                className={`text-large ${buttonVariants({ variant: "secondary" })}`}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
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
