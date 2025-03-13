import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-800 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Company Info & Social Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3">ProfCelerate</h3>
              <p className="text-slate-400">
                A modern-day grading tool so you can spend more time teaching, not grading.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="https://www.linkedin.com/in/jiahaoli0465/" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20}/>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="https://www.instagram.com/jiahao._.li/" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="https://github.com/jiahaoli0465" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-white hover:bg-slate-800">
                <a href="mailto:jiahaoli0465@gmail.com">
                  <Mail size={20} />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Quick Links & Legal */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="terms-agreement" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} ProfCelerate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};