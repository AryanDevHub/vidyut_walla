import React from 'react';
import Card from '../common/Card';
import ForecastChart from '../charts/ForecastChart'; // Assuming this component exists
import ScenarioSimulator from '../ScenarioSimulator'; // <-- IMPORT THE NEW COMPONENT
import { useData } from '../../contexts/DataContext';
const Analytics = () => {
const { loading, recommendations, forecasts } = useData();
if (loading) {
    return <div>Loading Analytics...</div>;
}

return (
    <section id="analytics" className="section active">
        <div className="analytics-grid">
            <Card title="7-Day Generation Forecast">
                <ForecastChart data={forecasts} />
            </Card>

            <Card title="Optimization Recommendations">
                <div className="recommendations">
                    {recommendations.map((rec, index) => (
                        <div key={index} className={`recommendation-item ${rec.priority}`}>
                            <div className="recommendation-header">
                                <span className={`recommendation-priority ${rec.priority}`}>{rec.priority.toUpperCase()}</span>
                                <span className="recommendation-savings">{rec.savings}</span>
                            </div>
                            <p className="recommendation-message">{rec.message}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        
        {/* ADD THE SIMULATOR COMPONENT HERE */}
        <div style={{ marginTop: 'var(--space-24)' }}>
            <ScenarioSimulator />
        </div>
    </section>
);
};
export default Analytics;