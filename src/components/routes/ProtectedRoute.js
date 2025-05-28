// src/components/routes/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Using v6 syntax
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

const ProtectedRoute = () => {
  const auth = useAuth();

  if (auth.loading) {
    // You can return a loading spinner or null while auth state is loading
    return <div>Loading authentication...</div>; 
  }

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    // This is optional, good for UX. state={{ from: location }}
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renders the child route's element
};

export default ProtectedRoute;
