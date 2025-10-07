import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// This custom hook encapsulates the logic for creating, updating, and destroying a Chart.js instance.
const useChart = (getChartConfig) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const config = getChartConfig();
        
        // If chart instance already exists, update it
        if (chartRef.current) {
            chartRef.current.data = config.data;
            chartRef.current.update('none'); // 'none' for no animation
        } else {
            // Otherwise, create a new chart instance
            chartRef.current = new Chart(canvasRef.current, config);
        }
        
        // Cleanup function to destroy the chart instance on component unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [getChartConfig]);

    return canvasRef;
};

export default useChart;
