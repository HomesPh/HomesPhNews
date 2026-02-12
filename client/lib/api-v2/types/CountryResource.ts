export interface CountryResource {
    id: string; // e.g., "PH"
    name: string;
    gl: string;
    h1: string; // Language code from user documentation
    ceid: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CountryPayload {
    id?: string;
    name: string;
    gl: string;
    h1: string;
    ceid: string;
    is_active: boolean;
}
