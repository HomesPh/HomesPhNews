export interface CategoryResource {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CategoryPayload {
    name: string;
    is_active: boolean;
}
