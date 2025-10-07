import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Card from '../common/Card';
import 'leaflet/dist/leaflet.css';
import { useModal } from '../../contexts/ModalContext';
import SolarPanelModal from '../modals/SolarPanelModal';
import BuildingLoadModal from '../modals/BuildingLoadModal';
import WindTurbineModal from '../modals/WindTurbineModal';
import BatteryBankModal from '../modals/BatteryBankModal';

// --- Corrected Mock Data for Points of Interest (POIs) on Campus ---
const POI_DATA = [
    { id: 1, type: 'solar', name: 'Solar Panel Array 1 (Main Building)', position: [26.4725, 73.1135], status: 'operational', details: 'Capacity: 250 kW, Output: 180.5 kW' },
    { id: 2, type: 'solar', name: 'Solar Panel Array 2 (Hostels)', position: [26.4750, 73.1150], status: 'operational', details: 'Capacity: 150 kW, Output: 110.2 kW' },
    { id: 3, type: 'wind', name: 'Wind Turbine A', position: [26.4700, 73.1180], status: 'warning', details: 'Output below forecast. Check required.' },
    { id: 4, type: 'battery', name: 'Main Battery Storage', position: [26.4715, 73.1120], status: 'operational', details: 'SOC: 78.5%, Charging at 25.2 kW' },
    { id: 5, type: 'building', name: 'Academic Building', position: [26.4730, 73.1125], status: 'high_load', details: 'Current Load: 150.8 kW' },
    { id: 6, type: 'building', name: 'Student Hostels', position: [26.4755, 73.1145], status: 'normal_load', details: 'Current Load: 85.3 kW' },
];

// --- Function to create custom, styled map markers ---
const createCustomIcon = (poi) => {
    return L.divIcon({
        className: `custom-marker-icon ${poi.type} ${poi.status}`,
        html: `<div class="pulsing-dot"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const CampusMap = () => {
    const campusCenter = [26.4730, 73.1140];
    const { openModal } = useModal();

    const handleDetailsClick = (poi) => {
        let modalContent;
        // Decide which modal to render based on the asset type
        switch (poi.type) {
            case 'solar':
                modalContent = <SolarPanelModal poiData={poi} />;
                break;
            case 'building':
                modalContent = <BuildingLoadModal poiData={poi} />;
                break;
            case 'wind':
                modalContent = <WindTurbineModal poiData={poi} />;
                break;
            case 'battery':
                modalContent = <BatteryBankModal poiData={poi} />;
                break;
            default:
                modalContent = <p>{poi.details}</p>; // Fallback
        }

        openModal({ body: modalContent });
    };

    return (
        <section id="campus-map" className="section active">
            <Card title="Interactive Campus Map">
                <p style={{marginBottom: 'var(--space-16)'}}>
                    View real-time status of energy assets across the campus. Click on a marker for more details.
                </p>
                <MapContainer center={campusCenter} zoom={16} scrollWheelZoom={true} style={{ height: '60vh', width: '100%', borderRadius: 'var(--radius-base)' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {POI_DATA.map(poi => (
                        <Marker key={poi.id} position={poi.position} icon={createCustomIcon(poi)}>
                            <Popup>
                                <h4>{poi.name}</h4>
                                <p><strong>Status:</strong> <span className={`status-text ${poi.status}`}>{poi.status.replace('_', ' ')}</span></p>
                                
                                {/* Show button for all asset types that have a modal */}
                                {['solar', 'building', 'wind', 'battery'].includes(poi.type) ? (
                                    <button className="btn btn--primary btn--sm" onClick={() => handleDetailsClick(poi)}>
                                        More Details
                                    </button>
                                ) : (
                                    <p>{poi.details}</p>
                                )}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Card>
        </section>
    );
};

export default CampusMap;