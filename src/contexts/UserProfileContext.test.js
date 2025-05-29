// src/contexts/UserProfileContext.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import { UserProfileProvider, useUserProfile } from './UserProfileContext';

// Test component to consume UserProfileContext
const UserProfileTestConsumer = () => {
  const { preferences, updateLanguage, updateTheme, updateCurrency, updateTimezone } = useUserProfile();
  return (
    <div>
      <span data-testid="language">{preferences.language}</span>
      <span data-testid="theme">{preferences.theme}</span>
      <span data-testid="currency">{preferences.currency}</span>
      <span data-testid="timezone">{preferences.timezone}</span>
      <button onClick={() => updateLanguage('fr')}>Set Language French</button>
      <button onClick={() => updateTheme('dark')}>Set Theme Dark</button>
      <button onClick={() => updateCurrency('EUR')}>Set Currency EUR</button>
      <button onClick={() => updateTimezone('America/New_York')}>Set Timezone EST</button>
    </div>
  );
};

describe('UserProfileContext', () => {
  it('should provide default preferences', () => {
    let getByTestId;
    act(() => {
      const { getByTestId: rGetByTestId } = render(
        <UserProfileProvider>
          <UserProfileTestConsumer />
        </UserProfileProvider>
      );
      getByTestId = rGetByTestId;
    });
    
    expect(getByTestId('language').textContent).toBe('en');
    expect(getByTestId('theme').textContent).toBe('light');
    expect(getByTestId('currency').textContent).toBe('USD');
    expect(getByTestId('timezone').textContent).toBe('UTC');
  });

  it('updateLanguage should update the language preference', () => {
    let getByTestId, getByText;
    act(() => {
      const { getByTestId: rGetByTestId, getByText: rGetByText } = render(
        <UserProfileProvider>
          <UserProfileTestConsumer />
        </UserProfileProvider>
      );
      getByTestId = rGetByTestId;
      getByText = rGetByText;
    });

    act(() => {
      getByText('Set Language French').click();
    });
    expect(getByTestId('language').textContent).toBe('fr');
  });

  it('updateTheme should update the theme preference', () => {
    let getByTestId, getByText;
    act(() => {
      const { getByTestId: rGetByTestId, getByText: rGetByText } = render(
        <UserProfileProvider>
          <UserProfileTestConsumer />
        </UserProfileProvider>
      );
      getByTestId = rGetByTestId;
      getByText = rGetByText;
    });
    
    act(() => {
      getByText('Set Theme Dark').click();
    });
    expect(getByTestId('theme').textContent).toBe('dark');
  });

  it('updateCurrency should update the currency preference', () => {
    let getByTestId, getByText;
    act(() => {
      const { getByTestId: rGetByTestId, getByText: rGetByText } = render(
        <UserProfileProvider>
          <UserProfileTestConsumer />
        </UserProfileProvider>
      );
      getByTestId = rGetByTestId;
      getByText = rGetByText;
    });

    act(() => {
      getByText('Set Currency EUR').click();
    });
    expect(getByTestId('currency').textContent).toBe('EUR');
  });

  it('updateTimezone should update the timezone preference', () => {
    let getByTestId, getByText;
    act(() => {
      const { getByTestId: rGetByTestId, getByText: rGetByText } = render(
        <UserProfileProvider>
          <UserProfileTestConsumer />
        </UserProfileProvider>
      );
      getByTestId = rGetByTestId;
      getByText = rGetByText;
    });

    act(() => {
      getByText('Set Timezone EST').click();
    });
    expect(getByTestId('timezone').textContent).toBe('America/New_York');
  });
});
