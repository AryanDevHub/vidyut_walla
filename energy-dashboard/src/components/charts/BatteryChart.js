import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';

const BatteryChart = ({ data }) => {
    const getChartConfig = useCallback(() => {
        const batteryPowerData = data.map((d, i, arr) => {
            if (i === 0) return 0;
            const socDiff = d.battery - arr[i - 1].battery;
            return socDiff * 16; // Approximation from original code
        });
        const labels = data.map(d => d.time);

        return {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Battery Power (kW)',
                    data: batteryPowerData,
                    backgroundColor: batteryPowerData.map(v =>
                        v >= 0 ? CHART_COLORS.battery_charging : CHART_COLORS.battery_discharging
                    ),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { title: { display: true, text: 'Power (kW, +Charging/-Discharging)' } } }
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

export default BatteryChart;