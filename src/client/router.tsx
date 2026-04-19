import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load all pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Wrapper to add Suspense to each route
const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
  return () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Component />
    </Suspense>
  );
};

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    Component: withSuspense(HomePage)
  },
  {
    path: '/terms',
    Component: withSuspense(TermsPage)
  },
  {
    path: '/privacy',
    Component: withSuspense(PrivacyPage)
  },
  {
    path: '*',
    Component: withSuspense(NotFoundPage)
  }
];

export const router = createBrowserRouter(publicRoutes);
