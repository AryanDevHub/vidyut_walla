// This file remains the same as the original apiService.js,
// as it correctly abstracts data fetching.
// Mock data derived from the legacy app.js file
const MOCK_DATA = {
    current_status: {
        timestamp: "2025-09-27T16:33:00+05:30",
        solar_generation: 385.5,
        wind_generation: 23.8,
        total_generation: 409.3,
        campus_load: 342.7,
        battery_soc: 78.5,
        battery_power: 25.2,
        grid_power: -41.4,
        weather: {
            temperature: 32.5,
            irradiance: 785,
            wind_speed: 4.2,
            cloud_cover: 15
        }
    },
    historical_data: [
        {"time": "06:00", "solar": 0, "wind": 15, "load": 180, "battery": 65},
        {"time": "07:00", "solar": 45, "wind": 18, "load": 220, "battery": 68},
        {"time": "08:00", "solar": 125, "wind": 22, "load": 280, "battery": 72},
        {"time": "09:00", "solar": 245, "wind": 28, "load": 320, "battery": 75},
        {"time": "10:00", "solar": 335, "wind": 31, "load": 350, "battery": 77},
        {"time": "11:00", "solar": 398, "wind": 35, "load": 380, "battery": 78},
        {"time": "12:00", "solar": 445, "wind": 38, "load": 395, "battery": 82},
        {"time": "13:00", "solar": 465, "wind": 42, "load": 405, "battery": 85},
        {"time": "14:00", "solar": 425, "wind": 38, "load": 385, "battery": 83},
        {"time": "15:00", "solar": 398, "wind": 32, "load": 365, "battery": 80},
        {"time": "16:00", "solar": 385, "wind": 24, "load": 343, "battery": 78}
    ],
    forecasts: [
        {"day": "Today", "solar_max": 465, "wind_avg": 32, "load_peak": 405},
        {"day": "Tomorrow", "solar_max": 445, "wind_avg": 28, "load_peak": 395},
        {"day": "Day 3", "solar_max": 385, "wind_avg": 22, "load_peak": 380},
    ],
    recommendations: [
        {
            type: "battery",
            priority: "high",
            message: "Optimal battery charging window: 11:00-14:00 today due to excess solar generation",
            savings: "₹2,450"
        },
        {
            type: "load",
            priority: "medium", 
            message: "Schedule workshop activities for 12:00-15:00 when renewable generation peaks",
            savings: "₹1,850"
        },
    ],
    alerts: [
        {
            type: "warning",
            message: "Wind generation below forecast - maintenance check recommended for turbine",
            timestamp: "2025-09-27T14:15:00+05:30"
        },
        {
            type: "info",
            message: "Battery system performing optimally - 95.2% efficiency over last 24 hours",
            timestamp: "2025-09-27T10:30:00+05:30"
        }
    ]
};

const fakeFetch = (data, delay = 250) => 
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

class ApiService {
  getCurrentStatus() { return fakeFetch(MOCK_DATA.current_status); }
  getHistoricalData() { return fakeFetch(MOCK_DATA.historical_data); }
  getForecasts() { return fakeFetch(MOCK_DATA.forecasts); }
  getRecommendations() { return fakeFetch(MOCK_DATA.recommendations); }
  getAlerts() { return fakeFetch(MOCK_DATA.alerts); }
  updateBatterySettings(settings) {
    console.log('API: Updating battery settings', settings);
    return fakeFetch({ success: true, settings });
  }
}

const apiService = new ApiService();
export default apiService;