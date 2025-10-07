import React, { useCallback } from 'react';
import useChart from '../../hooks/useChart';
import { CHART_COLORS } from '../../services/config';
import Card from '../common/Card';

const generateQuarterlyData = () => {
  return [
    { quarter: 'Q1', revenue: 120, expenses: 80 },
    { quarter: 'Q2', revenue: 150, expenses: 95 },
    { quarter: 'Q3', revenue: 170, expenses: 110 },
    { quarter: 'Q4', revenue: 200, expenses: 130 },
  ];
};

const FinancialPerformanceChart = () => {
  const getChartConfig = useCallback(() => {
    const data = generateQuarterlyData();
    const labels = data.map(d => d.quarter);

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue (₹ Cr)',
            data: data.map(d => d.revenue),
            backgroundColor: `${CHART_COLORS.solar}80`,
            borderColor: CHART_COLORS.solar,
            borderWidth: 1,
          },
          {
            label: 'Expenses (₹ Cr)',
            data: data.map(d => d.expenses),
            backgroundColor: `${CHART_COLORS.load}80`,
            borderColor: CHART_COLORS.load,
            borderWidth: 1,
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
              text: 'Amount (₹ Cr)',
            },
          },
        },
      },
    };
  }, []);

  const canvasRef = useChart(getChartConfig);

  return (
    <Card title="Financial Performance">
      <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </Card>
  );
};

export default FinancialPerformanceChart;
