import React from 'react';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS } from '../../services/config';
const BatteryBankModal = ({ poiData }) => {
const soc = 78.5; // State of Charge
const isCharging = true;
const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00'],
    datasets: [{ label: 'SOC (%)', data: [85, 75, 68, 72, 78.5], borderColor: CHART_COLORS.battery_charging, tension: 0.1 }]
};
const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

return (
    <div className="asset-modal">
        <div className="modal-header-custom">
            <h3>{poiData.name}</h3>
            <span className={`status status--${isCharging ? 'success' : 'info'}`}>{isCharging ? 'Charging' : 'Discharging'}</span>
        </div>
        <div className="modal-grid">
            <div className="modal-column">
                <h4>Live Metrics</h4>
                <div className="metrics-grid">
                    <div className="metric-item"><strong>State of Charge</strong><span>{soc}%</span></div>
                    <div className="metric-item"><strong>Power</strong><span>+25.2 kW</span></div>
                    <div className="metric-item"><strong>Temperature</strong><span>28°C</span></div>
                    <div className="metric-item"><strong>State of Health</strong><span>98%</span></div>
                </div>
                 <h4>24-Hour SOC Profile</h4>
                <div className="chart-container" style={{ height: '150px' }}><Line data={chartData} options={chartOptions} /></div>
            </div>
            <div className="modal-column">
                 <h4>Live Status</h4>
                 <div className="panel-control-card battery-visual">
                    <div className="battery-icon">
                        <div className="battery-level" style={{ height: `${soc}%`, background: isCharging ? CHART_COLORS.solar : CHART_COLORS.load }}></div>
                        <span className="battery-soc-text">{soc}%</span>
                    </div>
                    <p>Battery State of Charge</p>
                 </div>
            </div>
        </div>
    </div>
);
};
export default BatteryBankModal;