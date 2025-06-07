/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    // Add other VITE_ prefixed environment variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}