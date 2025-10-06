// Configuration constants
export const CONFIG = {
  // Update intervals
  UPDATE_INTERVAL: 5000, // 5 seconds
  TIME_UPDATE_INTERVAL: 60000, // 1 minute
  
  // Chart settings
  CHART_MAX_POINTS: 10,
  CHART_ANIMATION_DURATION: 250,
  
  // Campus information
  CAMPUS_INFO: {
    name: "Government Engineering College, Jodhpur",
    location: "Rajasthan, India",
    solar_capacity: 500, // kW
    wind_capacity: 100, // kW
    battery_capacity: 800, // kWh
    peak_demand: 450 // kW
  },
  
  // Thresholds
  THRESHOLDS: {
    battery_low: 20,
    battery_high: 90,
    load_high: 400,
    performance_min: 85
  },
  
  // Simulation settings
  SIMULATION: {
    solar_variation: 10,
    wind_variation: 3,
    load_variation: 8,
    battery_variation: 0.5,
    temperature_variation: 0.5,
    wind_speed_variation: 0.3,
    irradiance_variation: 20
  },
  
  // API endpoints (for future backend integration)
  API: {
    BASE_URL: '/api/v1',
    ENDPOINTS: {
      current_status: '/status/current',
      historical_data: '/data/historical',
      forecasts: '/forecasts',
      recommendations: '/optimization/recommendations',
      alerts: '/alerts',
      battery_settings: '/control/battery',
      load_schedule: '/control/schedule'
    }
  },
  
  // Currency and units
  LOCALE: 'en-IN',
  CURRENCY: '₹',
  TIMEZONE: 'Asia/Kolkata'
};

// Validation rules
export const VALIDATION = {
  battery_soc: { min: 20, max: 100 },
  load_threshold: { min: 300, max: 500 },
  performance_threshold: { min: 70, max: 95 }
};

// Color schemes for charts
export const CHART_COLORS = {
  solar: '#1FB8CD',
  wind: '#B4413C',
  load: '#FFC185',
  battery_charging: '#5D878F',
  battery_discharging: '#DB4545'
};