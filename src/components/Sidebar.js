import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/roles';

const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', permission: PERMISSIONS.NAV_DASHBOARD },
    { id: 'monitor', label: 'Monitor', permission: PERMISSIONS.NAV_MONITOR },
    { id: 'analytics', label: 'Analytics', permission: PERMISSIONS.NAV_ANALYTICS },
    { id: 'control', label: 'Control', permission: PERMISSIONS.NAV_CONTROL },
    { id: 'reports', label: 'Reports', permission: PERMISSIONS.NAV_REPORTS },
    { id: 'alerts', label: 'Alerts', permission: PERMISSIONS.NAV_ALERTS },
    { id: 'map', label: 'Campus Map', permission: PERMISSIONS.NAV_MAP },
];

const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const { hasPermission } = usePermissions();

    const accessibleNavItems = allNavItems.filter(item => hasPermission(item.permission));

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* --- MODIFIED THIS HEADER TO MATCH THE NEW DESIGN --- */}
            <div className="sidebar-header">
                <img src={process.env.PUBLIC_URL + '/cropped.jpg'} alt="Logo" className="sidebar-logo" />
                <div className="sidebar-title">
                    <span>Vidyut</span>
                    <span>Sanchalak</span>
                </div>
                <button className="sidebar-close-btn" onClick={() => setIsOpen(false)} aria-label="Close menu">&times;</button>
            </div>
            
            <nav className="sidebar-nav">
                <ul>
                    {accessibleNavItems.map(item => (
                        <li key={item.id}>
                            <button
                                className={`sidebar-btn ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <div className="user-profile">
                    <span className="user-name">{user?.name || 'Admin'}</span>
                    <button onClick={logout} className="btn btn--secondary btn--sm">Logout</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;