// src/routes/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Layout from './Layout';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

// Protected route wrapper
import ProtectedRoute from './ProtectedRoute';
import DashboardHome from '../pages/Dashboard/DashboardHome';
import Settings from '../pages/Dashboard/Settings';

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Protected routes (wrapped with <ProtectedRoute>) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<DashboardHome />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
