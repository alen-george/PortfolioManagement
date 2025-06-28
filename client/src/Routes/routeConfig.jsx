import { lazy } from 'react';

const PortfolioPerformance = lazy(() => import('../Portfolio/pages/PortfolioPerformance'));

export const routes = [
  {
    path: '/portfolio/performance',
    element: <PortfolioPerformance />,
    layout: 'main'
  }
];
