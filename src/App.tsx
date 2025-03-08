// src/App.tsx
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from 'sonner';

const backend = 'http://localhost:5000';
function App() {
  useEffect(() => {
    fetch(`${backend}/api/test`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
