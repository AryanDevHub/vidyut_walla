import React from 'react';
import Card from '../common/Card';
import HistoricalChart from '../charts/HistoricalChart';

const ComplianceItem = ({ title, value, target }) => (
    <div className="compliance-item">
        <h4>{title}</h4>
        <p className="compliance-value">{value}</p>
        <div className="compliance-target">Target: {target}</div>
    </div>
);

const Reports = () => {
    const handleGenerateReport = () => {
        alert('Generating report... (This is a placeholder)');
    };

    return (
        <section id="reports" className="section active">
            <div className="reports-grid">
                <Card title="Performance Reports">
                    <form className="report-options" onSubmit={e => e.preventDefault()}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="report-type">Report Type</label>
                            <select className="form-control" id="report-type" defaultValue="Monthly Report">
                                <option>Daily Summary</option>
                                <option>Weekly Analysis</option>
                                <option>Monthly Report</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="report-date">Date Range</label>
                            <input type="date" className="form-control" id="report-date" />
                        </div>
                        <button className="btn btn--primary" type="button" onClick={handleGenerateReport}>
                            Generate Report
                        </button>
                    </form>
                </Card>

                <Card title="Historical Analysis (Last 30 Days)">
                   <HistoricalChart />
                </Card>

                <Card title="Compliance Metrics">
                    <div className="compliance-grid">
                        <ComplianceItem title="Renewable Energy %" value="83.2%" target="80%" />
                        <ComplianceItem title="Grid Stability" value="99.7%" target="99%" />
                        <ComplianceItem title="Energy Efficiency" value="94.8%" target="92%" />
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default Reports;