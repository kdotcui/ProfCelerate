// src/routes/Layout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <header>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2025 My Awesome Project</p>
      </footer>
    </div>
  );
};

export default Layout;
