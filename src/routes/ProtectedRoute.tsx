// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function isAuthenticated(): boolean {
  // Replace this with your real auth logic:
  // e.g., check for a token, user object in context, etc.
  //   return Boolean(localStorage.getItem('token'));
  return true; // for now
}

const ProtectedRoute: React.FC = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
