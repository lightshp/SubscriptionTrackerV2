// src/pages/DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // To link to AddSubscriptionPage
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import { useSubscription } from '../contexts/SubscriptionContext'; // Adjust path if needed
import { useTranslation } from 'react-i18next'; // Import useTranslation

const DashboardPage = () => {
  const { t } = useTranslation(); // Initialize hook
  const auth = useAuth();
  const { subscriptions, getSubscriptions } = useSubscription();

  // Call getSubscriptions if it's meant to fetch or if subscriptions isn't directly the array
  // For this example, we'll assume 'subscriptions' from context is the array we need.
  // If getSubscriptions() is the way to get the array:
  // const currentSubscriptions = getSubscriptions();
  const currentSubscriptions = subscriptions; // Direct use if context provides the array

  const handleLogout = async () => {
    try {
      await auth.logout();
      // Navigation to /login will happen automatically due to ProtectedRoute logic
      console.log('Logout successful from dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  return (
    <div>
      <div style={headerStyle}>
        <h2>{t('dashboard_title')}</h2>
        <Link to="/add-subscription">
          <button style={{ padding: '10px 15px', cursor: 'pointer' }}>
            {t('add_subscription_button')}
          </button>
        </Link>
      </div>
      <p>{t('welcome')}, {auth.currentUser?.email}!</p> {/* Also translate welcome message */}
      
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>{t('logout_button')}</button>

      <h3>{t('your_subscriptions_title', 'Your Subscriptions:')}</h3> {/* Add key if you want this translatable */}
      {currentSubscriptions && currentSubscriptions.length > 0 ? (
        <div>
          {currentSubscriptions.map(sub => (
            <div key={sub.id} style={cardStyle}>
              <h4 style={{ marginTop: 0, marginBottom: '10px' }}>{sub.serviceName}</h4>
              {/* Consider making "Cost", "Next Payment", "Status" translatable if needed */}
              <p style={{ marginBottom: '5px' }}>{t('cost_label', 'Cost')}: {sub.cost} {sub.currency}</p>
              <p style={{ marginBottom: '5px' }}>{t('next_payment_label', 'Next Payment')}: {sub.nextPaymentDate}</p>
              <p style={{ marginBottom: 0 }}>{t('status_label', 'Status')}: {sub.isActive ? t('status_active', 'Active') : t('status_inactive', 'Inactive')}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('no_subscriptions_yet', 'No subscriptions yet.')} <Link to="/add-subscription">{t('add_first_one_link', 'Add your first one!')}</Link></p>
      )}
      
      {/* Placeholder for future dashboard content like summary cards and charts */}
      {/* 
      <div style={{ marginTop: '30px' }}>
        <h3>Summary</h3>
        <p>Total Monthly Cost: ...</p>
        <p>Active Subscriptions: ...</p>
      </div>
      */}
    </div>
  );
};

export default DashboardPage;
