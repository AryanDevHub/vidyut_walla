import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS } from '../../services/config';

const MiniChart = ({ datasets, labels }) => {
    const options = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, labels: { font: { size: 10 } } } },
        scales: { y: { ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } }
    };
    return <div className="chart-container" style={{ height: '150px' }}><Line data={{ labels, datasets }} options={options} /></div>;
};

const SolarPanelModal = ({ poiData }) => {
    const [panelAngle, setPanelAngle] = useState(23.5);

    const efficiency = useMemo(() => {
        const baseEfficiency = 95.0;
        const angleBonus = (1 - Math.abs(23.5 - panelAngle) / 23.5) * 5.0;
        return (baseEfficiency + angleBonus).toFixed(1);
    }, [panelAngle]);
    
    const chartLabels = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    
    return (
        <div className="asset-modal">
            <div className="modal-header-custom">
                <h3>{poiData.name}</h3>
                <span className={`status status--${poiData.status === 'operational' ? 'success' : 'warning'}`}>{poiData.status}</span>
            </div>

            <div className="modal-grid">
                <div className="modal-column">
                    <h4>Live Metrics</h4>
                    <div className="metrics-grid">
                        <div className="metric-item"><strong>Current Output</strong><span>180.5 kW</span></div>
                        <div className="metric-item"><strong>Efficiency</strong><span>{efficiency}%</span></div>
                        <div className="metric-item"><strong>Irradiance</strong><span>785 W/m²</span></div>
                        <div className="metric-item"><strong>Panel Temp.</strong><span>45°C</span></div>
                    </div>
                    <h4>Today's Performance</h4>
                    <MiniChart
                        labels={chartLabels}
                        datasets={[
                            { label: 'Power (kW)', data: [125, 200, 245, 210, 180], borderColor: CHART_COLORS.solar, tension: 0.4, fill: true, backgroundColor: `${CHART_COLORS.solar}20` },
                            { label: 'Irradiance (W/m²)', data: [400, 650, 800, 750, 600], borderColor: CHART_COLORS.load, tension: 0.4 }
                        ]}
                    />
                </div>
                <div className="modal-column">
                    <h4>Panel Angle Control (Prototype)</h4>
                    <div className="panel-control-card">
                        <p className="prototype-notice">Adjust panel angle to match the sun's position for maximum efficiency.</p>
                        <div className="angle-display">
                            <div className="sun-icon">☀️</div>
                            <div className="panel-icon" style={{ transform: `rotate(${panelAngle}deg)` }}></div>
                            <span>{panelAngle.toFixed(1)}°</span>
                        </div>
                        <div className="control-group">
                            <input type="range" className="range-control" min="0" max="45" step="0.5" value={panelAngle} onChange={(e) => setPanelAngle(parseFloat(e.target.value))} />
                        </div>
                        <div className="angle-recommendation">Optimal Angle for current time: <strong>23.5°</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolarPanelModal;