// src/components/layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation(); // Destructure i18n instance
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
        {t('app_title', 'Subscription Tracker')}
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}> {/* Wrapper for nav and lang switcher */}
        <nav style={{ marginRight: '20px' }}> {/* Added margin to separate nav from lang switcher */}
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
        <div> {/* Language Switcher */}
          <button 
            onClick={() => changeLanguage('en')} 
            disabled={i18n.language === 'en'} 
            style={{ background: i18n.language === 'en' ? '#0056b3' : 'none', border: '1px solid white', color: 'white', cursor: 'pointer', marginRight: '5px', padding: '5px 10px' }}
          >
            EN
          </button>
          <button 
            onClick={() => changeLanguage('fr')} 
            disabled={i18n.language === 'fr'}
            style={{ background: i18n.language === 'fr' ? '#0056b3' : 'none', border: '1px solid white', color: 'white', cursor: 'pointer', padding: '5px 10px' }}
          >
            FR
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
