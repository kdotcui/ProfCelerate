// src/pages/Home.tsx
import React from 'react';
import { PageHeader } from '@/components/landingpage/page-header';
import { Features } from '@/components/landingpage/features';
import { Demo } from '@/components/landingpage/demo';
import { Questions } from '@/components/landingpage/questions';

const Home: React.FC = () => {
  return (
    <div>
      <PageHeader />
      <Features />
      <Demo />
      <Questions />
    </div>
  );
};

export default Home;
