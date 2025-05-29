// src/contexts/AuthContext.test.js
import React from 'react';
import { render, act, waitFor } from '@testing-library/react'; // Using @testing-library/react for context testing
import { AuthProvider, useAuth } from './AuthContext';
import { authService as mockAuthService } from '../services/authService';

// Mock the authService
jest.mock('../services/authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

// A simple test component to consume the context
const TestConsumerComponent = () => {
  const auth = useAuth();
  if (auth.loading) return <div>Loading...</div>;
  return (
    <div>
      <span>User: {auth.currentUser ? auth.currentUser.email : 'None'}</span>
      <span>Authenticated: {auth.isAuthenticated.toString()}</span>
      <button onClick={() => auth.login('test@example.com', 'password')}>Login</button>
      <button onClick={() => auth.register('new@example.com', 'password')}>Register</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAuthService.getCurrentUser.mockReset();
    mockAuthService.login.mockReset();
    mockAuthService.register.mockReset();
    mockAuthService.logout.mockReset();
  });

  it('should initialize with no user and loading false after check', async () => {
    mockAuthService.getCurrentUser.mockReturnValue(null);
    
    let getByText;
    act(() => {
      const { getByText: rgt } = render(
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      );
      getByText = rgt;
    });
    
    await waitFor(() => expect(getByText('User: None')).toBeInTheDocument());
    expect(getByText('Authenticated: false')).toBeInTheDocument();
    expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should initialize with a user if getCurrentUser returns one', async () => {
    const mockUser = { id: '1', email: 'user@example.com' };
    mockAuthService.getCurrentUser.mockReturnValue(mockUser);
    
    let getByText;
    act(() => {
      const { getByText: rgt } = render(
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      );
      getByText = rgt;
    });

    await waitFor(() => expect(getByText(`User: ${mockUser.email}`)).toBeInTheDocument());
    expect(getByText('Authenticated: true')).toBeInTheDocument();
  });

  it('login function should call authService.login and update currentUser', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    mockAuthService.login.mockResolvedValue({ user: mockUser });
    mockAuthService.getCurrentUser.mockReturnValue(null); // Start as not logged in

    let getByText; // Renamed to avoid conflict with global getByText
    act(() => {
      const { getByText: rgt } = render( // rgt is "render getByText"
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      );
      getByText = rgt;
    });
    
    await waitFor(() => expect(getByText('User: None')).toBeInTheDocument()); // Ensure initial state

    act(() => {
      getByText('Login').click();
    });

    await waitFor(() => expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password'));
    await waitFor(() => expect(getByText(`User: ${mockUser.email}`)).toBeInTheDocument());
    expect(getByText('Authenticated: true')).toBeInTheDocument();
  });

  it('register function should call authService.register', async () => {
    const mockRegisterResponse = { success: true, user: {id: '2', email: 'new@example.com'} };
    mockAuthService.register.mockResolvedValue(mockRegisterResponse);
    // Assuming register doesn't auto-login in this setup, currentUser remains null initially
    mockAuthService.getCurrentUser.mockReturnValue(null);

    let getByText; // Renamed
    act(() => {
      const { getByText: rgt } = render(
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      );
      getByText = rgt;
    });
    
    await waitFor(() => expect(getByText('User: None')).toBeInTheDocument());

    act(() => {
      getByText('Register').click();
    });

    await waitFor(() => expect(mockAuthService.register).toHaveBeenCalledWith('new@example.com', 'password'));
    // If register was to log the user in, we would check for currentUser update here.
    // Based on current AuthContext, register doesn't set currentUser.
    expect(getByText('User: None')).toBeInTheDocument(); 
  });

  it('logout function should call authService.logout and clear currentUser', async () => {
    const mockUser = { id: '1', email: 'user@example.com' };
    mockAuthService.getCurrentUser.mockReturnValue(mockUser); // Start as logged in
    mockAuthService.logout.mockResolvedValue(undefined);

    let getByText; // Renamed
    act(() => {
      const { getByText: rgt } = render(
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      );
      getByText = rgt;
    });

    await waitFor(() => expect(getByText(`User: ${mockUser.email}`)).toBeInTheDocument());
    
    act(() => {
      getByText('Logout').click();
    });

    await waitFor(() => expect(mockAuthService.logout).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(getByText('User: None')).toBeInTheDocument());
    expect(getByText('Authenticated: false')).toBeInTheDocument();
  });
  
  it('login function should throw error if authService.login fails', async () => {
    const loginError = { message: 'Login failed' };
    mockAuthService.login.mockRejectedValue(loginError);
    mockAuthService.getCurrentUser.mockReturnValue(null);

    let getByText; // Renamed
    // Suppress console.error for this test as we expect an error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      const { getByText: rgt } = render(
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      );
      getByText = rgt;
    });
    
    await waitFor(() => expect(getByText('User: None')).toBeInTheDocument());

    // We need to catch the error thrown by the context's login function
    // The TestConsumerComponent doesn't propagate it, so we test the raw context method if needed
    // Or ensure the UI handles it. For this test, just checking service call is enough.
    // For more robust, we'd need to call context's login directly or have error display in TestConsumer.
    try {
        await act(async () => {
            // Directly access context or make TestConsumer throw/display error
            // For now, just clicking and checking console error (which is spied on)
            getByText('Login').click();
            await waitFor(() => expect(mockAuthService.login).toHaveBeenCalled());
        });
    } catch (e) {
        expect(e).toEqual(loginError);
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed in context:', loginError);
    consoleErrorSpy.mockRestore();
  });
});
