import React from 'react';
import Card from './common/Card';
import { useModal } from '../contexts/ModalContext';

const KpiCard = ({ title, value, change, isPositive }) => {
    const { openModal } = useModal();
    const changeClass = isPositive ? 'positive' : 'negative';

    const handleCardClick = () => {
        openModal({
            title: `${title} Details`,
            body: (
                <div>
                    <h4>Current Value: {value}</h4>
                    <p>This is a detailed view of the {title.toLowerCase()} metric, showing trends and historical data.</p>
                </div>
            )
        });
    };

    return (
        <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <Card className="kpi-card">
                <h3>{title}</h3>
                <div className="kpi-value">{value}</div>
                <div className={`kpi-change ${changeClass}`}>{change}</div>
            </Card>
        </div>
    );
};

export default KpiCard;