import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ROUTES } from '../utils/constants';

const SettingsScreen: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="settings">
            <header className="settings-header">
                <button onClick={() => navigate(ROUTES.DASHBOARD)}>
                    ← Back
                </button>
                <h1>Settings</h1>
                <img
                    src={isDark ? '/assets/images/logo_light.png' : '/assets/images/logo.png'}
                    alt="Logo"
                    className="header-logo"
                />
            </header>

            <main className="settings-main">
                <div className="settings-item">
                    <div className="setting-info">
                        <h3>Dark Mode</h3>
                        <p>Toggle between light and dark themes</p>
                    </div>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isDark}
                            onChange={toggleTheme}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="settings-item">
                    <div className="setting-info">
                        <h3>Change Password</h3>
                        <p>Update your account password</p>
                    </div>
                    <button
                        className="settings-button"
                        onClick={() => alert('Feature coming soon!')}
                    >
                        Change
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;