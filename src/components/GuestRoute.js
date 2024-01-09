import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />; // Redirect to the dashboard or another appropriate route
  }

  return children;
};

export default GuestRoute;
