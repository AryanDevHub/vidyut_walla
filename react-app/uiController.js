import { CONFIG } from './config.js';
import { getElement, formatNumber, formatCurrency, formatDateTime, sanitizeHTML, validate, showSuccess, showError } from './utils.js';
import stateManager from './stateManager.js';
import chartManager from './chartManager.js';
import apiService from './apiService.js';
import settingsManager from './settingsManager.js';
import authService from './authService.js';

/**
 * UI Controller - Manages all UI updates and interactions
 */
class UIController {
  constructor() {
    this.unsubscribers = [];
    this.activeSection = 'dashboard';
  }

  /**
   * Initialize UI
   */
  init() {
    this.setupNavigation();
    this.setupModal();
    this.setupFormHandlers();
    this.setupHeaderControls();
    this.updateClock();
    this.setupStateSubscriptions();
    
    // Initial render
    this.renderAll();
  }

  /**
   * Setup state subscriptions
   */
  setupStateSubscriptions() {
    const unsubStatus = stateManager.subscribe('currentStatus', (status) => {
      this.updateDashboard(status);
    });

    const unsubRecommendations = stateManager.subscribe('recommendations', (recs) => {
      this.renderRecommendations(recs);
    });

    const unsubAlerts = stateManager.subscribe('alerts', (alerts) => {
      this.renderAlerts(alerts);
    });

    const unsubLoading = stateManager.subscribe('loading', (loading) => {
      this.updateLoadingState(loading);
    });

    const unsubError = stateManager.subscribe('error', (error) => {
      if (error) {
        showError(error);
      }
    });
    
    const unsubAuth = stateManager.subscribe('isAuthenticated', () => {
      this.updateHeaderUI();
    });

    this.unsubscribers.push(unsubStatus, unsubRecommendations, unsubAlerts, unsubLoading, unsubError, unsubAuth);
  }

  /**
   * Setup navigation
   */
  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetSection = button.getAttribute('data-section');
        
        // Update active nav button
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show target section
        sections.forEach(section => section.classList.remove('active'));
        const target = getElement(targetSection);
        if (target) {
          target.classList.add('active');
          this.activeSection = targetSection;
        }
        
        // Refresh charts after section change
        setTimeout(() => chartManager.refreshAll(), 200);
      });
    });
  }

  /**
   * Setup modal
   */
  setupModal() {
    const modal = getElement('detail-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }

    // Add click handlers for modal triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.kpi-card, .status-item, .weather-item, .savings-item, .carbon-item');
      if (trigger) {
        this.showDetailModal(trigger);
      }
    });
  }

  /**
   * Setup form handlers
   */
  setupFormHandlers() {
    // Range input updates
    const rangeInputs = document.querySelectorAll('.range-control');
    rangeInputs.forEach(range => {
      const valueSpan = range.nextElementSibling;
      range.addEventListener('input', (e) => {
        if (valueSpan) {
          valueSpan.textContent = `${e.target.value}%`;
        }
      });
    });

    // Button click handlers with validation
    document.addEventListener('click', async (e) => {
      if (e.target.matches('.btn--primary')) {
        await this.handlePrimaryButtonClick(e.target);
      }
    });
  }

  /**
   * Setup header controls like theme switcher and auth buttons
   */
  setupHeaderControls() {
    const themeSwitcher = getElement('theme-switcher');
    if (themeSwitcher) {
      themeSwitcher.addEventListener('click', () => {
        const currentTheme = settingsManager.getTheme();
        const newTheme = currentTheme === 'light' || currentTheme === 'system' ? 'dark' : 'light';
        settingsManager.setTheme(newTheme);
      });
    }
    
    // Auth button listeners
    document.addEventListener('click', async (e) => {
      if (e.target.id === 'login-btn') {
        // Simple prompt for demo purposes
        const username = prompt("Enter username (try 'admin'):");
        const password = prompt("Enter password (try 'password'):");
        if (username && password) {
          try {
            await authService.login(username, password);
            showSuccess('Login successful!');
          } catch (error) {
            showError(error.message);
          }
        }
      }
      
      if (e.target.id === 'logout-btn') {
        authService.logout();
        showSuccess('You have been logged out.');
      }
    });
  }

  /**
   * Handle primary button clicks
   */
  async handlePrimaryButtonClick(button) {
    const originalText = button.textContent;
    const section = button.closest('.card');
    
    try {
      // Show loading state
      button.textContent = 'Applying...';
      button.disabled = true;

      // Determine which action to perform based on context
      if (section) {
        const header = section.querySelector('.card__header h3');
        if (header) {
          const title = header.textContent.toLowerCase();
          
          if (title.includes('battery')) {
            await this.applyBatterySettings(section);
          } else if (title.includes('schedule')) {
            await this.applyLoadSchedule(section);
          } else if (title.includes('alert')) {
            await this.applyAlertConfiguration(section);
          }
        }
      }

      // Show success
      button.textContent = 'Applied ✓';
      showSuccess('Settings applied successfully');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    } catch (error) {
      console.error('Apply settings failed:', error);
      button.textContent = 'Error';
      showError(error.message || 'Failed to apply settings');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2500);
    }
  }

  /**
   * Apply battery settings
   */
  async applyBatterySettings(section) {
    const targetSOC = section.querySelector('.range-control')?.value;
    const validation = validate(targetSOC, { min: 20, max: 100 });
    if (!validation.valid) throw new Error(validation.error);

    await apiService.updateBatterySettings({
      strategy: section.querySelector('select')?.value,
      target_soc: parseInt(targetSOC)
    });
  }

  /**
   * Apply load schedule
   */
  async applyLoadSchedule(section) {
    const selects = section.querySelectorAll('select');
    await apiService.updateLoadSchedule({
      hvac_schedule: selects[0]?.value,
      workshop_schedule: selects[1]?.value
    });
  }

  /**
   * Apply alert configuration
   */
  async applyAlertConfiguration(section) {
    const inputs = section.querySelectorAll('input[type="number"]');
    const [battery, load, performance] = Array.from(inputs).map(i => i.value);

    const validations = [
      validate(battery, { min: 10, max: 50 }),
      validate(load, { min: 300, max: 500 }),
      validate(performance, { min: 70, max: 95 })
    ];

    const firstError = validations.find(v => !v.valid);
    if (firstError) throw new Error(firstError.error);
    
    console.log('Alert configuration updated:', { battery, load, performance });
  }

  /**
   * Update clock
   */
  updateClock() {
    const timeElement = getElement('current-time');
    if (timeElement) {
      timeElement.textContent = formatDateTime();
    }
    setTimeout(() => this.updateClock(), CONFIG.TIME_UPDATE_INTERVAL);
  }

  /**
   * Render all UI elements
   */
  renderAll() {
    this.updateDashboard(stateManager.get('currentStatus'));
    this.renderRecommendations(stateManager.get('recommendations'));
    this.renderAlerts(stateManager.get('alerts'));
    this.updateHeaderUI();
  }

  /**
   * Update dashboard with current status
   */
  updateDashboard(status) {
    if (!status) return;
    this.updateElement('total-generation', `${formatNumber(status.total_generation)} kW`);
    this.updateElement('campus-load', `${formatNumber(status.campus_load)} kW`);
    this.updateElement('battery-soc', `${formatNumber(status.battery_soc)}%`);
    this.updateElement('grid-power', `${formatNumber(Math.abs(status.grid_power))} kW`);
    const solarPct = (status.solar_generation / CONFIG.CAMPUS_INFO.solar_capacity) * 100;
    const windPct = (status.wind_generation / CONFIG.CAMPUS_INFO.wind_capacity) * 100;
    this.updateElement('solar-status', `${formatNumber(status.solar_generation)} kW (${solarPct.toFixed(0)}% capacity)`);
    this.updateElement('wind-status', `${formatNumber(status.wind_generation)} kW (${windPct.toFixed(0)}% capacity)`);
    this.updateElement('battery-status', status.battery_power > 0 ? `Charging at ${formatNumber(status.battery_power)} kW` : `Discharging at ${formatNumber(Math.abs(status.battery_power))} kW`);
    this.updateElement('grid-status', status.grid_power < 0 ? `Exporting ${formatNumber(Math.abs(status.grid_power))} kW` : `Importing ${formatNumber(status.grid_power)} kW`);
    if (status.weather) {
      this.updateElement('temperature', `${formatNumber(status.weather.temperature)}°C`);
      this.updateElement('irradiance', `${formatNumber(status.weather.irradiance, 0)} W/m²`);
      this.updateElement('wind-speed', `${formatNumber(status.weather.wind_speed)} m/s`);
      this.updateElement('cloud-cover', `${formatNumber(status.weather.cloud_cover, 0)}%`);
    }
  }

  /**
   * Render recommendations
   */
  renderRecommendations(recommendations) {
    const container = getElement('recommendations');
    if (!container || !recommendations) return;
    container.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item ${rec.priority}">
        <div class="recommendation-header">
          <span class="recommendation-priority ${rec.priority}">${sanitizeHTML(rec.priority.toUpperCase())}</span>
          <span class="recommendation-savings">${sanitizeHTML(rec.savings)}</span>
        </div>
        <p class="recommendation-message">${sanitizeHTML(rec.message)}</p>
      </div>
    `).join('');
  }

  /**
   * Render alerts
   */
  renderAlerts(alerts) {
    const container = getElement('alerts-list');
    if (!container || !alerts) return;
    container.innerHTML = alerts.map(alert => {
      const time = formatDateTime(new Date(alert.timestamp), { year: undefined, month: undefined, day: undefined });
      return `
        <div class="alert-item ${alert.type}">
          <div class="alert-header">
            <span class="alert-type">${sanitizeHTML(alert.type.toUpperCase())}</span>
            <span class="alert-time">${time}</span>
          </div>
          <p class="alert-message">${sanitizeHTML(alert.message)}</p>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Update header UI based on auth state
   */
  updateHeaderUI() {
    const container = getElement('user-controls');
    if (!container) return;
    
    const isAuthenticated = stateManager.get('isAuthenticated');
    const user = stateManager.get('user');
    
    if (isAuthenticated && user) {
      container.innerHTML = `
        <div class="user-profile">
          <span>Welcome, ${sanitizeHTML(user.name)}</span>
          <button id="logout-btn" class="btn btn--secondary btn--sm">Logout</button>
        </div>
      `;
    } else {
      container.innerHTML = `<button id="login-btn" class="btn btn--secondary">Login</button>`;
    }
  }

  /**
   * Show detail modal
   */
  showDetailModal(element) {
    const modal = getElement('detail-modal');
    const title = getElement('modal-title');
    const body = getElement('modal-body');
    if (!modal || !title || !body) return;
    const titleText = element.querySelector('h3, h4')?.textContent || 'Details';
    const valueText = element.querySelector('.kpi-value, p')?.textContent || '';
    title.textContent = titleText;
    body.innerHTML = this.generateModalContent(element, titleText, valueText);
    modal.classList.remove('hidden');
  }

  /**
   * Generate modal content
   */
  generateModalContent(element, titleText, valueText) {
    if (element.classList.contains('kpi-card')) {
      return `
        <h4>Current Value: ${sanitizeHTML(valueText)}</h4>
        <p>Real-time monitoring of ${sanitizeHTML(titleText.toLowerCase())}.</p>
      `;
    }
    return `<p>${sanitizeHTML(valueText)}</p>`;
  }

  /**
   * Update element content safely
   */
  updateElement(id, content) {
    const element = getElement(id);
    if (element) element.textContent = content;
  }

  /**
   * Update loading state
   */
  updateLoadingState(loading) {
    document.body.classList.toggle('loading', loading);
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }
}

export default new UIController();