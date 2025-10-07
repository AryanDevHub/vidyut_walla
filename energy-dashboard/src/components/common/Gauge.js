import React from 'react';
import { CHART_COLORS } from '../../services/config';

const Gauge = ({ value, max = 100, label, unit = '%' }) => {
    const clampedValue = Math.max(0, Math.min(value, max));
    const percentage = clampedValue / max;
    const strokeWidth = 10;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage);

    return (
        <div className="gauge-container">
            <svg viewBox="0 0 200 100" className="gauge-svg">
                <path
                    className="gauge-background"
                    d={`M ${50 - radius + strokeWidth},100 A ${radius},${radius} 0 0 1 ${150 + radius - strokeWidth},100`}
                    strokeWidth={strokeWidth}
                />
                <path
                    className="gauge-value"
                    d={`M ${50 - radius + strokeWidth},100 A ${radius},${radius} 0 0 1 ${150 + radius - strokeWidth},100`}
                    strokeWidth={strokeWidth}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        stroke: CHART_COLORS.battery_charging
                    }}
                />
            </svg>
            <div className="gauge-text">
                <span className="gauge-text-value">{clampedValue.toFixed(1)}{unit}</span>
                <span className="gauge-text-label">{label}</span>
            </div>
        </div>
    );
};

export default Gauge;