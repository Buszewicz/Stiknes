import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../utils/supabase';
import { APP_CONSTANTS, ROUTES } from '../utils/constants';
import { User } from '../types';

const UserInfoScreen: React.FC = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const fetchUserData = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from(APP_CONSTANTS.USERS_TABLE)
                .select()
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setUserData(data);
        } catch (error) {
            console.error('Error loading user data:', error);
            alert('Error loading user data');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="error-state">
                <p>User data not found</p>
                <button onClick={() => navigate(ROUTES.DASHBOARD)}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="user-info">
            <header className="user-info-header">
                <button onClick={() => navigate(ROUTES.DASHBOARD)}>
                    ← Back
                </button>
                <h1>User Info</h1>
                <img
                    src={isDark ? '/assets/images/logo_light.png' : '/assets/images/logo.png'}
                    alt="Logo"
                    className="header-logo"
                />
            </header>

            <main className="user-info-main">
                <div className="user-avatar">
                    <div className="avatar-circle">
                        👤
                    </div>
                </div>

                <div className="user-details">
                    <div className="user-field">
                        <label>Username:</label>
                        <span>{userData.username}</span>
                    </div>

                    <div className="user-field">
                        <label>Email:</label>
                        <span>{userData.email}</span>
                    </div>

                    <div className="user-field">
                        <label>Member since:</label>
                        <span>
              {userData.created_at
                  ? new Date(userData.created_at).toLocaleDateString()
                  : 'Unknown'
              }
            </span>
                    </div>
                </div>

                <button
                    className="edit-profile-button"
                    onClick={() => alert('Profile editing coming soon!')}
                >
                    Edit Profile
                </button>
            </main>
        </div>
    );
};

export default UserInfoScreen;