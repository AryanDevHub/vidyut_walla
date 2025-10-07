import React, { useState, useEffect } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import Header from './Header';
import Navigation from './Navigation';
import Dashboard from './sections/Dashboard';
import Monitor from './sections/Monitor';
import Analytics from './sections/Analytics';
import Control from './sections/Control';
import Reports from './sections/Reports';
import Alerts from './sections/Alerts';
import Modal from './common/Modal'; // Import the Modal
import Sidebar from './Sidebar';
import CampusMap from './sections/CampusMap'; // Import the CampusMap section

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { hasPermission } = usePermissions();
    
    // Determine the default starting page based on role
    const defaultSection = hasPermission('nav_dashboard') ? 'dashboard' : 'map';
    const [activeSection, setActiveSection] = useState(defaultSection);

    // Close the sidebar when changing sections on mobile
    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (window.innerWidth < 992) {
            setIsSidebarOpen(false);
        }
    };

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isSidebarOpen]);

    const renderSection = () => {
        // A simple guard to prevent rendering a section the user lost access to.
        if (!hasPermission(`nav_${activeSection}`)) {
            return <h4>Access Denied. Please select an available module.</h4>;
        }
        switch (activeSection) {
            case 'dashboard': return <Dashboard />;
            case 'monitor': return <Monitor />;
            case 'analytics': return <Analytics />;
            case 'control': return <Control />;
            case 'reports': return <Reports />;
            case 'alerts': return <Alerts />;
            case 'map': return <CampusMap />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={handleSectionChange}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="main-content-wrapper">
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
                <main className="main" role="main">
                    <div className="container">
                        {renderSection()}
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
            <Modal />
        </div>
    );
};

export default Layout;