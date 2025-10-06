import stateManager from './stateManager.js';

/**
 * AuthService - Handles user authentication logic.
 * This is a mock service that simulates API calls.
 */
class AuthService {
  constructor() {
    // Check if user was previously logged in
    this.init();
  }

  /**
   * Initialize the service and check for a persisted session.
   */
  init() {
    try {
      const persistedUser = sessionStorage.getItem('authUser');
      if (persistedUser) {
        stateManager.loginUser(JSON.parse(persistedUser));
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
      sessionStorage.removeItem('authUser');
    }
  }

  /**
   * Simulate a user login.
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @returns {Promise<object>} A promise that resolves with the user object.
   */
  async login(username, password) {
    // In a real app, this would be an API call.
    // We simulate a delay and check credentials.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          const user = { name: 'Admin User', username: 'admin' };
          
          // Persist user session
          sessionStorage.setItem('authUser', JSON.stringify(user));
          
          // Update global state
          stateManager.loginUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials. Try admin/password.'));
        }
      }, 500);
    });
  }

  /**
   * Simulate a user logout.
   */
  logout() {
    // Clear persisted session
    sessionStorage.removeItem('authUser');
    
    // Update global state
    stateManager.logoutUser();
    console.log('User logged out.');
  }
}

export default new AuthService();