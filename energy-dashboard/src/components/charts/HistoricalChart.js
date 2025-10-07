import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';

// This component generates its own sample data, just like the original app.js
const generateMonthlyData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            generation: 380 + Math.random() * 120,
            consumption: 320 + Math.random() * 80,
        });
    }
    return data;
};

const HistoricalChart = () => {
    const getChartConfig = useCallback(() => {
        const historicalData = generateMonthlyData();
        const labels = historicalData.map(d => d.date);
        return {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Generation (kWh)',
                    data: historicalData.map(d => d.generation),
                    borderColor: CHART_COLORS.solar,
                    tension: 0.4
                }, {
                    label: 'Consumption (kWh)',
                    data: historicalData.map(d => d.consumption),
                    borderColor: CHART_COLORS.load,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Energy (kWh)' } } }
            }
        };
    }, []);

    const canvasRef = useChart(getChartConfig);

    return (
        <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default HistoricalChart;