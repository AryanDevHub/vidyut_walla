export const ROLES = {
    ADMIN: 'admin',
    TECHNICIAN: 'technician'
};

export const PERMISSIONS = {
    // List of available navigation tabs/modules
    NAV_DASHBOARD: 'nav_dashboard',
    NAV_MONITOR: 'nav_monitor',
    NAV_ANALYTICS: 'nav_analytics',
    NAV_CONTROL: 'nav_control',
    NAV_REPORTS: 'nav_reports',
    NAV_ALERTS: 'nav_alerts',
    NAV_MAP: 'nav_map',

    // Component-level permissions
    VIEW_FINANCIALS: 'view_financials',
    ACCESS_CONTROL_SYSTEMS: 'access_control_systems'
};

// Assign permissions to roles
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_MONITOR,
        PERMISSIONS.NAV_ANALYTICS,
        PERMISSIONS.NAV_CONTROL,
        PERMISSIONS.NAV_REPORTS,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.VIEW_FINANCIALS,
        PERMISSIONS.ACCESS_CONTROL_SYSTEMS
    ],
    [ROLES.TECHNICIAN]: [
        PERMISSIONS.NAV_MONITOR,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_MAP
    ]
};