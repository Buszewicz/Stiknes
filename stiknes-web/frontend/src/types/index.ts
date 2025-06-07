export interface User {
    id: number;
    email: string;
    username: string;
    created_at?: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: string;
    updated_at?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}