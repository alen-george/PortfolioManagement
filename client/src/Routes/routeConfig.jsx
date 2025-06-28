import { lazy } from 'react';
import AuthGuard from '../components/AuthGuard';
import PublicRoute from '../components/PublicRoute';

const PortfolioPerformance = lazy(() => import('../Portfolio/pages/PortfolioPerformance'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

export const routes = [
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
    layout: null
  },
  {
    path: '/register',
    element: <PublicRoute><Register /></PublicRoute>,
    layout: null
  },
  {
    path: '/',
    element: <AuthGuard><LandingPage /></AuthGuard>,
    layout: 'main'
  },
  {
    path: '/portfolio/performance',
    element: <AuthGuard><PortfolioPerformance /></AuthGuard>,
    layout: 'main'
  }
];