export interface User {
    id: string,
    email: string,
    name: string,
    last_name?: string,
    avatar_url?: string,
    created_at?: Date,
    updated_at?: Date
}