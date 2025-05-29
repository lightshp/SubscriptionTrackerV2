// src/components/auth/RegisterForm.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from './RegisterForm';
// No need to import AuthProvider if useAuth is mocked via jest.mock

// Mock AuthContext
const mockRegister = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
    currentUser: null,
    isAuthenticated: false,
    loading: false,
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'email_label': 'Email',
        'password_label': 'Password',
        'register_button': 'Register',
        'registration_failed_error': 'Registration failed',
        'password_requirements_error': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      };
      return translations[key] || key;
    },
  }),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockClear();
  });

  const renderRegisterForm = () => {
    return render(<RegisterForm />);
  };

  it('should render email and password fields and a register button', () => {
    renderRegisterForm();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields on submit', async () => {
    renderRegisterForm();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should display validation error for invalid email format', async () => {
    renderRegisterForm();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should display validation error for password not meeting requirements', async () => {
    renderRegisterForm();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } }); // Invalid password
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    // The actual message comes from Yup via the component
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    // If you also want to check for the complex regex message, provide a password that fails that specifically
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weakpassword' } }); 
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByText('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should call auth.register with form values on successful validation', async () => {
    mockRegister.mockResolvedValueOnce({ success: true, user: { email: 'test@example.com' } });
    renderRegisterForm();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'ValidPass123!');
    });
    // Check for success message (e.g., alert was called)
    // The component uses alert(), which is harder to test without mocking window.alert.
  });

  it('should display a general error message if registration fails', async () => {
    const errorMessage = 'Email already exists';
    mockRegister.mockRejectedValueOnce({ message: errorMessage });
    renderRegisterForm();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'ValidPass123!');
    });
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
