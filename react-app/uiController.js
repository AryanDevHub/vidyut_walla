import { CONFIG } from './config.js';
import { getElement, formatNumber, formatCurrency, formatDateTime, sanitizeHTML, validate, showSuccess, showError } from './utils.js';
import stateManager from './stateManager.js';
import chartManager from './chartManager.js';
import apiService from './apiService.js';

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

    this.unsubscribers.push(unsubStatus, unsubRecommendations, unsubAlerts, unsubLoading, unsubError);
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
      showError('Failed to apply settings');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    }
  }

  /**
   * Apply battery settings
   */
  async applyBatterySettings(section) {
    const strategy = section.querySelector('select')?.value;
    const targetSOC = section.querySelector('.range-control')?.value;

    if (!strategy || !targetSOC) {
      throw new Error('Missing battery settings');
    }

    const validation = validate(targetSOC, { min: 20, max: 100 });
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    await apiService.updateBatterySettings({
      strategy,
      target_soc: parseInt(targetSOC)
    });
  }

  /**
   * Apply load schedule
   */
  async applyLoadSchedule(section) {
    const selects = section.querySelectorAll('select');
    const schedule = Array.from(selects).map(select => select.value);

    await apiService.updateLoadSchedule({
      hvac_schedule: schedule[0] || '11:00 - 13:00',
      workshop_schedule: schedule[1] || '12:00 - 15:00'
    });
  }

  /**
   * Apply alert configuration
   */
  async applyAlertConfiguration(section) {
    const inputs = section.querySelectorAll('input[type="number"]');
    const [batteryThreshold, loadThreshold, performanceThreshold] = Array.from(inputs).map(input => input.value);

    // Validate all inputs
    const validations = [
      validate(batteryThreshold, { min: 10, max: 50 }),
      validate(loadThreshold, { min: 300, max: 500 }),
      validate(performanceThreshold, { min: 70, max: 95 })
    ];

    const errors = validations.filter(v => !v.valid);
    if (errors.length > 0) {
      throw new Error(errors[0].error);
    }

    // Would send to API in production
    console.log('Alert configuration updated:', {
      batteryThreshold,
      loadThreshold,
      performanceThreshold
    });
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
    const status = stateManager.get('currentStatus');
    const recommendations = stateManager.get('recommendations');
    const alerts = stateManager.get('alerts');

    if (status) this.updateDashboard(status);
    if (recommendations) this.renderRecommendations(recommendations);
    if (alerts) this.renderAlerts(alerts);
  }

  /**
   * Update dashboard with current status
   */
  updateDashboard(status) {
    if (!status) return;

    // Update KPI values
    this.updateElement('total-generation', `${formatNumber(status.total_generation)} kW`);
    this.updateElement('campus-load', `${formatNumber(status.campus_load)} kW`);
    this.updateElement('battery-soc', `${formatNumber(status.battery_soc)}%`);
    this.updateElement('grid-power', `${formatNumber(Math.abs(status.grid_power))} kW`);

    // Update system status
    const solarCapacityPct = Math.round((status.solar_generation / CONFIG.CAMPUS_INFO.solar_capacity) * 100);
    const windCapacityPct = Math.round((status.wind_generation / CONFIG.CAMPUS_INFO.wind_capacity) * 100);

    this.updateElement('solar-status', `${formatNumber(status.solar_generation)} kW (${solarCapacityPct}% capacity)`);
    this.updateElement('wind-status', `${formatNumber(status.wind_generation)} kW (${windCapacityPct}% capacity)`);
    
    const batteryStatus = status.battery_power > 0 
      ? `Charging at ${formatNumber(status.battery_power)} kW`
      : `Discharging at ${formatNumber(Math.abs(status.battery_power))} kW`;
    this.updateElement('battery-status', batteryStatus);
    
    const gridStatus = status.grid_power < 0
      ? `Exporting ${formatNumber(Math.abs(status.grid_power))} kW`
      : `Importing ${formatNumber(status.grid_power)} kW`;
    this.updateElement('grid-status', gridStatus);

    // Update weather
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

    container.innerHTML = '';
    
    recommendations.forEach(rec => {
      const item = document.createElement('div');
      item.className = `recommendation-item ${rec.priority}`;
      
      const priorityBadge = document.createElement('span');
      priorityBadge.className = `recommendation-priority ${rec.priority}`;
      priorityBadge.textContent = rec.priority.toUpperCase();
      
      const savings = document.createElement('span');
      savings.className = 'recommendation-savings';
      savings.textContent = rec.savings;
      
      const header = document.createElement('div');
      header.className = 'recommendation-header';
      header.appendChild(priorityBadge);
      header.appendChild(savings);
      
      const message = document.createElement('p');
      message.className = 'recommendation-message';
      message.textContent = rec.message;
      
      item.appendChild(header);
      item.appendChild(message);
      container.appendChild(item);
    });
  }

  /**
   * Render alerts
   */
  renderAlerts(alerts) {
    const container = getElement('alerts-list');
    if (!container || !alerts) return;

    container.innerHTML = '';
    
    alerts.forEach(alert => {
      const item = document.createElement('div');
      item.className = `alert-item ${alert.type}`;
      
      const time = new Date(alert.timestamp);
      const timeString = formatDateTime(time, { 
        hour: '2-digit', 
        minute: '2-digit',
        year: undefined,
        day: undefined,
        month: undefined
      });
      
      const typeBadge = document.createElement('span');
      typeBadge.className = 'alert-type';
      typeBadge.textContent = alert.type.toUpperCase();
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'alert-time';
      timeSpan.textContent = timeString;
      
      const header = document.createElement('div');
      header.className = 'alert-header';
      header.appendChild(typeBadge);
      header.appendChild(timeSpan);
      
      const message = document.createElement('p');
      message.className = 'alert-message';
      message.textContent = alert.message;
      
      item.appendChild(header);
      item.appendChild(message);
      container.appendChild(item);
    });
  }

  /**
   * Show detail modal
   */
  showDetailModal(element) {
    const modal = getElement('detail-modal');
    const title = getElement('modal-title');
    const body = getElement('modal-body');
    
    if (!modal || !title || !body) return;

    const titleElement = element.querySelector('h3, h4');
    const valueElement = element.querySelector('.kpi-value, .savings-value, .carbon-value, p');
    
    const titleText = titleElement ? titleElement.textContent : 'System Details';
    const valueText = valueElement ? valueElement.textContent : '';
    
    title.textContent = titleText;
    body.innerHTML = this.generateModalContent(element, titleText, valueText);
    
    modal.classList.remove('hidden');
  }

  /**
   * Generate modal content
   */
  generateModalContent(element, titleText, valueText) {
    const status = stateManager.get('currentStatus');
    
    if (element.classList.contains('kpi-card')) {
      return `
        <div class="detail-content">
          <h4>Current Value: ${sanitizeHTML(valueText)}</h4>
          <p>Real-time monitoring of ${sanitizeHTML(titleText.toLowerCase())} across the campus energy system.</p>
          <div class="detail-metrics">
            <div class="metric">
              <h5>24h Average</h5>
              <p>${status ? formatNumber(status.total_generation * 0.92) : '378'} kW</p>
            </div>
            <div class="metric">
              <h5>Peak Today</h5>
              <p>${status ? formatNumber(status.total_generation * 1.14) : '465'} kW</p>
            </div>
            <div class="metric">
              <h5>Efficiency</h5>
              <p>${Math.round(88 + Math.random() * 8)}%</p>
            </div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="detail-content">
        <h4>${sanitizeHTML(titleText)}</h4>
        <p>${sanitizeHTML(valueText)}</p>
        <p>System component operating within normal parameters.</p>
      </div>
    `;
  }

  /**
   * Update element content safely
   */
  updateElement(id, content) {
    const element = getElement(id);
    if (element) {
      element.textContent = content;
    }
  }

  /**
   * Update loading state
   */
  updateLoadingState(loading) {
    const body = document.body;
    if (loading) {
      body.classList.add('loading');
    } else {
      body.classList.remove('loading');
    }
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