import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  // Check authentication on mount
  React.useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render anything if not authenticated (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthGuard; 