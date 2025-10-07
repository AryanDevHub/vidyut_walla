import React from 'react';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/roles';
import KpiCard from '../KpiCard';
import Card from '../common/Card';
import DashboardChart from '../charts/DashboardChart';
import AnimatedSection from '../common/AnimatedSection';
import SkeletonCard from '../common/SkeletonCard';
import EnergyFlowDiagram from '../EnergyFlowDiagram';
import FinancialPerformanceChart from '../charts/FinancialPerformaceChart';

const Dashboard = () => {
    const { loading, currentStatus, historicalData } = useData();
    const { hasPermission } = usePermissions();

    if (loading || !currentStatus) {
        return (
            <div className="dashboard-grid">
                <div className="kpi-grid">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    const { total_generation, campus_load, battery_soc, grid_power, weather } = currentStatus;

    return (
        <AnimatedSection id="dashboard" className="section active">
            <div className="dashboard-grid">
                <div className="kpi-grid" >
                    <KpiCard title="Total Generation" value={`${total_generation} kW`} change="+12.5%" isPositive />
                    <KpiCard title="Campus Load" value={`${campus_load} kW`} change="-5.2%" />
                    <KpiCard title="Battery SOC" value={`${battery_soc}%`} change="+3.1%" isPositive />
                    <KpiCard title="Grid Export" value={`${Math.abs(grid_power)} kW`} change="+18.7%" isPositive />
                </div>

                <Card title="System Status">
                    {/* Simplified for brevity. Can be componentized further. */}
                    <div className="status-grid">
                        <div className="status-item">
                           <div className="status-icon status--success"></div>
                           <div><h4>Solar Panels</h4><p>{currentStatus.solar_generation} kW</p></div>
                        </div>
                         <div className="status-item">
                           <div className="status-icon status--warning"></div>
                           <div><h4>Wind Turbine</h4><p>{currentStatus.wind_generation} kW</p></div>
                        </div>
                         <div className="status-item">
                           <div className="status-icon status--success"></div>
                           <div><h4>Battery System</h4><p>{currentStatus.battery_power > 0 ? `Charging` : `Discharging`}</p></div>
                        </div>
                         <div className="status-item">
                           <div className="status-icon status--success"></div>
                           <div><h4>Grid Connection</h4><p>{grid_power < 0 ? `Exporting` : `Importing`}</p></div>
                        </div>
                    </div>
                </Card>

                <EnergyFlowDiagram status={currentStatus} />

                <div className="performance-grid">
                    {/* Conditionally render the financial chart */}
                    {hasPermission(PERMISSIONS.VIEW_FINANCIALS) && (
                        <FinancialPerformanceChart />
                    )}
                    <Card title="Weather Conditions">
                        <div className="weather-grid">
                            <div className="weather-item"><h4>Temperature</h4><p>{weather.temperature}°C</p></div>
                            <div className="weather-item"><h4>Irradiance</h4><p>{weather.irradiance} W/m²</p></div>
                            <div className="weather-item"><h4>Wind Speed</h4><p>{weather.wind_speed} m/s</p></div>
                            <div className="weather-item"><h4>Cloud Cover</h4><p>{weather.cloud_cover}%</p></div>
                        </div>
                    </Card>

                    <Card title="Today's Performance">
                        <DashboardChart data={historicalData} />
                    </Card>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default Dashboard;