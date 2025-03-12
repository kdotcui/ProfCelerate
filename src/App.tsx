// src/App.tsx
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from 'sonner';

const backend = import.meta.env.VITE_BACKEND_URL;

function App() {
  useEffect(() => {
    fetch(`${backend}/api/test`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);
  // please

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
