import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationBar } from '@/components/landingpage/navigation-bar';
import { Footer } from '@/components/landingpage/footer';

const LandingPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout; 