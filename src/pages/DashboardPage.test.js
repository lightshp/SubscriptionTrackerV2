// src/pages/DashboardPage.test.js
import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Needed because DashboardPage uses <Link>
import DashboardPage from './DashboardPage';

// Mock AuthContext
const mockLogout = jest.fn();
const mockCurrentUser = { email: 'testuser@example.com' };
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: mockCurrentUser,
    logout: mockLogout,
    isAuthenticated: true, // Assuming user must be authenticated to see dashboard
    loading: false,
  }),
}));

// Mock SubscriptionContext
const mockSubscriptions = [
  { id: '1', serviceName: 'Netflix', cost: 15.99, currency: 'USD', nextPaymentDate: '2024-08-01', isActive: true },
  { id: '2', serviceName: 'Spotify', cost: 9.99, currency: 'USD', nextPaymentDate: '2024-08-15', isActive: false },
];
const mockGetSubscriptions = jest.fn(() => mockSubscriptions); // If getSubscriptions is used
jest.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    subscriptions: mockSubscriptions, // Direct access to array
    getSubscriptions: mockGetSubscriptions, // If component calls this
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        'dashboard_title': 'Dashboard',
        'add_subscription_button': '+ Add Subscription',
        'logout_button': 'Logout',
        'welcome_message': `Welcome, ${mockCurrentUser.email}!`, // Simple interpolation for test
        'your_subscriptions_title': 'Your Subscriptions:',
        'no_subscriptions_message': 'No subscriptions yet.', // Corrected key for test
        'add_first_subscription_link': 'Add your first one!', // Corrected key
        'cost_label_short': 'Cost:', // For card details
        'next_payment_label_short': 'Next Payment:', // For card details
        'status_label_short': 'Status:', // For card details
        'status_active': 'Active',
        'status_inactive': 'Inactive',
      };
      // Handling keys that might be used by the component with default values in the t() function
      if (key === 'welcome') return 'Welcome'; // From DashboardPage: t('welcome')
      if (key === 'your_subscriptions_title') return translations['your_subscriptions_title'];
      if (key === 'no_subscriptions_yet') return translations['no_subscriptions_message'];
      if (key === 'add_first_one_link') return translations['add_first_subscription_link'];
      if (key === 'cost_label') return translations['cost_label_short'];
      if (key === 'next_payment_label') return translations['next_payment_label_short'];
      if (key === 'status_label') return translations['status_label_short'];

      return translations[key] || key;
    },
  }),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockGetSubscriptions.mockClear();
    // Resetting the specific mock for useSubscription to its default for each test
    // This is important if one test (like the empty state one) modifies it.
    const subscriptionContextModule = require('../../contexts/SubscriptionContext');
    jest.spyOn(subscriptionContextModule, 'useSubscription').mockImplementation(() => ({
        subscriptions: mockSubscriptions,
        getSubscriptions: mockGetSubscriptions,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up spies after each test
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter> {/* Required for <Link> component */}
        <DashboardPage />
      </MemoryRouter>
    );
  };

  it('should render user email, titles, and logout button', () => {
    renderDashboard();
    // The component uses t('welcome') and passes user email, so we check for "Welcome"
    // and then separately for the email if needed, or trust t() mock to handle it.
    // For this test, we'll check the exact string.
    expect(screen.getByText(`Welcome, ${mockCurrentUser.email}!`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add Subscription' })).toBeInTheDocument();
    expect(screen.getByText('Your Subscriptions:')).toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', () => {
    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should display list of subscriptions', () => {
    renderDashboard();
    // Assuming each subscription card has a distinguishing feature, like its own heading for serviceName
    // The provided code uses a div with specific style.
    const subscriptionCards = screen.getAllByText(text => text.startsWith('Cost:')).map(el => el.closest('div[style*="border: 1px solid #ccc"]'));
    expect(subscriptionCards.length).toBe(mockSubscriptions.length);

    mockSubscriptions.forEach(sub => {
      const subCard = screen.getByText(sub.serviceName).closest('div[style*="border: 1px solid #ccc"]');
      expect(within(subCard).getByText(sub.serviceName)).toBeInTheDocument();
      expect(within(subCard).getByText(`Cost: ${sub.cost} ${sub.currency}`)).toBeInTheDocument();
      expect(within(subCard).getByText(`Next Payment: ${sub.nextPaymentDate}`)).toBeInTheDocument();
      const expectedStatus = sub.isActive ? 'Active' : 'Inactive';
      expect(within(subCard).getByText(`Status: ${expectedStatus}`)).toBeInTheDocument();
    });
  });

  it('should display "no subscriptions" message if subscriptions array is empty', () => {
    // Override mock for this specific test
    const subscriptionContextModule = require('../../contexts/SubscriptionContext');
    jest.spyOn(subscriptionContextModule, 'useSubscription').mockImplementationOnce(() => ({
      subscriptions: [],
      getSubscriptions: () => [],
    }));

    renderDashboard();
    expect(screen.getByText('No subscriptions yet.')).toBeInTheDocument();
    expect(screen.getByText('Add your first one!')).toBeInTheDocument(); // Link text
    
    // Check that no subscription cards are rendered.
    // A robust way is to query for a common element within the cards.
    expect(screen.queryAllByText(text => text.startsWith('Cost:')).length).toBe(0);
  });
  
  it('Add Subscription button should be a link to /add-subscription', () => {
    renderDashboard();
    const addButton = screen.getByRole('button', { name: '+ Add Subscription' });
    expect(addButton.closest('a')).toHaveAttribute('href', '/add-subscription');
  });
});
