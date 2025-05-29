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
    // console.log('authService.register called with:', email); // Removed
    const users = getUsers();
    if (users.find(user => user.email === email)) {
      return Promise.reject({ message: 'User already exists' });
    }
    const newUser = { id: Date.now().toString(), email, password };
    users.push(newUser);
    saveUsers(users);
    // console.log('User registered:', newUser); // Removed
    return Promise.resolve({ success: true, user: { id: newUser.id, email: newUser.email } });
  },

  login: async (email, password) => {
    // console.log('authService.login called with:', email); // Removed
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const mockToken = `${btoa(user.email)}.${btoa(Date.now().toString())}`;
      localStorage.setItem(MOCK_TOKEN_KEY, mockToken);
      // console.log('User logged in:', user.email, 'Token:', mockToken); // Removed
      return Promise.resolve({
        token: mockToken,
        user: { id: user.id, email: user.email },
      });
    } else {
      return Promise.reject({ message: 'Invalid credentials' });
    }
  },

  logout: () => {
    // console.log('authService.logout called'); // Removed
    localStorage.removeItem(MOCK_TOKEN_KEY);
    return Promise.resolve();
  },

  getCurrentUser: () => {
    // console.log('authService.getCurrentUser called'); // Removed
    const token = localStorage.getItem(MOCK_TOKEN_KEY);
    if (token) {
      try {
        const email = atob(token.split('.')[0]);
        const users = getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
          // console.log('Current user found:', user.email); // Removed
          return { id: user.id, email: user.email };
        }
      } catch (error) {
        // console.error('Error decoding token:', error); // Removed
        localStorage.removeItem(MOCK_TOKEN_KEY);
        return null;
      }
    }
    // console.log('No current user found (no token)'); // Removed
    return null;
  },

  // Helper to simulate getting a token (used by AuthContext perhaps)
  getToken: () => {
    return localStorage.getItem(MOCK_TOKEN_KEY);
  }
};

// Export the service directly or as a default
// export default authService; // if you prefer default export
