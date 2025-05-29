// src/services/authService.test.js
import { authService } from './authService'; // Ensure this path is correct

const MOCK_USERS_KEY = 'mock_users';
const MOCK_TOKEN_KEY = 'mock_jwt_token';

// Helper to manage localStorage mock for these tests
let store = {};
const localStorageMock = {
  getItem: jest.fn((key) => store[key] || null),
  setItem: jest.fn((key, value) => {
    store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
  }),
  clear: jest.fn(() => {
    store = {};
  }),
};

// Apply the mock to the global window object before each test
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  localStorageMock.clear(); // Clear storage before each test
});

describe('authService', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await authService.register('test@example.com', 'Password123!');
      expect(result.success).toBe(true);
      expect(result.user).toHaveProperty('email', 'test@example.com');
      
      const usersInStorage = JSON.parse(localStorage.getItem(MOCK_USERS_KEY));
      expect(usersInStorage).toHaveLength(1);
      expect(usersInStorage[0].email).toBe('test@example.com');
    });

    it('should reject registration if user already exists', async () => {
      await authService.register('test@example.com', 'Password123!'); // First registration
      await expect(authService.register('test@example.com', 'Password456!')).rejects.toEqual({
        message: 'User already exists',
      });
      
      const usersInStorage = JSON.parse(localStorage.getItem(MOCK_USERS_KEY));
      expect(usersInStorage).toHaveLength(1); // Still only one user
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Register a user to test login
      await authService.register('loginuser@example.com', 'LoginPass123!');
    });

    it('should login an existing user successfully and store a token', async () => {
      const result = await authService.login('loginuser@example.com', 'LoginPass123!');
      expect(result.user).toHaveProperty('email', 'loginuser@example.com');
      expect(result.token).toBeDefined();
      expect(localStorage.getItem(MOCK_TOKEN_KEY)).toBe(result.token);
    });

    it('should reject login with invalid email', async () => {
      await expect(authService.login('wrongemail@example.com', 'LoginPass123!')).rejects.toEqual({
        message: 'Invalid credentials',
      });
      expect(localStorage.getItem(MOCK_TOKEN_KEY)).toBeNull();
    });

    it('should reject login with invalid password', async () => {
      await expect(authService.login('loginuser@example.com', 'WrongPass123!')).rejects.toEqual({
        message: 'Invalid credentials',
      });
      expect(localStorage.getItem(MOCK_TOKEN_KEY)).toBeNull();
    });
  });

  describe('logout', () => {
    beforeEach(async () => {
      await authService.register('logoutuser@example.com', 'LogoutPass123!');
      await authService.login('logoutuser@example.com', 'LogoutPass123!');
      expect(localStorage.getItem(MOCK_TOKEN_KEY)).not.toBeNull(); // Ensure token is set
    });

    it('should remove the token from localStorage', async () => {
      await authService.logout();
      expect(localStorage.getItem(MOCK_TOKEN_KEY)).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    let testUser;
    beforeEach(async () => {
      const regResult = await authService.register('current@example.com', 'CurrentPass123!');
      testUser = regResult.user; // Store the registered user details
      await authService.login('current@example.com', 'CurrentPass123!');
    });

    it('should return user details if a valid token exists', () => {
      const user = authService.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.email).toBe('current@example.com');
      expect(user.id).toBe(testUser.id);
    });

    it('should return null if no token exists', () => {
      authService.logout(); // Ensure token is removed
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return null and remove token if token is invalid (e.g., malformed)', () => {
      localStorage.setItem(MOCK_TOKEN_KEY, 'invalid.token.format');
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
      expect(localStorage.getItem(MOCK_TOKEN_KEY)).toBeNull(); // Should remove invalid token
    });
  });
  
  describe('getToken', () => {
    it('should return the token if it exists', async () => {
      await authService.register('tokenuser@example.com', 'TokenPass123!');
      const loginResult = await authService.login('tokenuser@example.com', 'TokenPass123!');
      expect(authService.getToken()).toBe(loginResult.token);
    });

    it('should return null if no token exists', () => {
      expect(authService.getToken()).toBeNull();
    });
  });
});
