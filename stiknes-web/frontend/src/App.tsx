import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contextst/AuthContext';
import { ThemeProvider } from './contextst/ThemeContext';
import { useAuth } from './contextst/AuthContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import DashboardScreen from './components/DashboardScreen';
import EditNoteScreen from './components/EditNoteScreen';
import ViewNoteScreen from './components/ViewNoteScreen';
import SettingsScreen from './components/SettingsScreen';
import UserInfoScreen from './components/UserInfoScreen';
import { ROUTES } from './utils/constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return user ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return user ? <Navigate to={ROUTES.DASHBOARD} /> : <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} />} />
            <Route
                path={ROUTES.LOGIN}
                element={
                    <PublicRoute>
                        <LoginScreen />
                    </PublicRoute>
                }
            />
            <Route
                path={ROUTES.REGISTER}
                element={
                    <PublicRoute>
                        <RegisterScreen />
                    </PublicRoute>
                }
            />
            <Route
                path={ROUTES.DASHBOARD}
                element={
                    <ProtectedRoute>
                        <DashboardScreen />
                    </ProtectedRoute>
                }
            />
            <Route
                path={`${ROUTES.EDIT_NOTE}/:noteId`}
                element={
                    <ProtectedRoute>
                        <EditNoteScreen />
                    </ProtectedRoute>
                }
            />
            <Route
                path={`${ROUTES.VIEW_NOTE}/:noteId`}
                element={
                    <ProtectedRoute>
                        <ViewNoteScreen />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.SETTINGS}
                element={
                    <ProtectedRoute>
                        <SettingsScreen />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.USER_INFO}
                element={
                    <ProtectedRoute>
                        <UserInfoScreen />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <AppRoutes />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
