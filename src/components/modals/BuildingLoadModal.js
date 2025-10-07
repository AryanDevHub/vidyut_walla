import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CHART_COLORS } from '../../services/config';

const BuildingLoadModal = ({ poiData }) => {
    const chartData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{ label: 'Load (kW)', data: [60, 55, 110, 150, 140, 90], backgroundColor: `${CHART_COLORS.load}80` }]
    };
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

    return (
        <div className="asset-modal">
            <div className="modal-header-custom">
                <h3>{poiData.name}</h3>
                <span className={`status status--${poiData.status === 'high_load' ? 'error' : 'success'}`}>{poiData.status.replace('_', ' ')}</span>
            </div>
            <div className="modal-grid">
                <div className="modal-column">
                    <h4>Live Metrics</h4>
                    <div className="metrics-grid">
                        <div className="metric-item"><strong>Current Load</strong><span>150.8 kW</span></div>
                        <div className="metric-item"><strong>Power Factor</strong><span>0.98</span></div>
                        <div className="metric-item"><strong>Peak Today</strong><span>155.2 kW</span></div>
                        <div className="metric-item"><strong>Energy Used</strong><span>1.2 MWh</span></div>
                    </div>
                    <h4>24-Hour Load Profile</h4>
                    <div className="chart-container" style={{ height: '150px' }}><Bar data={chartData} options={chartOptions} /></div>
                </div>
                <div className="modal-column">
                    <h4>Demand Response Control</h4>
                    <div className="panel-control-card">
                        <p className="prototype-notice">Activate load-shedding protocols during peak grid demand to reduce costs.</p>
                        <div className="dr-status">
                            <span>Status: <strong>Inactive</strong></span>
                            <div className="status-indicator inactive"></div>
                        </div>
                        <button className="btn btn--primary btn--full-width">Activate Smart Cooling</button>
                        <button className="btn btn--outline btn--full-width" style={{marginTop: 'var(--space-8)'}}>Activate Non-Essential Load Shed</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildingLoadModal;