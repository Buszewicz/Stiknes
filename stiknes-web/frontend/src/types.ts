export interface User {
    id: string;
    email: string;
    username: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user?: Pick<User, 'id' | 'email' | 'username'>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string>;
}