// src/components/auth/LoginForm.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()
import { AuthProvider, useAuth } from '../../contexts/AuthContext'; // Real AuthContext to get useAuth
import LoginForm from './LoginForm';

// Mock the AuthContext specifically for this component's tests
const mockLogin = jest.fn();
// const mockUseAuth = useAuth; // Keep a reference to the original // Not needed with module mock

// Custom provider that gives a controlled mock value for useAuth
// This approach is less ideal than module mocking for useAuth directly imported by LoginForm
// const MockAuthProvider = ({ children, authValues }) => {
//   jest.spyOn(global, 'useAuth').mockImplementation(() => ({ 
//       login: mockLogin,
//       currentUser: null, 
//       isAuthenticated: false,
//       loading: false,
//   }));
//   return <AuthProvider>{children}</AuthProvider>; 
// };


// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      // Simple mock for t function - return key or a predefined translation
      const translations = {
        'email_label': 'Email',
        'password_label': 'Password',
        'login_button': 'Login',
        'login_failed_error': 'Login failed',
        // Add other keys used in LoginForm if any
      };
      return translations[key] || key;
    },
  }),
}));

// Mock AuthContext by mocking the module
// This is the preferred way if LoginForm directly imports and uses useAuth
jest.mock('../../contexts/AuthContext', () => {
    const originalModule = jest.requireActual('../../contexts/AuthContext');
    return {
        ...originalModule, // Spread original exports like AuthProvider if needed by other parts
        useAuth: jest.fn(() => ({ // Override useAuth
            login: mockLogin,
            currentUser: null,
            isAuthenticated: false,
            loading: false,
            // any other properties/functions LoginForm might expect from useAuth
        })),
    };
});


describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    // If useAuth mock was set up per test, reset it here.
    // With module mock, jest.clearAllMocks() or specific mockClear on useAuth might be used if needed.
    // For this setup, useAuth() is freshly called and mocked for each render due to module mock.
    // We might need to clear the mock on useAuth itself if it retains state across tests in some setups.
    // e.g. if useAuth was not a direct import but a re-exported variable from the module.
    // However, as it's a function returning an object, it should be fine.
    // Clear the mock returned by useAuth if necessary, or useAuth.mockClear()
    // For this specific mock structure:
    const mockedUseAuth = useAuth; // This now refers to jest.fn() from the mock
    mockedUseAuth.mockImplementation(() => ({ // Re-assign implementation if needed for specific test setups
        login: mockLogin,
        currentUser: null,
        isAuthenticated: false,
        loading: false,
    }));
  });

  const renderLoginForm = () => {
    // Wrap with AuthProvider only if LoginForm or its children expect a real AuthProvider context
    // If useAuth is fully mocked, AuthProvider might not be strictly necessary for LoginForm itself
    // but good practice if there's any doubt or deeper context dependencies.
    return render(
        <AuthProvider> 
             <LoginForm />
        </AuthProvider>
    );
  };

  it('should render email and password fields and a login button', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields on submit', async () => {
    renderLoginForm();
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Yup validation is asynchronous
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should display validation error for invalid email format', async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call auth.login with form values on successful validation', async () => {
    mockLogin.mockResolvedValueOnce({ user: { email: 'test@example.com' } }); // Simulate successful login
    renderLoginForm();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    // The component uses alert(), which is hard to test without further mocking (e.g., window.alert).
    // For this test, confirming mockLogin was called is the primary goal.
  });

  it('should display a general error message if login fails', async () => {
    const errorMessage = 'Invalid credentials'; // This message comes from authService mock
    mockLogin.mockRejectedValueOnce({ message: errorMessage });
    renderLoginForm();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });
    // The LoginForm sets a form-level error using setErrors({ submit: ... })
    // The text "Login failed" is the default fallback from the t() mock if the specific error key isn't in the mock translations.
    // If 'login_failed_error' is correctly mapped to 'Login failed', it will find that.
    // The component's code is: setErrors({ submit: error.message || t('login_failed_error', 'Login failed') });
    // So it should display `errorMessage` if `error.message` is present.
    expect(await screen.findByText(errorMessage)).toBeInTheDocument(); 
  });
});
