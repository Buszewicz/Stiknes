export const APP_CONSTANTS = {
    USERS_TABLE: 'user',
    NOTES_TABLE: 'notes',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL|| '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    EDIT_NOTE: '/edit-note',
    VIEW_NOTE: '/view-note',
    SETTINGS: '/settings',
    USER_INFO: '/user-info',
};