import { CONFIG, CHART_COLORS } from './config.js';
import { getElement } from './utils.js';
import stateManager from './stateManager.js';

/**
 * Chart Manager - Handles all Chart.js operations
 */
class ChartManager {
  constructor() {
    this.charts = {};
    this.unsubscribers = [];
  }

  /**
   * Initialize all charts
   */
  init() {
    // Wait for DOM to be ready
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded');
      return;
    }

    try {
      this.initDashboardChart();
      this.initGenerationChart();
      this.initLoadChart();
      this.initBatteryChart();
      this.initForecastChart();
      this.initHistoricalChart();

      // Subscribe to state changes
      this.setupStateSubscriptions();
    } catch (error) {
      console.error('Chart initialization failed:', error);
    }
  }

  /**
   * Setup state subscriptions
   */
  setupStateSubscriptions() {
    // Update charts when data changes
    const unsubHistorical = stateManager.subscribe('historicalData', (data) => {
      this.updateHistoricalCharts(data);
    });

    const unsubForecasts = stateManager.subscribe('forecasts', (data) => {
      this.updateForecastChart(data);
    });

    this.unsubscribers.push(unsubHistorical, unsubForecasts);
  }

  /**
   * Initialize dashboard chart
   */
  initDashboardChart() {
    const ctx = getElement('dashboard-chart');
    if (!ctx) return;

    const historical = stateManager.get('historicalData') || [];
    const recentData = historical.slice(-6);

    this.charts.dashboard = new Chart(ctx, {
      type: 'line',
      data: {
        labels: recentData.map(d => d.time),
        datasets: [{
          label: 'Solar Generation',
          data: recentData.map(d => d.solar),
          borderColor: CHART_COLORS.solar,
          backgroundColor: `${CHART_COLORS.solar}20`,
          fill: true,
          tension: 0.4
        }, {
          label: 'Campus Load',
          data: recentData.map(d => d.load),
          borderColor: CHART_COLORS.load,
          backgroundColor: `${CHART_COLORS.load}20`,
          fill: true,
          tension: 0.4
        }]
      },
      options: this.getLineChartOptions('Power (kW)', 'Time')
    });
  }

  /**
   * Initialize generation chart
   */
  initGenerationChart() {
    const ctx = getElement('generation-chart');
    if (!ctx) return;

    const historical = stateManager.get('historicalData') || [];

    this.charts.generation = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historical.map(d => d.time),
        datasets: [{
          label: 'Solar Generation',
          data: historical.map(d => d.solar),
          borderColor: CHART_COLORS.solar,
          backgroundColor: `${CHART_COLORS.solar}40`,
          fill: true,
          tension: 0.4
        }, {
          label: 'Wind Generation',
          data: historical.map(d => d.wind),
          borderColor: CHART_COLORS.wind,
          backgroundColor: `${CHART_COLORS.wind}40`,
          fill: true,
          tension: 0.4
        }]
      },
      options: this.getLineChartOptions('Generation (kW)')
    });
  }

  /**
   * Initialize load chart
   */
  initLoadChart() {
    const ctx = getElement('load-chart');
    if (!ctx) return;

    const historical = stateManager.get('historicalData') || [];

    this.charts.load = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historical.map(d => d.time),
        datasets: [{
          label: 'Campus Load',
          data: historical.map(d => d.load),
          borderColor: CHART_COLORS.load,
          backgroundColor: `${CHART_COLORS.load}60`,
          fill: true,
          tension: 0.4
        }]
      },
      options: this.getLineChartOptions('Load (kW)')
    });
  }

  /**
   * Initialize battery chart
   */
  initBatteryChart() {
    const ctx = getElement('battery-chart');
    if (!ctx) return;

    const historical = stateManager.get('historicalData') || [];
    const batteryPowerData = this.calculateBatteryPower(historical);

    this.charts.battery = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: historical.map(d => d.time),
        datasets: [{
          label: 'Battery Power (kW)',
          data: batteryPowerData,
          backgroundColor: batteryPowerData.map(v => 
            v >= 0 ? CHART_COLORS.battery_charging : CHART_COLORS.battery_discharging
          ),
          borderRadius: 4
        }]
      },
      options: this.getBarChartOptions('Power (kW, +Charging/-Discharging)')
    });
  }

  /**
   * Initialize forecast chart
   */
  initForecastChart() {
    const ctx = getElement('forecast-chart');
    if (!ctx) return;

    const forecasts = stateManager.get('forecasts') || [];

    this.charts.forecast = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: forecasts.map(f => f.day),
        datasets: [{
          label: 'Solar Max (kW)',
          data: forecasts.map(f => f.solar_max),
          backgroundColor: CHART_COLORS.solar,
          borderRadius: 4
        }, {
          label: 'Wind Avg (kW)',
          data: forecasts.map(f => f.wind_avg),
          backgroundColor: CHART_COLORS.wind,
          borderRadius: 4
        }, {
          label: 'Load Peak (kW)',
          data: forecasts.map(f => f.load_peak),
          backgroundColor: CHART_COLORS.load,
          borderRadius: 4
        }]
      },
      options: this.getBarChartOptions('Power (kW)')
    });
  }

  /**
   * Initialize historical chart
   */
  initHistoricalChart() {
    const ctx = getElement('historical-chart');
    if (!ctx) return;

    // Generate 30-day historical data
    const historicalData = this.generateMonthlyData();

    this.charts.historical = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historicalData.map(d => d.date),
        datasets: [{
          label: 'Generation (kWh)',
          data: historicalData.map(d => d.generation),
          borderColor: CHART_COLORS.solar,
          backgroundColor: `${CHART_COLORS.solar}20`,
          fill: false,
          tension: 0.4
        }, {
          label: 'Consumption (kWh)',
          data: historicalData.map(d => d.consumption),
          borderColor: CHART_COLORS.load,
          backgroundColor: `${CHART_COLORS.load}20`,
          fill: false,
          tension: 0.4
        }]
      },
      options: this.getLineChartOptions('Energy (kWh)')
    });
  }

  /**
   * Update historical charts with new data
   */
  updateHistoricalCharts(data) {
    if (!data || data.length === 0) return;

    // Update dashboard chart (last 6 points)
    if (this.charts.dashboard) {
      const recentData = data.slice(-6);
      this.charts.dashboard.data.labels = recentData.map(d => d.time);
      this.charts.dashboard.data.datasets[0].data = recentData.map(d => d.solar);
      this.charts.dashboard.data.datasets[1].data = recentData.map(d => d.load);
      this.charts.dashboard.update('none');
    }

    // Update generation chart
    if (this.charts.generation) {
      this.charts.generation.data.labels = data.map(d => d.time);
      this.charts.generation.data.datasets[0].data = data.map(d => d.solar);
      this.charts.generation.data.datasets[1].data = data.map(d => d.wind);
      this.charts.generation.update('none');
    }

    // Update load chart
    if (this.charts.load) {
      this.charts.load.data.labels = data.map(d => d.time);
      this.charts.load.data.datasets[0].data = data.map(d => d.load);
      this.charts.load.update('none');
    }

    // Update battery chart
    if (this.charts.battery) {
      const batteryPowerData = this.calculateBatteryPower(data);
      this.charts.battery.data.labels = data.map(d => d.time);
      this.charts.battery.data.datasets[0].data = batteryPowerData;
      this.charts.battery.data.datasets[0].backgroundColor = batteryPowerData.map(v =>
        v >= 0 ? CHART_COLORS.battery_charging : CHART_COLORS.battery_discharging
      );
      this.charts.battery.update('none');
    }
  }

  /**
   * Update forecast chart
   */
  updateForecastChart(forecasts) {
    if (!this.charts.forecast || !forecasts) return;

    this.charts.forecast.data.labels = forecasts.map(f => f.day);
    this.charts.forecast.data.datasets[0].data = forecasts.map(f => f.solar_max);
    this.charts.forecast.data.datasets[1].data = forecasts.map(f => f.wind_avg);
    this.charts.forecast.data.datasets[2].data = forecasts.map(f => f.load_peak);
    this.charts.forecast.update('none');
  }

  /**
   * Calculate battery power from SOC changes
   */
  calculateBatteryPower(data) {
    return data.map((d, i, arr) => {
      if (i === 0) return 0;
      const socDiff = d.battery - arr[i - 1].battery;
      return socDiff * 16; // Approximate power based on SOC change
    });
  }

  /**
   * Generate monthly historical data
   */
  generateMonthlyData() {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        generation: 380 + Math.random() * 120,
        consumption: 320 + Math.random() * 80
      });
    }
    return data;
  }

  /**
   * Get line chart options
   */
  getLineChartOptions(yAxisLabel = 'Value', xAxisLabel = '') {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel
          }
        },
        x: {
          title: {
            display: !!xAxisLabel,
            text: xAxisLabel
          }
        }
      },
      animation: {
        duration: CONFIG.CHART_ANIMATION_DURATION
      }
    };
  }

  /**
   * Get bar chart options
   */
  getBarChartOptions(yAxisLabel = 'Value') {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: yAxisLabel
          }
        }
      },
      animation: {
        duration: CONFIG.CHART_ANIMATION_DURATION
      }
    };
  }

  /**
   * Refresh all charts (useful for resize events)
   */
  refreshAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        try {
          chart.resize();
        } catch (error) {
          console.error('Chart resize failed:', error);
        }
      }
    });
  }

  /**
   * Destroy all charts
   */
  destroy() {
    // Unsubscribe from state changes
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // Destroy all charts
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        try {
          chart.destroy();
        } catch (error) {
          console.error('Chart destroy failed:', error);
        }
      }
    });
    this.charts = {};
  }
}

export default new ChartManager();