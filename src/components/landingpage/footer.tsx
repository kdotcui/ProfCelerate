import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github, Instagram, Linkedin, ArrowRight, Mail} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-800 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-30 text-left">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">ProfCelerate</h3>
            <p className="text-slate-400 text-wrap">A modern-day grading tool so you can spend more time teaching, not grading.</p>
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="https://www.linkedin.com/in/jiahaoli0465/" target="_blank"><Linkedin size={20}/></a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="https://www.instagram.com/jiahao._.li/" target="_blank"><Instagram size={20} /></a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="https://github.com/jiahaoli0465" target="_blank"><Github size={20} /></a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="mailto:jiahaoli0465@gmail.com"><Mail size={20} /></a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Products</a></li>
            </ul>
          </div>

          {/* Terms & Policies */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold">Terms & Policies</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div> */}
        </div>

        <Separator className="my-8 bg-slate-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} ProfCelerate. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm text-slate-400">
              <li><Link to="terms-agreement" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="privacy-policy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};