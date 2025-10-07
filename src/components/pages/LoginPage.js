import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [activeRole, setActiveRole] = useState('admin');
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password'); // Pre-filled for demo
    const [campusId, setCampusId] = useState('GEC-JODHPUR-01'); // Added Campus ID
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleRoleChange = (role) => {
        setActiveRole(role);
        if (role === 'admin') {
            setUsername('admin');
        } else {
            setUsername('tech');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            setError(err.message || 'Failed to log in.');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = ['admin', 'technician'];

    return (
        <div className="login-page">
            <motion.div
                className="login-form-container"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="login-logo-container">
                    <img src={process.env.PUBLIC_URL + '/cropped.jpg'} alt="Vidyut Sanchalak Logo" className="login-logo" />
                    <h1 className="login-project-title">Vidyut Sanchalak</h1>
                </div>

                {/* The h2 tag has been removed from this section */}
                <div className="login-header">
                    <p>Please sign in to continue</p>
                </div>

                {/* Role Selector */}
                <div className="role-selector">
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`role-btn ${activeRole === role ? 'active' : ''}`}
                        >
                            {activeRole === role && (
                                <motion.div
                                    className="active-role-highlight"
                                    layoutId="activeRoleHighlight"
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="role-btn-text">{role === 'admin' ? 'Login as Admin' : 'Login as Technician'}</span>
                        </button>
                    ))}
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}
                    
                    <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{delay: 0.2}}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled
                            />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{delay: 0.3}}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.targe.value)}
                                required
                            />
                        </div>
                    </motion.div>

                     <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{delay: 0.4}}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="campusId">Campus ID</label>
                            <input
                                type="text"
                                id="campusId"
                                className="form-control"
                                value={campusId}
                                onChange={(e) => setCampusId(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{delay: 0.5}}>
                        <button type="submit" className="btn btn--primary btn--full-width" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;