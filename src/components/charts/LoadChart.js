import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';

const LoadChart = ({ data }) => {
  const getChartConfig = useCallback(() => {
    const labels = data.map(d => d.time);
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Campus Load',
            data: data.map(d => d.load),
            borderColor: CHART_COLORS.load,
            backgroundColor: `${CHART_COLORS.load}60`, // corrected interpolation
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Load (kW)',
            },
          },
        },
      },
    };
  }, [data]);

  const canvasRef = useChart(getChartConfig);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default LoadChart;
