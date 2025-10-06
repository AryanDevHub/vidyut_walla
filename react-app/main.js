/**
 * Campus Energy Management System - Main Application
 * Improved modular architecture with proper error handling
 */

import { CONFIG } from './config.js';
import dataManager from './dataManager.js';
import chartManager from './chartManager.js';
import uiController from './uiController.js';
import stateManager from './stateManager.js';
import settingsManager from './settingsManager.js';
import authService from './authService.js'; // Import auth service

class EnergyManagementApp {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) {
      console.warn('Application already initialized');
      return;
    }

    try {
      console.log('Initializing Campus Energy Management System...');

      // Initialize settings first to apply theme
      settingsManager.init();

      // Initialize UI (for loading states and base structure)
      uiController.init();
      
      // Initialize auth service
      // authService is already initialized at import time

      // Initialize data manager (loads data and starts updates)
      await dataManager.init();

      // Initialize charts
      chartManager.init();

      // Setup window event handlers
      this.setupWindowHandlers();

      this.initialized = true;
      console.log('Application initialized successfully');

    } catch (error) {
      console.error('Application initialization failed:', error);
      stateManager.setError('Failed to initialize application. Please refresh the page.');
    }
  }

  /**
   * Setup window event handlers
   */
  setupWindowHandlers() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        chartManager.refreshAll();
      }, 250);
    });

    // Handle page visibility changes (pause updates when hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Page hidden - pausing updates');
        dataManager.stopRealTimeUpdates();
      } else {
        console.log('Page visible - resuming updates');
        dataManager.startRealTimeUpdates();
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });

    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    console.log('Cleaning up application...');

    try {
      dataManager.destroy();
      chartManager.destroy();
      uiController.destroy();
      this.initialized = false;
      console.log('Application cleanup complete');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Get application info
   */
  getInfo() {
    return {
      name: 'Campus Energy Management System',
      version: '2.0.0',
      campus: CONFIG.CAMPUS_INFO,
      initialized: this.initialized
    };
  }
}

// Create and initialize the application when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    app = new EnergyManagementApp();
    await app.init();

    // Expose to window for debugging
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      window.energyApp = app;
      window.energyState = stateManager;
      console.log('Debug: App exposed as window.energyApp');
    }
  } catch (error) {
    console.error('Failed to start application:', error);
  }
});

export default EnergyManagementApp;