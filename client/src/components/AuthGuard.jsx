import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  // Check if user is authenticated
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    return null; // Don't render anything while redirecting
  }

  return children;
};

export default AuthGuard; 