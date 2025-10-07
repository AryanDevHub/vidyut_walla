import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/apiService';
import { CONFIG } from '../services/config';

const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Provider component
export const DataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Function to simulate real-time data fluctuations
    const simulateRealTimeData = (status) => {
        const sim = CONFIG.SIMULATION;
        const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
        
        const newStatus = { ...status };
        newStatus.solar_generation = clamp(status.solar_generation + (Math.random() - 0.5) * sim.solar_variation, 0, CONFIG.CAMPUS_INFO.solar_capacity);
        newStatus.wind_generation = clamp(status.wind_generation + (Math.random() - 0.5) * sim.wind_variation, 0, CONFIG.CAMPUS_INFO.wind_capacity);
        newStatus.campus_load = clamp(status.campus_load + (Math.random() - 0.5) * sim.load_variation, 200, CONFIG.CAMPUS_INFO.peak_demand);
        newStatus.battery_soc = clamp(status.battery_soc + (Math.random() - 0.5) * sim.battery_variation, 20, 100);

        newStatus.total_generation = newStatus.solar_generation + newStatus.wind_generation;
        newStatus.grid_power = newStatus.campus_load - newStatus.total_generation - status.battery_power;

        // Round values
        Object.keys(newStatus).forEach(key => {
            if (typeof newStatus[key] === 'number') {
                newStatus[key] = parseFloat(newStatus[key].toFixed(1));
            }
        });
        
        return newStatus;
    };


    // Fetch initial data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [status, historical, forecasts, recommendations, alerts] = await Promise.all([
                    apiService.getCurrentStatus(),
                    apiService.getHistoricalData(),
                    apiService.getForecasts(),
                    apiService.getRecommendations(),
                    apiService.getAlerts()
                ]);
                setCurrentStatus(status);
                setHistoricalData(historical);
                setForecasts(forecasts);
                setRecommendations(recommendations);
                setAlerts(alerts);
            } catch (error) {
                console.error("Failed to load initial data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Set up interval for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentStatus) {
                const newStatus = simulateRealTimeData(currentStatus);
                setCurrentStatus(newStatus);

                // Update historical data for live charts
                setHistoricalData(prevData => {
                    const newData = [...prevData, {
                        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                        solar: newStatus.solar_generation,
                        load: newStatus.campus_load
                    }];
                    // Keep the data array from growing indefinitely
                    return newData.length > 20 ? newData.slice(1) : newData;
                });
            }
        }, CONFIG.UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [currentStatus]);

    const value = {
        loading,
        currentStatus,
        historicalData,
        forecasts,
        recommendations,
        alerts
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};