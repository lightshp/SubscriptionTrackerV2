// src/pages/SettingsPage.js
import React from 'react';
import { useUserProfile } from '../contexts/UserProfileContext'; // Adjust path if needed
import { useTranslation } from 'react-i18next'; // Import useTranslation

const SettingsPage = () => {
  const { t } = useTranslation(); // Initialize hook
  const { preferences, updateLanguage, updateTheme, updateCurrency, updateTimezone } = useUserProfile();

  if (!preferences) {
    return <div>{t('loading_preferences', 'Loading user preferences...')}</div>;
  }

  const handleLanguageChange = (event) => {
    updateLanguage(event.target.value);
  };

  const handleThemeChange = (event) => {
    updateTheme(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    updateCurrency(event.target.value);
  };

  const handleTimezoneChange = (event) => {
    updateTimezone(event.target.value);
  };

  const commonSelectStyle = {
    padding: '8px',
    margin: '5px 0 15px 0',
    display: 'block',
    width: '200px', // Adjust as needed
  };

  const commonLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  return (
    <div>
      <h2>{t('settings_page_title')}</h2>
      <p>{t('settings_page_description')}</p>

      <div>
        <label htmlFor="language-select" style={commonLabelStyle}>{t('language_label')}</label>
        <select 
          id="language-select" 
          value={preferences.language} 
          onChange={handleLanguageChange}
          style={commonSelectStyle}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          {/* Add other languages as needed */}
        </select>
      </div>

      <div>
        <label htmlFor="theme-select" style={commonLabelStyle}>{t('theme_label')}</label>
        <select 
          id="theme-select" 
          value={preferences.theme} 
          onChange={handleThemeChange}
          style={commonSelectStyle}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label htmlFor="currency-select" style={commonLabelStyle}>{t('default_currency_label')}</label>
        <select 
          id="currency-select" 
          value={preferences.currency} 
          onChange={handleCurrencyChange}
          style={commonSelectStyle}
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="GBP">GBP - British Pound</option>
          {/* Add other currencies as needed */}
        </select>
      </div>

      <div>
        <label htmlFor="timezone-select" style={commonLabelStyle}>{t('timezone_label')}</label>
        <select 
          id="timezone-select" 
          value={preferences.timezone} 
          onChange={handleTimezoneChange}
          style={commonSelectStyle}
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York (EST)</option>
          <option value="America/Chicago">America/Chicago (CST)</option>
          <option value="America/Denver">America/Denver (MST)</option>
          <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
          <option value="Europe/London">Europe/London (GMT/BST)</option>
          <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
          {/* Add other timezones as needed */}
        </select>
      </div>
    </div>
  );
};

export default SettingsPage;
