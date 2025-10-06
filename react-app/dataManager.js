import { CONFIG } from './config.js';
import { clamp, formatNumber } from './utils.js';
import apiService from './apiService.js';
import stateManager from './stateManager.js';

/**
 * Data Manager - Handles all data operations
 */
class DataManager {
  constructor() {
    this.updateInterval = null;
  }

  /**
   * Initialize data manager
   */
  async init() {
    try {
      await this.loadInitialData();
      this.startRealTimeUpdates();
    } catch (error) {
      console.error('DataManager initialization failed:', error);
      stateManager.setError('Failed to load initial data');
    }
  }

  /**
   * Load all initial data
   */
  async loadInitialData() {
    stateManager.setLoading(true);

    try {
      const [status, historical, forecasts, recommendations, alerts] = await Promise.all([
        apiService.getCurrentStatus(),
        apiService.getHistoricalData(),
        apiService.getForecasts(),
        apiService.getRecommendations(),
        apiService.getAlerts()
      ]);

      stateManager.updateCurrentStatus(status);
      stateManager.updateHistoricalData(historical);
      stateManager.updateForecasts(forecasts);
      stateManager.updateRecommendations(recommendations);
      stateManager.updateAlerts(alerts);

      stateManager.clearError();
    } catch (error) {
      throw error;
    } finally {
      stateManager.setLoading(false);
    }
  }

  /**
   * Start real-time data updates
   */
  startRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        await this.updateRealTimeData();
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, CONFIG.UPDATE_INTERVAL);
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update real-time data
   */
  async updateRealTimeData() {
    const currentStatus = stateManager.get('currentStatus');
    if (!currentStatus) return;

    // Simulate real-time fluctuations
    const updated = this.simulateRealTimeData(currentStatus);
    stateManager.updateCurrentStatus(updated);

    // Update historical data with new point
    this.addHistoricalDataPoint(updated);
  }

  /**
   * Simulate real-time data fluctuations
   */
  simulateRealTimeData(status) {
    const sim = CONFIG.SIMULATION;
    const updated = { ...status };

    // Update generation values
    updated.solar_generation = clamp(
      status.solar_generation + (Math.random() - 0.5) * sim.solar_variation,
      0,
      CONFIG.CAMPUS_INFO.solar_capacity
    );

    updated.wind_generation = clamp(
      status.wind_generation + (Math.random() - 0.5) * sim.wind_variation,
      0,
      CONFIG.CAMPUS_INFO.wind_capacity
    );

    updated.campus_load = clamp(
      status.campus_load + (Math.random() - 0.5) * sim.load_variation,
      200,
      CONFIG.CAMPUS_INFO.peak_demand
    );

    updated.battery_soc = clamp(
      status.battery_soc + (Math.random() - 0.5) * sim.battery_variation,
      CONFIG.THRESHOLDS.battery_low,
      100
    );

    // Update weather
    updated.weather = {
      temperature: clamp(
        status.weather.temperature + (Math.random() - 0.5) * sim.temperature_variation,
        25,
        40
      ),
      wind_speed: clamp(
        status.weather.wind_speed + (Math.random() - 0.5) * sim.wind_speed_variation,
        0,
        15
      ),
      irradiance: clamp(
        status.weather.irradiance + (Math.random() - 0.5) * sim.irradiance_variation,
        0,
        1000
      ),
      cloud_cover: status.weather.cloud_cover
    };

    // Recalculate derived values
    updated.total_generation = updated.solar_generation + updated.wind_generation;
    updated.grid_power = updated.campus_load - updated.total_generation - status.battery_power;
    updated.timestamp = new Date().toISOString();

    // Round all numeric values
    return this.roundNumericValues(updated);
  }

  /**
   * Round all numeric values in object
   */
  roundNumericValues(obj, decimals = 1) {
    const rounded = { ...obj };
    
    Object.keys(rounded).forEach(key => {
      if (typeof rounded[key] === 'number') {
        rounded[key] = parseFloat(formatNumber(rounded[key], decimals));
      } else if (typeof rounded[key] === 'object' && rounded[key] !== null) {
        rounded[key] = this.roundNumericValues(rounded[key], decimals);
      }
    });

    return rounded;
  }

  /**
   * Add historical data point
   */
  addHistoricalDataPoint(status) {
    const historical = stateManager.get('historicalData') || [];
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const newPoint = {
      time: timeString,
      solar: status.solar_generation,
      wind: status.wind_generation,
      load: status.campus_load,
      battery: status.battery_soc
    };

    historical.push(newPoint);

    // Keep only last 24 hours of data (assuming 5-second intervals)
    const maxPoints = Math.floor((24 * 60 * 60) / (CONFIG.UPDATE_INTERVAL / 1000));
    if (historical.length > maxPoints) {
      historical.shift();
    }

    stateManager.updateHistoricalData(historical);
  }

  /**
   * Generate historical data for reports
   */
  generateHistoricalReport(days = 30) {
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        generation: parseFloat(formatNumber(380 + Math.random() * 120)),
        consumption: parseFloat(formatNumber(320 + Math.random() * 80)),
        savings: parseFloat(formatNumber(3500 + Math.random() * 2000))
      });
    }
    
    return data;
  }

  /**
   * Calculate energy metrics
   */
  calculateMetrics(status) {
    if (!status) return null;

    return {
      renewablePercentage: this.calculateRenewablePercentage(status),
      selfSufficiency: this.calculateSelfSufficiency(status),
      batteryEfficiency: 95.2, // Would come from actual battery monitoring
      gridInteraction: this.categorizeGridInteraction(status.grid_power)
    };
  }

  /**
   * Calculate renewable energy percentage
   */
  calculateRenewablePercentage(status) {
    const total = status.campus_load;
    const renewable = status.total_generation;
    return total > 0 ? (renewable / total) * 100 : 0;
  }

  /**
   * Calculate self-sufficiency
   */
  calculateSelfSufficiency(status) {
    return status.grid_power <= 0 ? 100 : 
           ((status.campus_load - Math.abs(status.grid_power)) / status.campus_load) * 100;
  }

  /**
   * Categorize grid interaction
   */
  categorizeGridInteraction(gridPower) {
    if (gridPower < -10) return 'exporting';
    if (gridPower > 10) return 'importing';
    return 'balanced';
  }

  /**
   * Check thresholds and generate alerts
   */
  checkThresholds(status) {
    const alerts = [];
    const thresholds = CONFIG.THRESHOLDS;

    if (status.battery_soc < thresholds.battery_low) {
      alerts.push({
        type: 'warning',
        message: `Battery SOC below ${thresholds.battery_low}% - consider charging`,
        timestamp: new Date().toISOString()
      });
    }

    if (status.campus_load > thresholds.load_high) {
      alerts.push({
        type: 'warning',
        message: `Campus load exceeding ${thresholds.load_high} kW - high demand detected`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopRealTimeUpdates();
  }
}

export default new DataManager();