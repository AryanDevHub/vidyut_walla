import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../config/roles';

export const usePermissions = () => {
    const { user } = useAuth();

    if (!user) {
        return { hasPermission: () => false };
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    return { hasPermission, role: user.role };
};