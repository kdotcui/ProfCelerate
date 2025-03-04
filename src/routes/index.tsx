import React, { Suspense, lazy } from 'react';
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
import Classes from '@/pages/Dashboard/Class/Classes';

// Lazy-loaded pages for better performance
const ClassPage = lazy(() => import('@/pages/Dashboard/Class/ClassPage'));

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

            {/* Classes routes */}
            <Route path="classes">
              <Route index element={<Classes />} />
              <Route
                path=":id"
                element={
                  <Suspense fallback={<div>Loading class...</div>}>
                    <ClassPage />
                  </Suspense>
                }
              />

              {/* Future assignment route */}
              <Route
                path=":id/assignments/:assignmentId"
                element={
                  <Suspense fallback={<div>Loading assignment...</div>}>
                    <div>Assignment Page (Coming Soon)</div>
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
