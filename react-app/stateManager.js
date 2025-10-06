/**
 * State Manager - A simple, centralized state management system.
 * This class holds the application's state and notifies listeners when the state changes.
 */
class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = {};
  }

  /**
   * Get a value from the state.
   * @param {string} key The state key to retrieve.
   * @returns {*} The value from the state.
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set a value in the state and notify listeners.
   * @param {string} key The state key to set.
   * @param {*} value The new value.
   */
  set(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  /**
   * Notify all listeners for a given key.
   * @param {string} key The state key that changed.
   * @param {*} value The new value.
   */
  notify(key, value) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(value));
    }
  }

  /**
   * Subscribe to changes for a specific state key.
   * @param {string} key The state key to listen to.
   * @param {function} callback The function to call on change.
   * @returns {function} An unsubscribe function.
   */
  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);

    // Return an unsubscribe function for cleanup
    return () => {
      this.listeners[key] = this.listeners[key].filter(
        listener => listener !== callback
      );
    };
  }

  // Helper methods to provide a clear API for state updates
  setLoading(isLoading) { this.set('loading', isLoading); }
  setError(errorMessage) { this.set('error', errorMessage); }
  clearError() { this.set('error', null); }
  updateCurrentStatus(status) { this.set('currentStatus', status); }
  updateHistoricalData(data) { this.set('historicalData', data); }
  updateForecasts(data) { this.set('forecasts', data); }
  updateRecommendations(data) { this.set('recommendations', data); }
  updateAlerts(data) { this.set('alerts', data); }
  
  // Auth helpers
  loginUser(user) {
    this.set('isAuthenticated', true);
    this.set('user', user);
  }
  
  logoutUser() {
    this.set('isAuthenticated', false);
    this.set('user', null);
  }
}

// Define the initial structure of the application state
const initialState = {
  loading: true,
  error: null,
  isAuthenticated: false,
  user: null,
  currentStatus: null,
  historicalData: [],
  forecasts: [],
  recommendations: [],
  alerts: []
};

// Create a single instance to be used throughout the application
const stateManager = new StateManager(initialState);

export default stateManager;