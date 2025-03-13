// src/pages/Home.tsx
import React from 'react';
import { Features } from '@/components/landingpage/features';
import { Demo } from '@/components/landingpage/demo';
import { Questions } from '@/components/landingpage/questions';

const Home: React.FC = () => {
  return (
    <div>
      <Features />
      {/* <Demo /> */}
      <Questions />
    </div>
  );
};

export default Home;
