import React from 'react';

const Navigation = ({ activeSection, setActiveSection }) => {
    const navItems = ['dashboard', 'monitor', 'analytics', 'control', 'reports', 'alerts'];

    return (
        <nav className="nav" role="navigation">
            <div className="container">
                <ul className="nav-list">
                    {navItems.map(item => (
                        <li key={item}>
                            <button
                                className={`nav-btn ${activeSection === item ? 'active' : ''}`}
                                onClick={() => setActiveSection(item)}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;