import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../utils/supabase';
import { APP_CONSTANTS } from '../utils/constants';
import { hashPassword, validateEmail, validatePassword } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            const { data, error } = await supabase
                .from(APP_CONSTANTS.USERS_TABLE)
                .select()
                .eq('email', email.trim())
                .maybeSingle();
            console.log(data);
            if (error) throw error;
            if (!data) {
                throw new Error('No account found for this email');
            }

            const hashedPassword = hashPassword(password.trim());
            if (data.password !== hashedPassword) {
                throw new Error('Incorrect password. Please try again');
            }

            const userData: User = {
                id: data.id,
                email: data.email,
                username: data.username,
                created_at: data.created_at,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, username: string, password: string): Promise<void> => {
        try {
            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                throw new Error(passwordError);
            }

            if (!username.trim()) {
                throw new Error('Please enter a username');
            }

            // Check if email already exists
            const { data: existingUser, error: checkError } = await supabase
                .from(APP_CONSTANTS.USERS_TABLE)
                .select()
                .eq('email', email.trim())
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') throw checkError;
            if (existingUser) {
                throw new Error('Email already registered');
            }

            const hashedPassword = hashPassword(password.trim());
            const { data, error } = await supabase
                .from(APP_CONSTANTS.USERS_TABLE)
                .insert({
                    email: email.trim(),
                    username: username.trim(),
                    password: hashedPassword,
                })
                .select()
                .single();

            if (error) throw error;

            // Don't automatically log in after registration
            // User should login manually
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
