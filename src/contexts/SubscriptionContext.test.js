// src/contexts/SubscriptionContext.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import { SubscriptionProvider, useSubscription } from './SubscriptionContext';

// Test component to consume SubscriptionContext
const SubscriptionTestConsumer = () => {
  const { subscriptions, getSubscriptions, addSubscription, deleteSubscription, updateSubscription } = useSubscription();
  
  // Using getSubscriptions() for this example, assuming it's the intended way to fetch current list
  // or directly use 'subscriptions' if it's always up-to-date live state.
  // The current SubscriptionContext directly exposes 'subscriptions' as live state.
  const currentSubs = subscriptions; 

  return (
    <div>
      <div data-testid="count">{currentSubs.length}</div>
      <ul>
        {currentSubs.map(sub => (
          <li key={sub.id}>{sub.serviceName} - {sub.cost}</li>
        ))}
      </ul>
      <button onClick={() => addSubscription({ serviceName: 'New Service', cost: 10.99, currency: 'USD', billingFrequency: 'Monthly', category: 'Other', startDate: '2024-01-01', nextPaymentDate: '2024-02-01', isActive: true })}>Add</button>
      {/* For delete and update, we'd typically need an ID from an existing subscription */}
      {currentSubs.length > 0 && (
        <>
          <button onClick={() => deleteSubscription(currentSubs[0].id)}>Delete First</button>
          <button onClick={() => updateSubscription(currentSubs[0].id, { ...currentSubs[0], cost: 99.99 })}>Update First Cost</button>
        </>
      )}
    </div>
  );
};

const initialSampleCount = 3; // Based on the sample data in SubscriptionContext

describe('SubscriptionContext', () => {
  it('should provide initial subscriptions', () => {
    let getByTestId;
    act(() => {
      const { getByTestId: rGetByTestId } = render(
        <SubscriptionProvider>
          <SubscriptionTestConsumer />
        </SubscriptionProvider>
      );
      getByTestId = rGetByTestId;
    });
    expect(getByTestId('count').textContent).toBe(String(initialSampleCount));
  });

  it('addSubscription should add a new subscription', () => {
    let getByTestId, getByText;
    act(() => {
      const { getByTestId: rGetByTestId, getByText: rGetByText } = render(
        <SubscriptionProvider>
          <SubscriptionTestConsumer />
        </SubscriptionProvider>
      );
      getByTestId = rGetByTestId;
      getByText = rGetByText;
    });

    act(() => {
      getByText('Add').click();
    });
    expect(getByTestId('count').textContent).toBe(String(initialSampleCount + 1));
  });

  it('deleteSubscription should remove a subscription', () => {
    let getByTestId, getByText;
    act(() => {
      const { getByTestId: rGetByTestId, getByText: rGetByText } = render(
        <SubscriptionProvider>
          <SubscriptionTestConsumer />
        </SubscriptionProvider>
      );
      getByTestId = rGetByTestId;
      getByText = rGetByText;
    });

    act(() => {
      // Ensure there's a subscription to delete by first adding one if initialSampleCount is 0, or just proceed
      if (initialSampleCount === 0) {
        getByText('Add').click(); // Add one if none exist
        expect(getByTestId('count').textContent).toBe('1');
      }
      getByText('Delete First').click();
    });
    expect(getByTestId('count').textContent).toBe(String(initialSampleCount > 0 ? initialSampleCount - 1 : 0));
  });

  it('updateSubscription should modify an existing subscription', () => {
    let queryByText, getByText; // Using queryByText for potentially changing text
    act(() => {
      const { queryByText: rQueryByText, getByText: rGetByText } = render(
        <SubscriptionProvider>
          <SubscriptionTestConsumer />
        </SubscriptionProvider>
      );
      queryByText = rQueryByText;
      getByText = rGetByText;
    });

    const initialFirstSubServiceName = 'Netflix Premium'; // From sample data
    const updatedCost = 99.99;

    // Check initial state of the first item (assuming it exists)
    if (initialSampleCount > 0) {
      expect(queryByText(`${initialFirstSubServiceName} - 19.99`)).toBeInTheDocument();
    } else {
      // If no initial samples, add one to test update
      act(() => { getByText('Add').click(); });
      // This new item won't match 'Netflix Premium - 19.99', adjust test logic or ensure sample data
      // For simplicity, this test relies on initialSampleCount > 0
    }
    
    act(() => {
      getByText('Update First Cost').click();
    });
    
    if (initialSampleCount > 0) {
      expect(queryByText(`${initialFirstSubServiceName} - ${updatedCost}`)).toBeInTheDocument();
      expect(queryByText(`${initialFirstSubServiceName} - 19.99`)).not.toBeInTheDocument();
    }
  });

  it('getSubscriptions should return the current list of subscriptions', () => {
    // This test is somewhat trivial if 'subscriptions' is directly used and accurate.
    // It's more relevant if getSubscriptions involved more logic (e.g., selector, API call)
    let contextValue;
    const TestDirectConsumer = () => {
      contextValue = useSubscription(); // Grab the whole context value
      return null;
    };
    render(
      <SubscriptionProvider>
        <TestDirectConsumer />
      </SubscriptionProvider>
    );
    
    expect(contextValue.getSubscriptions()).toEqual(contextValue.subscriptions);
    expect(contextValue.getSubscriptions().length).toBe(initialSampleCount);

    // Test after adding a subscription
    act(() => {
      contextValue.addSubscription({ serviceName: 'Test Service', cost: 1.00, currency: 'USD', billingFrequency: 'Monthly', category: 'Other', startDate: '2024-01-01', nextPaymentDate: '2024-02-01', isActive: true });
    });
    expect(contextValue.getSubscriptions().length).toBe(initialSampleCount + 1);
  });
});
