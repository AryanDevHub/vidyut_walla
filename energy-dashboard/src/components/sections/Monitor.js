import React from 'react';
import { useData } from '../../contexts/DataContext';
import Card from '../common/Card';
import GenerationChart from '../charts/GenerationChart';
import LoadChart from '../charts/LoadChart';
import BatteryChart from '../charts/BatteryChart';

const Monitor = () => {
    const { loading, historicalData } = useData();

    if (loading || historicalData.length === 0) {
        return <div>Loading Monitor...</div>;
    }

    return (
        <section id="monitor" className="section active">
            <div className="monitor-grid">
                <Card title="Real-time Power Generation">
                    <GenerationChart data={historicalData} />
                </Card>
                <Card title="Campus Load Profile">
                    <LoadChart data={historicalData} />
                </Card>
                <Card title="Battery Performance">
                    <BatteryChart data={historicalData} />
                </Card>
            </div>
        </section>
    );
};

export default Monitor;