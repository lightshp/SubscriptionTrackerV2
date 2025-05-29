// src/components/subscriptions/AddSubscriptionForm.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddSubscriptionForm from './AddSubscriptionForm';
// We will mock SubscriptionContext for this component test

// Mock SubscriptionContext
const mockAddSubscription = jest.fn();
jest.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    addSubscription: mockAddSubscription,
    // Add other properties/functions if AddSubscriptionForm uses them
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      // Simple mock for t function
      const translations = {
        'service_name_label': 'Service Name',
        'cost_label': 'Cost',
        'currency_label': 'Currency (e.g., USD)',
        'billing_frequency_label': 'Billing Frequency',
        'add_subscription_button': 'Add Subscription',
        'subscription_added_alert': 'Subscription added successfully!',
        'failed_to_add_subscription_alert': 'Failed to add subscription.',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock react-router-dom (if useNavigate is used and needs mocking)
// If useNavigate is not used or its usage doesn't affect these tests, this can be omitted.
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
//   useNavigate: () => jest.fn(), // mock useNavigate
// }));

describe('AddSubscriptionForm', () => {
  beforeEach(() => {
    mockAddSubscription.mockClear();
    // Mock window.alert if you want to test its calls
    global.alert = jest.fn(); 
  });

  afterEach(() => {
    // Restore alert if it was mocked
    // delete global.alert; // Or restore its original implementation if needed elsewhere
  });

  const renderForm = () => {
    return render(<AddSubscriptionForm />);
  };

  it('should render all form fields and submit button', () => {
    renderForm();
    expect(screen.getByLabelText('Service Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Cost')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency (e.g., USD)')).toBeInTheDocument();
    expect(screen.getByLabelText('Billing Frequency')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Subscription' })).toBeInTheDocument();
  });

  it('should display validation errors for required fields on submit', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Add Subscription' }));

    expect(await screen.findByText('Service name is required')).toBeInTheDocument();
    expect(await screen.findByText('Cost is required')).toBeInTheDocument();
    // Currency has a default, so it won't show 'required' unless cleared.
    // Billing Frequency has a default, so it won't show 'required'.
    expect(mockAddSubscription).not.toHaveBeenCalled();
  });

  it('should display validation error for non-positive cost', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Service Name'), { target: { value: 'Test Service' } });
    fireEvent.change(screen.getByLabelText('Cost'), { target: { value: '-5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Subscription' }));

    expect(await screen.findByText('Cost must be a positive number')).toBeInTheDocument();
    expect(mockAddSubscription).not.toHaveBeenCalled();
  });

  it('should call addSubscription with form data on valid submission', async () => {
    mockAddSubscription.mockResolvedValueOnce({}); // Simulate successful add
    renderForm();

    fireEvent.change(screen.getByLabelText('Service Name'), { target: { value: 'Netflix' } });
    fireEvent.change(screen.getByLabelText('Cost'), { target: { value: '15.99' } });
    fireEvent.change(screen.getByLabelText('Currency (e.g., USD)'), { target: { value: 'USD' } });
    fireEvent.select(screen.getByLabelText('Billing Frequency'), { target: { value: 'Monthly' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Add Subscription' }));

    await waitFor(() => {
      expect(mockAddSubscription).toHaveBeenCalledTimes(1);
      expect(mockAddSubscription).toHaveBeenCalledWith(expect.objectContaining({
        serviceName: 'Netflix',
        cost: 15.99, // Formik converts to number
        currency: 'USD',
        billingFrequency: 'Monthly',
        // Other fields are defaulted in the component's onSubmit
        category: 'Other',
        isActive: true,
      }));
    });
    expect(global.alert).toHaveBeenCalledWith('Subscription added successfully!');
  });

  it('should display alert if addSubscription fails', async () => {
    mockAddSubscription.mockRejectedValueOnce(new Error('Network error'));
    renderForm();

    fireEvent.change(screen.getByLabelText('Service Name'), { target: { value: 'Spotify' } });
    fireEvent.change(screen.getByLabelText('Cost'), { target: { value: '9.99' } });
    fireEvent.change(screen.getByLabelText('Currency (e.g., USD)'), { target: { value: 'USD' } });
    fireEvent.select(screen.getByLabelText('Billing Frequency'), { target: { value: 'Monthly' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add Subscription' }));

    await waitFor(() => {
      expect(mockAddSubscription).toHaveBeenCalledTimes(1);
    });
    expect(global.alert).toHaveBeenCalledWith('Failed to add subscription.');
  });
  
  it('should reset form after successful submission', async () => {
    mockAddSubscription.mockResolvedValueOnce({});
    renderForm();

    const serviceNameInput = screen.getByLabelText('Service Name');
    fireEvent.change(serviceNameInput, { target: { value: 'Netflix' } });
    fireEvent.change(screen.getByLabelText('Cost'), { target: { value: '15.99' } });
    // ... fill other fields

    fireEvent.click(screen.getByRole('button', { name: 'Add Subscription' }));

    await waitFor(() => {
      expect(mockAddSubscription).toHaveBeenCalledTimes(1);
    });
    expect(global.alert).toHaveBeenCalledWith('Subscription added successfully!');
    // Check if serviceName field is reset (Formik's resetForm)
    expect(serviceNameInput.value).toBe(''); 
  });
});
