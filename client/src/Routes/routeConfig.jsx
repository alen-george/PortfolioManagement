import { lazy } from 'react';

const PortfolioPerformance = lazy(() => import('../Portfolio/pages/PortfolioPerformance'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
export const routes = [
  
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
