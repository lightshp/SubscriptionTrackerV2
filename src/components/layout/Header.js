// src/components/layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

const Header = () => {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
    // Navigation to /login will be handled by ProtectedRoute logic
  };

  return (
    <header style={{ 
      padding: '1rem', 
      backgroundColor: '#007bff', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        Subscription Tracker
      </Link>
      <nav>
        {auth.isAuthenticated && (
          <>
            <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>Dashboard</Link>
            <Link to="/settings" style={{ color: 'white', marginRight: '1rem' }}>Settings</Link> {/* Assuming /settings will be added */}
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>
              Logout
            </button>
          </>
        )}
        {!auth.isAuthenticated && (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
