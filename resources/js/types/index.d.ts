export interface User {
    id: number;
    user_name: string;
    role: string;
    email: string;
    email_verified_at?: string;
}

interface ApiClient {
    id: number;
    key: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    apiClient?: ApiClient | null;
};
