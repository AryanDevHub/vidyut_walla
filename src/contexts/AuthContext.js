import React, { createContext, useState, useContext } from 'react';

// --- Mock User Database ---
const MOCK_USERS = {
    admin: {
        password: 'password',
        name: 'Admin User',
        role: 'admin'
    },
    tech: {
        password: 'password',
        name: 'Technician',
        role: 'technician'
    }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundUser = MOCK_USERS[username];
                if (foundUser && foundUser.password === password) {
                    const userData = {
                        username,
                        name: foundUser.name,
                        role: foundUser.role
                    };
                    setUser(userData);
                    setIsAuthenticated(true);
                    resolve(userData);
                } else {
                    reject(new Error('Invalid credentials.'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = { isAuthenticated, user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};