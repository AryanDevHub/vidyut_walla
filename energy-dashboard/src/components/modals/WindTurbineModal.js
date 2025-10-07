import React from 'react';
import { CHART_COLORS } from '../../services/config';

const WindTurbineModal = ({ poiData }) => {
    const rpm = 20; // Mock RPM
    const animationDuration = 60 / rpm; // Calculate duration for one rotation

    return (
        <div className="asset-modal">
            <div className="modal-header-custom">
                <h3>{poiData.name}</h3>
                <span className={`status status--${poiData.status === 'warning' ? 'warning' : 'success'}`}>{poiData.status}</span>
            </div>
            <div className="modal-grid">
                <div className="modal-column">
                    <h4>Live Metrics</h4>
                    <div className="metrics-grid">
                        <div className="metric-item"><strong>Power Output</strong><span>23.8 kW</span></div>
                        <div className="metric-item"><strong>Wind Speed</strong><span>4.2 m/s</span></div>
                        <div className="metric-item"><strong>Turbine RPM</strong><span>{rpm}</span></div>
                        <div className="metric-item"><strong>Capacity Factor</strong><span>24%</span></div>
                    </div>
                    <h4>Maintenance Log</h4>
                    <div className="maintenance-log">
                        <p>Last Check: <strong>2 weeks ago</strong></p>
                        <p>Status: <strong style={{color: 'var(--color-warning)'}}>Check Recommended</strong></p>
                    </div>
                </div>
                <div className="modal-column">
                    <h4>Live Visualization</h4>
                    <div className="panel-control-card turbine-visual">
                        <div className="turbine-icon" style={{ animation: `spin ${animationDuration}s linear infinite` }}>
                            <div className="blade"></div>
                            <div className="blade"></div>
                            <div className="blade"></div>
                        </div>
                        <p>Visualizing Turbine Speed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindTurbineModal;