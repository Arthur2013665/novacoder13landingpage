import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import { router } from './router';
import './index.css';

// Minimal initial render - no Suspense wrapper, no toast on initial load
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>
);
