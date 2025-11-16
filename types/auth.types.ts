export interface User {
    id: string,
    email: string,
    name: string,
    lastName?: string,
    avatar_url?: string,
    created_at?: Date,
    updated_at?: Date
}