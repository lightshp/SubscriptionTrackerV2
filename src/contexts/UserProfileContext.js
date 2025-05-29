// src/contexts/UserProfileContext.js
import React, { createContext, useState, useContext } from 'react';

const UserProfileContext = createContext(null);

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    language: 'en', // Default language
    theme: 'light',   // Default theme
    currency: 'USD',  // Default currency
    timezone: 'UTC',  // Default timezone
  });

  const updateLanguage = (newLanguage) => {
    setPreferences(prev => ({ ...prev, language: newLanguage }));
    console.log('UserProfileContext: Language updated to', newLanguage); // For debugging
  };

  const updateTheme = (newTheme) => {
    setPreferences(prev => ({ ...prev, theme: newTheme }));
    console.log('UserProfileContext: Theme updated to', newTheme); // For debugging
  };

  const updateCurrency = (newCurrency) => {
    setPreferences(prev => ({ ...prev, currency: newCurrency }));
    console.log('UserProfileContext: Currency updated to', newCurrency); // For debugging
  };

  const updateTimezone = (newTimezone) => {
    setPreferences(prev => ({ ...prev, timezone: newTimezone }));
    console.log('UserProfileContext: Timezone updated to', newTimezone); // For debugging
  };

  // In a real app, you might have a function to load preferences from a backend/localStorage
  // useEffect(() => {
  //   // const loadedPreferences = loadPreferences(); // e.g., from localStorage
  //   // if (loadedPreferences) setPreferences(loadedPreferences);
  // }, []);

  const value = {
    preferences,
    updateLanguage,
    updateTheme,
    updateCurrency,
    updateTimezone,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
