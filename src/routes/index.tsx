import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layout
import Layout from './Layout';

// Pages
import Home from '../pages/LandingPage/Home';
import About from '../pages/LandingPage/About';
import NotFound from '../pages/NotFound';
import TermsAgreement from '../pages/LandingPage/TermsAgreement';
import PrivacyPolicy from '../pages/LandingPage/PrivacyPolicy';

// Protected route wrapper
import ProtectedRoute from './ProtectedRoute';
import Settings from '../pages/Dashboard/Settings';
import Classes from '@/pages/Dashboard/Class/Classes';
import AssignmentPage from '@/pages/Dashboard/Assignment/assignment-page';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { GradedSubmissionsPage } from '@/pages/Dashboard/Assignment/graded-submissions-page';

// Lazy-loaded pages for better performance
const ClassPage = lazy(() => import('@/pages/Dashboard/Class/ClassPage'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/terms-agreement',
    element: <TermsAgreement />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'classes',
            children: [
              {
                index: true,
                element: <Classes />,
              },
              {
                path: ':id',
                element: (
                  <Suspense fallback={<div>Loading class...</div>}>
                    <ClassPage />
                  </Suspense>
                ),
              },
              {
                path: ':classId/assignments/:assignmentId',
                element: (
                  <Suspense fallback={<div>Loading assignment...</div>}>
                    <AssignmentPage />
                  </Suspense>
                ),
              },
              {
                path: ':classId/assignments/:assignmentId/submissions/:submissionId',
                element: (
                  <Suspense fallback={<div>Loading submission results...</div>}>
                    <GradedSubmissionsPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
