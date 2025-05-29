// src/contexts/SubscriptionContext.js
import React, { createContext, useState, useContext } from 'react';

/**
 * Subscription Object Structure:
 * {
 *   id: string, // Unique identifier (e.g., UUID or timestamp)
 *   serviceName: string, // e.g., "Netflix", "Spotify" (Required)
 *   cost: number, // Cost amount (e.g., 10.99) (Required, decimal)
 *   currency: string, // e.g., "USD", "EUR" (Dropdown)
 *   billingFrequency: 'Monthly' | 'Yearly' | 'Quarterly' | 'Custom', // (Dropdown)
 *   customFrequencyDays: number | null, // Only if billingFrequency is 'Custom' (e.g., 45 for every 45 days)
 *   category: 'Streaming' | 'Software' | 'Fitness' | 'Finance' | 'Shopping' | 'Other', // (Dropdown)
 *   startDate: string, // ISO date string (e.g., "2024-01-15")
 *   nextPaymentDate: string, // ISO date string (auto-calculated)
 *   paymentMethod: string | null, // e.g., "Visa **** 1234" (Optional)
 *   notes: string | null, // User notes (Optional)
 *   isActive: boolean // true if active, false if inactive/cancelled
 * }
 */

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

// Sample data for initial state
const initialSubscriptions = [
  {
    id: '1',
    serviceName: 'Netflix Premium',
    cost: 19.99,
    currency: 'USD',
    billingFrequency: 'Monthly',
    customFrequencyDays: null,
    category: 'Streaming',
    startDate: '2023-05-01',
    nextPaymentDate: '2024-08-01', // Example, will need calculation logic
    paymentMethod: 'PayPal',
    notes: 'Shared with family',
    isActive: true,
  },
  {
    id: '2',
    serviceName: 'Spotify Family',
    cost: 16.99,
    currency: 'USD',
    billingFrequency: 'Monthly',
    customFrequencyDays: null,
    category: 'Streaming',
    startDate: '2023-01-10',
    nextPaymentDate: '2024-08-10', // Example
    paymentMethod: 'Visa **** 4321',
    notes: '',
    isActive: true,
  },
  {
    id: '3',
    serviceName: 'Adobe Creative Cloud',
    cost: 599.88,
    currency: 'USD',
    billingFrequency: 'Yearly',
    customFrequencyDays: null,
    category: 'Software',
    startDate: '2024-02-15',
    nextPaymentDate: '2025-02-15', // Example
    paymentMethod: 'Amex **** 5678',
    notes: 'All apps bundle for work.',
    isActive: true,
  },
];

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

  const getSubscriptions = () => {
    // In a real app, this might fetch from an API or localStorage
    return subscriptions;
  };

  const addSubscription = (subscriptionData) => {
    const newSubscription = {
      ...subscriptionData,
      id: Date.now().toString(), // Simple ID generation for mock
      // nextPaymentDate: calculateNextPaymentDate(subscriptionData.startDate, subscriptionData.billingFrequency, subscriptionData.customFrequencyDays), // Actual calculation needed
      isActive: true, // Default to active
    };
    setSubscriptions(prevSubs => [...prevSubs, newSubscription]);
    console.log('SubscriptionContext: Added subscription', newSubscription);
    // In a real app, save to backend/localStorage
  };

  const deleteSubscription = (subscriptionId) => {
    setSubscriptions(prevSubs => prevSubs.filter(sub => sub.id !== subscriptionId));
    console.log('SubscriptionContext: Deleted subscription with ID', subscriptionId);
    // In a real app, update backend/localStorage
  };

  const updateSubscription = (subscriptionId, updatedData) => {
    setSubscriptions(prevSubs =>
      prevSubs.map(sub => (sub.id === subscriptionId ? { ...sub, ...updatedData } : sub))
    );
    console.log('SubscriptionContext: Updated subscription with ID', subscriptionId, 'Data:', updatedData);
    // In a real app, update backend/localStorage
  };

  const value = {
    subscriptions, // Provide the raw list
    getSubscriptions, // Function to get (could be enhanced later)
    addSubscription,
    deleteSubscription,
    updateSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
