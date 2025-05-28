// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService'; // Verify path

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial check

  useEffect(() => {
    // Check for existing user on initial load
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed in context:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await authService.register(email, password);
      // Optionally log in the user directly after registration
      // For now, let's require them to login separately
      // If direct login:
      // const loginResponse = await authService.login(email, password);
      // setCurrentUser(loginResponse.user);
      return response;
    } catch (error) {
      console.error('Registration failed in context:', error);
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading // Exposed for components that might need to wait for auth check
  };

  // Don't render children until loading is false to prevent flicker or premature route checks
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
