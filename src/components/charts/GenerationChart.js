import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';

const GenerationChart = ({ data }) => {
    const getChartConfig = useCallback(() => {
        const labels = data.map(d => d.time);
        return {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Solar Generation',
                    data: data.map(d => d.solar),
                    borderColor: CHART_COLORS.solar,
                    backgroundColor: `${CHART_COLORS.solar}40`,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Wind Generation',
                    data: data.map(d => d.wind),
                    borderColor: CHART_COLORS.wind,
                    backgroundColor: `${CHART_COLORS.wind}40`,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Generation (kW)' } } },
                plugins: { legend: { position: 'top' } }
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

export default GenerationChart;