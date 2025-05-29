// src/components/layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Header = () => {
  const { t } = useTranslation(); // Initialize hook
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
        {t('app_title', 'Subscription Tracker')} {/* App title might also be a translation key */}
      </Link>
      <nav>
        {auth.isAuthenticated && (
          <>
            <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>{t('dashboard_title')}</Link>
            <Link to="/settings" style={{ color: 'white', marginRight: '1rem' }}>{t('settings_title')}</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>
              {t('logout_button')}
            </button>
          </>
        )}
        {!auth.isAuthenticated && (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>{t('login_button')}</Link>
            <Link to="/register" style={{ color: 'white' }}>{t('register_button')}</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
