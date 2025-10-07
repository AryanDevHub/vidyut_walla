import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';

const DashboardChart = ({ data }) => {
    const getChartConfig = useCallback(() => {
        const recentData = data.slice(-10); // Show last 10 data points
        const labels = recentData.map(d => d.time);
        
        return {
            type: 'line',
            data: {
                labels,
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
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Power (kW)' } } },
                plugins: { legend: { position: 'top' } }
            }
        };
    }, [data]);

    const canvasRef = useChart(getChartConfig);

    return (
        <div className="chart-container" style={{ position: 'relative', height: '200px' }}>
            <canvas ref={canvasRef} role="img"></canvas>
        </div>
    );
};

export default DashboardChart;