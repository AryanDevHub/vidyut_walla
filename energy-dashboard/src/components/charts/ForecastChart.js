import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';

const ForecastChart = ({ data }) => {
    const getChartConfig = useCallback(() => {
        const labels = data.map(f => f.day);
        return {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Solar Max (kW)',
                        data: data.map(f => f.solar_max),
                        backgroundColor: CHART_COLORS.solar,
                        borderRadius: 4
                    },
                    {
                        label: 'Wind Avg (kW)',
                        data: data.map(f => f.wind_avg),
                        backgroundColor: CHART_COLORS.wind,
                        borderRadius: 4
                    },
                    {
                        label: 'Load Peak (kW)',
                        data: data.map(f => f.load_peak),
                        backgroundColor: CHART_COLORS.load,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Power (kW)' } } }
            }
        };
    }, [data]);

    const canvasRef = useChart(getChartConfig);

    return (
        <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ForecastChart;