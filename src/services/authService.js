// src/services/authService.js

const MOCK_USERS_KEY = 'mock_users';
const MOCK_TOKEN_KEY = 'mock_jwt_token';

// Helper to get users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Helper to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const authService = {
  register: async (email, password) => {
    console.log('authService.register called with:', email);
    const users = getUsers();
    if (users.find(user => user.email === email)) {
      // Simulate API error for existing user
      return Promise.reject({ message: 'User already exists' });
    }
    const newUser = { id: Date.now().toString(), email, password }; // Password should be hashed in a real app
    users.push(newUser);
    saveUsers(users);
    console.log('User registered:', newUser);
    // Simulate successful registration
    return Promise.resolve({ success: true, user: { id: newUser.id, email: newUser.email } });
  },

  login: async (email, password) => {
    console.log('authService.login called with:', email);
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password); // Plain text password check for mock

    if (user) {
      // Simulate successful login: Generate a mock token (user's email + timestamp for simplicity)
      const mockToken = `${btoa(user.email)}.${btoa(Date.now().toString())}`;
      localStorage.setItem(MOCK_TOKEN_KEY, mockToken);
      console.log('User logged in:', user.email, 'Token:', mockToken);
      // In a real app, the token would come from the backend
      return Promise.resolve({
        token: mockToken,
        user: { id: user.id, email: user.email /* other user details */ },
      });
    } else {
      // Simulate login failure
      return Promise.reject({ message: 'Invalid credentials' });
    }
  },

  logout: () => {
    console.log('authService.logout called');
    localStorage.removeItem(MOCK_TOKEN_KEY);
    // No async needed for localStorage, but can return Promise.resolve() for consistency
    return Promise.resolve();
  },

  getCurrentUser: () => {
    console.log('authService.getCurrentUser called');
    const token = localStorage.getItem(MOCK_TOKEN_KEY);
    if (token) {
      try {
        // Simulate token decoding: extract email (first part of our mock token)
        const email = atob(token.split('.')[0]);
        // In a real app, you'd verify the token and get payload
        // For mock, we might need to fetch user details from our mock users list again
        const users = getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
          console.log('Current user found:', user.email);
          return { id: user.id, email: user.email /* other relevant details */ };
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Invalid token, remove it
        localStorage.removeItem(MOCK_TOKEN_KEY);
        return null;
      }
    }
    console.log('No current user found (no token)');
    return null;
  },

  // Helper to simulate getting a token (used by AuthContext perhaps)
  getToken: () => {
    return localStorage.getItem(MOCK_TOKEN_KEY);
  }
};

// Export the service directly or as a default
// export default authService; // if you prefer default export
