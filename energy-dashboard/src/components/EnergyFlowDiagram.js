import React from 'react';
import Card from './common/Card';
import { motion } from 'framer-motion';
const FlowNode = ({ label, value, icon, className }) => (
  <div className={`flow-node ${className}`}>
    <div className="flow-icon">{icon}</div>
    <div className="flow-label">{label}</div>
    <div className="flow-value">{value.toFixed(1)} kW</div>
  </div>
);
const FlowLine = ({ power, duration }) => {
if (power < 1) return <div className="flow-line static" />;
return (
<div className="flow-line animated">
<motion.div
className="flow-dot"
animate={{ x: [0, 95] }}
transition={{
duration,
repeat: Infinity,
ease: "linear"
}}
/>
</div>
);
};
const EnergyFlowDiagram = ({ status }) => {
const { solar_generation, wind_generation, battery_power, grid_power, campus_load } = status;
const isGridImport = grid_power > 0;
const isBatteryCharging = battery_power > 0;
return (
    <Card title="Live Energy Flow">
        <div className="energy-flow-diagram">
            {/* Sources Column */}
            <div className="flow-column">
                <FlowNode label="Solar" value={solar_generation} icon="☀️" className="solar" />
                <FlowNode label="Wind" value={wind_generation} icon="💨" className="wind" />
                <FlowNode label="Grid Import" value={isGridImport ? grid_power : 0} icon="🏢" className="grid" />
            </div>

            {/* Connectors Column */}
            <div className="flow-column connectors">
                <FlowLine power={solar_generation} duration={2} />
                <FlowLine power={wind_generation} duration={3} />
                <FlowLine power={isGridImport ? grid_power : 0} duration={2.5} />
            </div>

            {/* Center Node */}
            <div className="flow-column">
                 <FlowNode label="Campus" value={campus_load} icon="🏫" className="campus" />
            </div>

            {/* Connectors Column */}
            <div className="flow-column connectors">
                <FlowLine power={campus_load} duration={2} />
                <FlowLine power={isBatteryCharging ? battery_power : -battery_power} duration={2.5} />
                <FlowLine power={!isGridImport ? -grid_power : 0} duration={3} />
            </div>
            
            {/* Sinks Column */}
            <div className="flow-column">
                 <FlowNode label="Building Load" value={campus_load} icon="💡" className="load" />
                 <FlowNode label={isBatteryCharging ? "Battery Charging" : "Battery Discharging"} value={Math.abs(battery_power)} icon="🔋" className={isBatteryCharging ? 'battery-charge' : 'battery-discharge'} />
                 <FlowNode label="Grid Export" value={!isGridImport ? -grid_power : 0} icon="⚡️" className="grid" />
            </div>
        </div>
    </Card>
);
};
export default EnergyFlowDiagram;
