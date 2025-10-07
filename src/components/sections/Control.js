import React, { useState } from 'react';
import Card from '../common/Card';
import apiService from '../../services/apiService';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/roles';

// A reusable button that handles its own async state
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


const Control = () => {
    const { hasPermission } = usePermissions();
    const [targetSoc, setTargetSoc] = useState(85);


    if (!hasPermission(PERMISSIONS.ACCESS_CONTROL_SYSTEMS)) {
        return (
            <Card title="Access Restricted">
                <p>Your role does not have permission to access control systems.</p>
            </Card>
        );
    }


    const applyBatterySettings = () => {
        // In a real app, you'd get the strategy value from the select input
        return apiService.updateBatterySettings({
            strategy: 'Automatic Optimization',
            target_soc: parseInt(targetSoc)
        });
    };

    const updateLoadSchedule = () => {
        // Dummy values from where form inputs would be
        return apiService.updateLoadSchedule({
            hvac_schedule: '11:00 - 13:00',
            workshop_schedule: '12:00 - 15:00'
        });
    };

    return (
        <section id="control" className="section active">
            <div className="control-grid">
                <Card title="Battery Management">
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="control-group">
                            <label className="form-label" htmlFor="battery-strategy">Charging Strategy</label>
                            <select className="form-control" id="battery-strategy" defaultValue="Automatic Optimization">
                                <option>Automatic Optimization</option>
                                <option>Solar Priority</option>
                                <option>Grid Price Based</option>
                                <option>Manual Control</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label className="form-label" htmlFor="target-soc">Target SOC (%)</label>
                            <input
                                type="range"
                                className="range-control"
                                id="target-soc"
                                min="20"
                                max="100"
                                value={targetSoc}
                                onChange={(e) => setTargetSoc(e.target.value)}
                            />
                            <span className="range-value">{targetSoc}%</span>
                        </div>
                        <ControlButton initialText="Apply Settings" asyncOnClick={applyBatterySettings} />
                    </form>
                </Card>
                 <Card title="Load Scheduling">
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="schedule-item">
                            <div className="schedule-info">
                                <h4>HVAC System</h4>
                                <p>Pre-cooling schedule</p>
                            </div>
                            <div className="schedule-control">
                                <select className="form-control" defaultValue="11:00 - 13:00">
                                    <option>11:00 - 13:00</option>
                                    <option>12:00 - 14:00</option>
                                    <option>13:00 - 15:00</option>
                                </select>
                            </div>
                        </div>
                        <div className="schedule-item">
                            <div className="schedule-info">
                                <h4>Workshop Equipment</h4>
                                <p>Heavy machinery operation</p>
                            </div>
                            <div className="schedule-control">
                                <select className="form-control" defaultValue="12:00 - 15:00">
                                    <option>12:00 - 15:00</option>
                                    <option>10:00 - 13:00</option>
                                    <option>14:00 - 17:00</option>
                                </select>
                            </div>
                        </div>
                        <ControlButton initialText="Update Schedule" asyncOnClick={updateLoadSchedule} />
                    </form>
                </Card>
            </div>
        </section>
    );
};

export default Control;