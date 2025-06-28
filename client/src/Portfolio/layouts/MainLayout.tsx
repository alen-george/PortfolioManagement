import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Portfolio Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/portfolio/performance">
              Portfolio Performance
            </Button>
            <Button color="inherit" component={Link} to="/holdings">
              Portfolio Holdings
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
};

export default MainLayout;
