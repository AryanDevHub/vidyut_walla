import React, { useState, useMemo } from 'react';
import Card from './common/Card';

const SimulatorSlider = ({ label, value, onChange, unit, min, max, step = 1 }) => (
    <div className="control-group">
        <label className="form-label">{label}: <strong>{value}{unit}</strong></label>
        <input
            type="range"
            className="range-control"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
        />
    </div>
);

const ScenarioSimulator = () => {
    // Base values from the campus configuration
    const baseSolarCapacity = 500; // kW
    const baseBatteryCapacity = 800; // kWh
    const baseSavings = 125480; // Monthly INR
    const baseCO2 = 8456; // Monthly kg

    const [solarCapacity, setSolarCapacity] = useState(baseSolarCapacity);
    const [batteryCapacity, setBatteryCapacity] = useState(baseBatteryCapacity);
    const [loadReduction, setLoadReduction] = useState(0);

    const results = useMemo(() => {
        // This is a simplified mock calculation for demonstration.
        // A real version would use a much more complex model.
        const solarFactor = solarCapacity / baseSolarCapacity;
        const batteryFactor = 1 + (batteryCapacity - baseBatteryCapacity) / (baseBatteryCapacity * 2); // Assume adding battery capacity has diminishing returns
        const loadFactor = 1 + loadReduction / 100;

        const estimatedSavings = baseSavings * solarFactor * batteryFactor * loadFactor;
        const estimatedCO2Reduction = baseCO2 * solarFactor * loadFactor;

        return {
            savings: estimatedSavings.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
            co2: estimatedCO2Reduction.toFixed(0),
        };
    }, [solarCapacity, batteryCapacity, loadReduction, baseSolarCapacity, baseBatteryCapacity, baseSavings, baseCO2]);

    return (
        <Card title="Strategic Scenario Simulator">
            <div className="simulator-body">
                <div className="simulator-controls">
                    <p>Model the impact of infrastructure upgrades on monthly performance.</p>
                    <SimulatorSlider label="Solar Capacity" value={solarCapacity} onChange={setSolarCapacity} unit=" kW" min={500} max={1500} step={50} />
                    <SimulatorSlider label="Battery Capacity" value={batteryCapacity} onChange={setBatteryCapacity} unit=" kWh" min={800} max={2400} step={100} />
                    <SimulatorSlider label="Campus Load Reduction" value={loadReduction} onChange={setLoadReduction} unit="%" min={0} max={30} />
                </div>
                <div className="simulator-results">
                    <h4>Estimated Monthly Impact</h4>
                    <div className="result-item">
                        <span className="result-label">Potential Savings</span>
                        <span className="result-value savings">{results.savings}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">CO₂ Reduction</span>
                        <span className="result-value co2">{results.co2} kg</span>
                    </div>
                    <button className="btn btn--secondary btn--sm" onClick={() => {
                        setSolarCapacity(baseSolarCapacity);
                        setBatteryCapacity(baseBatteryCapacity);
                        setLoadReduction(0);
                    }}>Reset Scenario</button>
                </div>
            </div>
        </Card>
    );
};

export default ScenarioSimulator;