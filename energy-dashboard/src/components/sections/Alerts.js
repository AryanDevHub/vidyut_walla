import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card from '../common/Card';
import { CONFIG } from '../../services/config';

// Re-using the ControlButton from the Control section for consistency
const ControlButton = ({ initialText, asyncOnClick }) => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleClick = async () => {
        setStatus('loading');
        try {
            await asyncOnClick();
            setStatus('success');
        } catch (error) {
            console.error("Action failed:", error);
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 2000);
        }
    };

    const buttonText = {
        idle: initialText,
        loading: 'Applying...',
        success: 'Applied ✓',
        error: 'Error!',
    };

    return (
        <button
            className="btn btn--primary"
            type="button"
            onClick={handleClick}
            disabled={status === 'loading'}
        >
            {buttonText[status]}
        </button>
    );
};

const Alerts = () => {
    const { loading, alerts } = useData();

    const saveConfiguration = async () => {
        // Placeholder for an API call
        console.log('Saving alert configuration...');
        return new Promise(resolve => setTimeout(resolve, 750));
    };

    if (loading) {
        return <div>Loading Alerts...</div>;
    }

    return (
        <section id="alerts" className="section active">
             <div className="alerts-grid">
                <Card title="Active Alerts">
                    <div className="alerts-list">
                        {alerts.length > 0 ? alerts.map((alert, index) => {
                            const time = new Date(alert.timestamp).toLocaleTimeString(CONFIG.LOCALE, {
                                 hour: '2-digit', minute: '2-digit'
                            });
                            return (
                                <div key={index} className={`alert-item ${alert.type}`}>
                                    <div className="alert-header">
                                        <span className="alert-type">{alert.type.toUpperCase()}</span>
                                        <span className="alert-time">{time}</span>
                                    </div>
                                    <p className="alert-message">{alert.message}</p>
                                </div>
                            );
                        }) : <p>No active alerts.</p>}
                    </div>
                </Card>
                <Card title="Alert Configuration">
                    <form className="alert-config" onSubmit={e => e.preventDefault()}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="battery-threshold">Low Battery Threshold (%)</label>
                            <input type="number" className="form-control" id="battery-threshold" defaultValue="20" />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="load-threshold">High Load Threshold (kW)</label>
                            <input type="number" className="form-control" id="load-threshold" defaultValue="400" />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="performance-threshold">Equipment Performance Threshold (%)</label>
                            <input type="number" className="form-control" id="performance-threshold" defaultValue="85" />
                        </div>
                        <ControlButton initialText="Save Configuration" asyncOnClick={saveConfiguration} />
                    </form>
                </Card>
            </div>
        </section>
    );
};

export default Alerts;