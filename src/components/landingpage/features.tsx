import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { User } from '@supabase/supabase-js';
import DashboardMock from "../../../public/images/dashboardmockup.png";

export const Features = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(`User`, user);
        setUser(user);
      } catch (error) {
        setUser(null);
        console.error("Error fetching user:", error);
        toast.error('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleSignUp = () => {
    if (email) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      toast.error('Please enter your email address.');
    }
  };
  
  return (
    <div className="hidden md:flex justify-between gap-x-4 px-20 py-12" >
      <div className="w-1/2 flex flex-col text-black justify-center space-y-6">
        <h1 className="leading-tight font-semibold text-6xl mb-2">
          <span className="block">Grading is tedious.</span>
          <span className="block">Let us help.</span>
        </h1>
        <h2 className="text-gray-500 text-xl max-w-md leading-relaxed ">
          Easy-to-use assignment grader. Handles text and audio seamlessly, with flexibile AI models. All in one place.
        </h2>
        <div className="flex w-full max-w-lg items-center space-x-1 mt-4">
          <Input 
            type="email" 
            id="email" 
            placeholder="your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" onClick={handleSignUp}>Join today</Button>
        </div>
      </div>
      <div className="w-1/2">
        <img src={DashboardMock} alt="Dashboard Mockup" className="w-full h-auto rounded-lg" />
      </div>
    </div>
  )
}