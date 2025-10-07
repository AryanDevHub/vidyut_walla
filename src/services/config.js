// Configuration constants - largely unchanged
export const CONFIG = {
    UPDATE_INTERVAL: 5000,
    TIME_UPDATE_INTERVAL: 60000,
    CHART_MAX_POINTS: 10,
    CAMPUS_INFO: {
        name: "Government Engineering College, Jodhpur",
        location: "Rajasthan, India",
        solar_capacity: 500,
        wind_capacity: 100,
        battery_capacity: 800,
        peak_demand: 450
    },
    SIMULATION: {
        solar_variation: 10,
        wind_variation: 3,
        load_variation: 8,
        battery_variation: 0.5,
    },
    LOCALE: 'en-IN',
    CURRENCY: '₹',
    TIMEZONE: 'Asia/Kolkata'
};

export const CHART_COLORS = {
    solar: '#1FB8CD',
    wind: '#B4413C',
    load: '#FFC185',
    battery_charging: '#5D878F',
    battery_discharging: '#DB4545'
};