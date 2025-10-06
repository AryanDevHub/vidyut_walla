// Campus Energy Management System
class EnergyManagementSystem {
    constructor() {
        this.data = {
            campus_info: {
                name: "Government Engineering College, Jodhpur",
                location: "Rajasthan, India",
                solar_capacity: "500 kW",
                wind_capacity: "100 kW",
                battery_capacity: "800 kWh",
                peak_demand: "450 kW"
            },
            current_status: {
                timestamp: "2025-09-27T16:33:00+05:30",
                solar_generation: 385.5,
                wind_generation: 23.8,
                total_generation: 409.3,
                campus_load: 342.7,
                battery_soc: 78.5,
                battery_power: 25.2,
                grid_power: -41.4,
                weather: {
                    temperature: 32.5,
                    irradiance: 785,
                    wind_speed: 4.2,
                    cloud_cover: 15
                }
            },
            historical_data: [
                {"time": "06:00", "solar": 0, "wind": 15, "load": 180, "battery": 65},
                {"time": "07:00", "solar": 45, "wind": 18, "load": 220, "battery": 68},
                {"time": "08:00", "solar": 125, "wind": 22, "load": 280, "battery": 72},
                {"time": "09:00", "solar": 245, "wind": 28, "load": 320, "battery": 75},
                {"time": "10:00", "solar": 335, "wind": 31, "load": 350, "battery": 77},
                {"time": "11:00", "solar": 398, "wind": 35, "load": 380, "battery": 78},
                {"time": "12:00", "solar": 445, "wind": 38, "load": 395, "battery": 82},
                {"time": "13:00", "solar": 465, "wind": 42, "load": 405, "battery": 85},
                {"time": "14:00", "solar": 425, "wind": 38, "load": 385, "battery": 83},
                {"time": "15:00", "solar": 398, "wind": 32, "load": 365, "battery": 80},
                {"time": "16:00", "solar": 385, "wind": 24, "load": 343, "battery": 78}
            ],
            forecasts: [
                {"day": "Today", "solar_max": 465, "wind_avg": 32, "load_peak": 405},
                {"day": "Tomorrow", "solar_max": 445, "wind_avg": 28, "load_peak": 395},
                {"day": "Day 3", "solar_max": 385, "wind_avg": 22, "load_peak": 380},
                {"day": "Day 4", "solar_max": 325, "wind_avg": 35, "load_peak": 375},
                {"day": "Day 5", "solar_max": 475, "wind_avg": 38, "load_peak": 410},
                {"day": "Day 6", "solar_max": 485, "wind_avg": 42, "load_peak": 420},
                {"day": "Day 7", "solar_max": 445, "wind_avg": 35, "load_peak": 395}
            ],
            optimization_recommendations: [
                {
                    type: "battery",
                    priority: "high",
                    message: "Optimal battery charging window: 11:00-14:00 today due to excess solar generation",
                    savings: "₹2,450"
                },
                {
                    type: "load",
                    priority: "medium", 
                    message: "Schedule workshop activities for 12:00-15:00 when renewable generation peaks",
                    savings: "₹1,850"
                },
                {
                    type: "hvac",
                    priority: "medium",
                    message: "Pre-cool buildings during peak solar hours (11:00-13:00) to reduce evening grid usage",
                    savings: "₹3,200"
                }
            ],
            alerts: [
                {
                    type: "warning",
                    message: "Wind generation below forecast - maintenance check recommended for turbine",
                    timestamp: "2025-09-27T14:15:00+05:30"
                },
                {
                    type: "info",
                    message: "Battery system performing optimally - 95.2% efficiency over last 24 hours",
                    timestamp: "2025-09-27T10:30:00+05:30"
                }
            ]
        };
        
        this.charts = {};
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
        this.updateTime();
        this.updateDashboard();
        this.populateRecommendations();
        this.populateAlerts();
        this.setupFormHandlers();
        
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initCharts();
            this.startRealTimeUpdates();
        }, 100);
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.getAttribute('data-section');
                
                // Update active nav button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show target section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Refresh charts if needed
                setTimeout(() => this.refreshCharts(), 200);
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('detail-modal');
        const closeBtn = document.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Add click handlers for modal triggers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.kpi-card') || 
                e.target.closest('.status-item') || 
                e.target.closest('.weather-item') ||
                e.target.closest('.savings-item') ||
                e.target.closest('.carbon-item')) {
                this.showDetailModal(e.target.closest('.kpi-card, .status-item, .weather-item, .savings-item, .carbon-item'));
            }
        });
    }

    updateTime() {
        const timeElement = document.getElementById('current-time');
        const now = new Date();
        timeElement.textContent = now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        setTimeout(() => this.updateTime(), 60000);
    }

    initCharts() {
        // Dashboard chart
        this.initDashboardChart();
        
        // Monitor charts
        this.initGenerationChart();
        this.initLoadChart();
        this.initBatteryChart();
        
        // Analytics charts
        this.initForecastChart();
        
        // Reports chart
        this.initHistoricalChart();
    }

    initDashboardChart() {
        const ctx = document.getElementById('dashboard-chart');
        if (!ctx) return;

        this.charts.dashboard = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.historical_data.slice(-6).map(d => d.time),
                datasets: [{
                    label: 'Solar Generation',
                    data: this.data.historical_data.slice(-6).map(d => d.solar),
                    borderColor: '#1FB8CD',
                    backgroundColor: '#1FB8CD20',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Campus Load',
                    data: this.data.historical_data.slice(-6).map(d => d.load),
                    borderColor: '#FFC185',
                    backgroundColor: '#FFC18520',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Power (kW)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });
    }

    initGenerationChart() {
        const ctx = document.getElementById('generation-chart');
        if (!ctx) return;

        this.charts.generation = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.historical_data.map(d => d.time),
                datasets: [{
                    label: 'Solar Generation',
                    data: this.data.historical_data.map(d => d.solar),
                    borderColor: '#1FB8CD',
                    backgroundColor: '#1FB8CD40',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Wind Generation',
                    data: this.data.historical_data.map(d => d.wind),
                    borderColor: '#B4413C',
                    backgroundColor: '#B4413C40',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Generation (kW)'
                        }
                    }
                }
            }
        });
    }

    initLoadChart() {
        const ctx = document.getElementById('load-chart');
        if (!ctx) return;

        this.charts.load = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.historical_data.map(d => d.time),
                datasets: [{
                    label: 'Campus Load',
                    data: this.data.historical_data.map(d => d.load),
                    borderColor: '#FFC185',
                    backgroundColor: '#FFC18560',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Load (kW)'
                        }
                    }
                }
            }
        });
    }

    initBatteryChart() {
        const ctx = document.getElementById('battery-chart');
        if (!ctx) return;

        // Generate battery power data based on SOC changes
        const batteryPowerData = this.data.historical_data.map((d, i, arr) => {
            if (i === 0) return 0;
            const socDiff = d.battery - arr[i-1].battery;
            return socDiff * 16; // Approximate power based on SOC change
        });

        this.charts.battery = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.historical_data.map(d => d.time),
                datasets: [{
                    label: 'Battery Power (kW)',
                    data: batteryPowerData,
                    backgroundColor: batteryPowerData.map(v => v >= 0 ? '#5D878F' : '#DB4545'),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Power (kW, +Charging/-Discharging)'
                        }
                    }
                }
            }
        });
    }

    initForecastChart() {
        const ctx = document.getElementById('forecast-chart');
        if (!ctx) return;

        this.charts.forecast = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.forecasts.map(f => f.day),
                datasets: [{
                    label: 'Solar Max (kW)',
                    data: this.data.forecasts.map(f => f.solar_max),
                    backgroundColor: '#1FB8CD',
                    borderRadius: 4
                }, {
                    label: 'Wind Avg (kW)',
                    data: this.data.forecasts.map(f => f.wind_avg),
                    backgroundColor: '#B4413C',
                    borderRadius: 4
                }, {
                    label: 'Load Peak (kW)',
                    data: this.data.forecasts.map(f => f.load_peak),
                    backgroundColor: '#FFC185',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Power (kW)'
                        }
                    }
                }
            }
        });
    }

    initHistoricalChart() {
        const ctx = document.getElementById('historical-chart');
        if (!ctx) return;

        // Generate sample historical data for the last 30 days
        const historicalData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            historicalData.push({
                date: date.toLocaleDateString('en-IN', {day: 'numeric', month: 'short'}),
                generation: 380 + Math.random() * 120,
                consumption: 320 + Math.random() * 80,
                savings: 3500 + Math.random() * 2000
            });
        }

        this.charts.historical = new Chart(ctx, {
            type: 'line',
            data: {
                labels: historicalData.map(d => d.date),
                datasets: [{
                    label: 'Generation (kWh)',
                    data: historicalData.map(d => d.generation),
                    borderColor: '#1FB8CD',
                    backgroundColor: '#1FB8CD20',
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Consumption (kWh)',
                    data: historicalData.map(d => d.consumption),
                    borderColor: '#FFC185',
                    backgroundColor: '#FFC18520',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Energy (kWh)'
                        }
                    }
                }
            }
        });
    }

    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    updateDashboard() {
        const status = this.data.current_status;
        
        // Update KPI values
        document.getElementById('total-generation').textContent = `${status.total_generation} kW`;
        document.getElementById('campus-load').textContent = `${status.campus_load} kW`;
        document.getElementById('battery-soc').textContent = `${status.battery_soc}%`;
        document.getElementById('grid-power').textContent = `${Math.abs(status.grid_power)} kW`;
        
        // Update system status
        document.getElementById('solar-status').textContent = `${status.solar_generation} kW (${Math.round(status.solar_generation / 500 * 100)}% capacity)`;
        document.getElementById('wind-status').textContent = `${status.wind_generation} kW (${Math.round(status.wind_generation / 100 * 100)}% capacity)`;
        document.getElementById('battery-status').textContent = status.battery_power > 0 ? `Charging at ${status.battery_power} kW` : `Discharging at ${Math.abs(status.battery_power)} kW`;
        document.getElementById('grid-status').textContent = status.grid_power < 0 ? `Exporting ${Math.abs(status.grid_power)} kW` : `Importing ${status.grid_power} kW`;
        
        // Update weather
        document.getElementById('temperature').textContent = `${status.weather.temperature}°C`;
        document.getElementById('irradiance').textContent = `${status.weather.irradiance} W/m²`;
        document.getElementById('wind-speed').textContent = `${status.weather.wind_speed} m/s`;
        document.getElementById('cloud-cover').textContent = `${status.weather.cloud_cover}%`;
    }

    populateRecommendations() {
        const container = document.getElementById('recommendations');
        if (!container) return;

        container.innerHTML = '';
        
        this.data.optimization_recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = `recommendation-item ${rec.priority}`;
            item.innerHTML = `
                <div class="recommendation-header">
                    <span class="recommendation-priority ${rec.priority}">${rec.priority.toUpperCase()}</span>
                    <span class="recommendation-savings">${rec.savings}</span>
                </div>
                <p class="recommendation-message">${rec.message}</p>
            `;
            container.appendChild(item);
        });
    }

    populateAlerts() {
        const container = document.getElementById('alerts-list');
        if (!container) return;

        container.innerHTML = '';
        
        this.data.alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = `alert-item ${alert.type}`;
            
            const time = new Date(alert.timestamp);
            const timeString = time.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            item.innerHTML = `
                <div class="alert-header">
                    <span class="alert-type">${alert.type.toUpperCase()}</span>
                    <span class="alert-time">${timeString}</span>
                </div>
                <p class="alert-message">${alert.message}</p>
            `;
            container.appendChild(item);
        });
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.simulateRealTimeData();
            this.updateDashboard();
            this.updateCharts();
        }, 5000);
    }

    simulateRealTimeData() {
        const status = this.data.current_status;
        
        // Simulate small fluctuations in real-time data
        status.solar_generation += (Math.random() - 0.5) * 10;
        status.wind_generation += (Math.random() - 0.5) * 3;
        status.campus_load += (Math.random() - 0.5) * 8;
        status.battery_soc += (Math.random() - 0.5) * 0.5;
        
        // Keep values within realistic bounds
        status.solar_generation = Math.max(0, Math.min(500, status.solar_generation));
        status.wind_generation = Math.max(0, Math.min(100, status.wind_generation));
        status.campus_load = Math.max(200, Math.min(500, status.campus_load));
        status.battery_soc = Math.max(20, Math.min(100, status.battery_soc));
        
        // Recalculate derived values
        status.total_generation = status.solar_generation + status.wind_generation;
        status.grid_power = status.campus_load - status.total_generation - status.battery_power;
        
        // Update weather slightly
        status.weather.temperature += (Math.random() - 0.5) * 0.5;
        status.weather.wind_speed += (Math.random() - 0.5) * 0.3;
        status.weather.irradiance += (Math.random() - 0.5) * 20;
        
        // Keep weather in realistic bounds
        status.weather.temperature = Math.max(25, Math.min(40, status.weather.temperature));
        status.weather.wind_speed = Math.max(0, Math.min(15, status.weather.wind_speed));
        status.weather.irradiance = Math.max(0, Math.min(1000, status.weather.irradiance));
        
        // Round values for display
        Object.keys(status).forEach(key => {
            if (typeof status[key] === 'number') {
                status[key] = Math.round(status[key] * 10) / 10;
            }
        });
        
        Object.keys(status.weather).forEach(key => {
            if (typeof status.weather[key] === 'number') {
                status.weather[key] = Math.round(status.weather[key] * 10) / 10;
            }
        });
    }

    updateCharts() {
        // Update dashboard chart with latest data point
        if (this.charts.dashboard) {
            const currentTime = new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit', hour12: false});
            const chart = this.charts.dashboard;
            
            // Add new data point
            chart.data.labels.push(currentTime);
            chart.data.datasets[0].data.push(this.data.current_status.solar_generation);
            chart.data.datasets[1].data.push(this.data.current_status.campus_load);
            
            // Remove old data points (keep last 10)
            if (chart.data.labels.length > 10) {
                chart.data.labels.shift();
                chart.data.datasets.forEach(dataset => {
                    dataset.data.shift();
                });
            }
            
            chart.update('none');
        }
    }

    setupFormHandlers() {
        // Range input updates
        const rangeInputs = document.querySelectorAll('.range-control');
        rangeInputs.forEach(range => {
            const valueSpan = range.nextElementSibling;
            range.addEventListener('input', (e) => {
                if (valueSpan) {
                    valueSpan.textContent = `${e.target.value}%`;
                }
            });
        });

        // Button click handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn--primary')) {
                const button = e.target;
                const originalText = button.textContent;
                
                // Show loading state
                button.textContent = 'Applying...';
                button.disabled = true;
                
                // Simulate async operation
                setTimeout(() => {
                    button.textContent = 'Applied ✓';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 1500);
                }, 1000);
            }
        });
    }

    showDetailModal(element) {
        const modal = document.getElementById('detail-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        // Extract information from clicked element
        const titleElement = element.querySelector('h3, h4');
        const valueElement = element.querySelector('.kpi-value, .savings-value, .carbon-value, p');
        
        const titleText = titleElement ? titleElement.textContent : 'System Details';
        const valueText = valueElement ? valueElement.textContent : '';
        
        // Determine content based on element type
        let detailContent = '';
        
        if (element.classList.contains('kpi-card')) {
            const metricName = titleText.toLowerCase();
            detailContent = `
                <div class="detail-content">
                    <h4>Current Value: ${valueText}</h4>
                    <p>Real-time monitoring of ${titleText.toLowerCase()} across the campus energy system.</p>
                    <div class="detail-metrics">
                        <div class="metric">
                            <h5>24h Average</h5>
                            <p>${metricName.includes('generation') ? '378 kW' : metricName.includes('load') ? '335 kW' : metricName.includes('battery') ? '76.8%' : '38.2 kW'}</p>
                        </div>
                        <div class="metric">
                            <h5>Peak Today</h5>
                            <p>${metricName.includes('generation') ? '465 kW' : metricName.includes('load') ? '405 kW' : metricName.includes('battery') ? '85.2%' : '45.8 kW'}</p>
                        </div>
                        <div class="metric">
                            <h5>Efficiency</h5>
                            <p>${Math.round(88 + Math.random() * 8)}%</p>
                        </div>
                    </div>
                    <div class="trend-info">
                        <h5>Recent Trend</h5>
                        <p>↗️ Increasing over the last 2 hours</p>
                    </div>
                </div>
            `;
        } else if (element.classList.contains('weather-item')) {
            detailContent = `
                <div class="detail-content">
                    <h4>Current ${titleText}: ${valueText}</h4>
                    <p>Weather conditions directly impact renewable energy generation efficiency.</p>
                    <div class="weather-impact">
                        <h5>Impact on Generation</h5>
                        <p>Current conditions are ${Math.random() > 0.5 ? 'favorable' : 'moderate'} for renewable energy production.</p>
                    </div>
                    <div class="forecast-snippet">
                        <h5>Next 6 Hours</h5>
                        <p>Expected to ${Math.random() > 0.5 ? 'improve' : 'remain stable'} based on weather forecast.</p>
                    </div>
                </div>
            `;
        } else if (element.classList.contains('savings-item') || element.classList.contains('carbon-item')) {
            const isFinancial = element.classList.contains('savings-item');
            detailContent = `
                <div class="detail-content">
                    <h4>${titleText}: ${valueText}</h4>
                    <p>${isFinancial ? 'Financial savings achieved through renewable energy generation and smart load management.' : 'Environmental impact reduction through clean energy usage.'}</p>
                    <div class="breakdown">
                        <h5>Breakdown</h5>
                        <p>Solar contribution: ${isFinancial ? '68%' : '72%'}</p>
                        <p>Wind contribution: ${isFinancial ? '15%' : '12%'}</p>
                        <p>Load optimization: ${isFinancial ? '17%' : '16%'}</p>
                    </div>
                    <div class="projection">
                        <h5>Monthly Projection</h5>
                        <p>${isFinancial ? '₹1,42,500 estimated savings' : '9,250 kg CO₂ reduction expected'}</p>
                    </div>
                </div>
            `;
        } else {
            detailContent = `
                <div class="detail-content">
                    <h4>${titleText}</h4>
                    <p>${valueText}</p>
                    <p>System component operating within normal parameters.</p>
                </div>
            `;
        }
        
        title.textContent = titleText;
        body.innerHTML = detailContent;
        
        modal.classList.remove('hidden');
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.energySystem = new EnergyManagementSystem();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.energySystem) {
        window.energySystem.destroy();
    }
});