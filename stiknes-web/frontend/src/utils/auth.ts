import CryptoJS from 'crypto-js';

export const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString();
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
};