import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ROUTES } from '../utils/constants';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log(email);
            console.log(password);
            await login(email, password);
            navigate(ROUTES.DASHBOARD);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo-container">
                    <img
                        src={isDark ? '../assets/images/logo_light.png' : '../assets/images/logo.png'}
                        alt="Logo"
                        className="logo"

                    />
                </div>

                <h1>Login</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? <div className="spinner-small"></div> : 'Login'}
                    </button>
                </form>

                <p>
                    Don't have an account? <Link to={ROUTES.REGISTER}>Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;