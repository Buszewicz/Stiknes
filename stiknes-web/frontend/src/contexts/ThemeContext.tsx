import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme) {
            const isDarkMode = JSON.parse(storedTheme);
            setIsDark(isDarkMode);
            document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('darkMode', JSON.stringify(newTheme));
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    };

    const value: ThemeContextType = {
        isDark,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};