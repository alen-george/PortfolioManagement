import { lazy } from 'react';

const PortfolioPerformance = lazy(() => import('../Portfolio/pages/PortfolioPerformance'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Login = lazy(() => import('../pages/Login'));

export const routes = [
  {
    path: '/login',
    element: <Login />,
    layout: null
  },
  {
    path: '/',
    element: <LandingPage />,
    layout: 'main'
  },
  {
    path: '/portfolio/performance',
    element: <PortfolioPerformance />,
    layout: 'main'
  }
];
