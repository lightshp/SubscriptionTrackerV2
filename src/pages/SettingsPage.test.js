// src/pages/SettingsPage.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from './SettingsPage';
import { UserProfileProvider, useUserProfile } from '../contexts/UserProfileContext'; // Import real provider and hook

// Mock the UserProfileContext for granular control if needed,
// or use the real provider and spy on its functions.
// For this component, using the real provider and checking effects is often easier.

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simple pass-through mock
  }),
}));

// Helper to render SettingsPage within UserProfileProvider
const renderSettingsPage = () => {
  return render(
    <UserProfileProvider>
      <SettingsPage />
    </UserProfileProvider>
  );
};

describe('SettingsPage', () => {
  it('should render all preference controls with default values from UserProfileContext', () => {
    renderSettingsPage();

    // Check that labels and select elements are rendered
    // Values are based on UserProfileContext defaults
    expect(screen.getByLabelText('Language:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('English')).toBeInTheDocument(); // Default 'en'

    expect(screen.getByLabelText('Theme:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Light')).toBeInTheDocument(); // Default 'light'

    expect(screen.getByLabelText('Default Currency:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('USD - US Dollar')).toBeInTheDocument(); // Default 'USD'

    expect(screen.getByLabelText('Timezone:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('UTC')).toBeInTheDocument(); // Default 'UTC'
  });

  it('should update language preference when language select is changed', () => {
    renderSettingsPage();
    const languageSelect = screen.getByLabelText('Language:');
    
    fireEvent.change(languageSelect, { target: { value: 'fr' } });
    expect(screen.getByDisplayValue('French')).toBeInTheDocument();
    // Verify context was called if we were spying, or check effect if other components depended on it.
    // For now, checking the select's display value is primary.
  });

  it('should update theme preference when theme select is changed', () => {
    renderSettingsPage();
    const themeSelect = screen.getByLabelText('Theme:');

    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    expect(screen.getByDisplayValue('Dark')).toBeInTheDocument();
  });

  it('should update currency preference when currency select is changed', () => {
    renderSettingsPage();
    const currencySelect = screen.getByLabelText('Default Currency:');

    fireEvent.change(currencySelect, { target: { value: 'EUR' } });
    expect(screen.getByDisplayValue('EUR - Euro')).toBeInTheDocument();
  });

  it('should update timezone preference when timezone select is changed', () => {
    renderSettingsPage();
    const timezoneSelect = screen.getByLabelText('Timezone:');

    fireEvent.change(timezoneSelect, { target: { value: 'America/New_York' } });
    expect(screen.getByDisplayValue('America/New_York (EST)')).toBeInTheDocument();
  });

  it('should display loading message if preferences are not available (hypothetical)', () => {
    // This test requires manually mocking useUserProfile to return undefined preferences
    // We need to ensure this path is correct for the module.
    // The actual module is '../contexts/UserProfileContext.js' relative to 'src/pages/SettingsPage.js'
    // but for jest.spyOn, we need the path relative to the test file itself if it's directly importing.
    // However, since SettingsPage imports useUserProfile, we spy on the module it imports.
    const userProfileContextModule = require('../contexts/UserProfileContext');
    const originalUseUserProfile = userProfileContextModule.useUserProfile; // Store original

    jest.spyOn(userProfileContextModule, 'useUserProfile').mockImplementationOnce(() => ({
        preferences: null, // Simulate preferences not being loaded
        updateLanguage: jest.fn(),
        updateTheme: jest.fn(),
        updateCurrency: jest.fn(),
        updateTimezone: jest.fn(),
    }));

    render( // Render without the full provider to use the above direct mock
        <SettingsPage />
    );
    expect(screen.getByText('Loading user preferences...')).toBeInTheDocument();
    
    // Restore the original implementation for other tests
    userProfileContextModule.useUserProfile = originalUseUserProfile; // Restore directly
    // Or use jest.restoreAllMocks(); if this is the only spy/mock in the suite that needs resetting this way.
    // jest.restoreAllMocks(); // This might be too broad if other spies are set up at describe level.
  });
});
