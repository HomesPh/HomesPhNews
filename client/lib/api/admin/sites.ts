import api from "@/lib/api/axios";

export interface Site {
    id: number;
    name: string;
    domain: string;
    status: 'active' | 'suspended';
    image: string;
    contact: string;
    description: string;
    categories: string[];
    requested: string;
    articles: number;
    monthlyViews: string;
    contact_name?: string;
    contact_email?: string;
    apiKey?: string;
}

export interface SitesResponse {
    data: Site[];
    counts: {
        all: number;
        active: number;
        suspended: number;
    };
}

/**
 * Fetch all sites
 */
export async function getSites(params?: { status?: string; search?: string }): Promise<SitesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    const response = await api.get<SitesResponse>(`/admin/sites?${searchParams.toString()}`);
    return response.data;
}

/**
 * Create a new site
 */
export async function createSite(data: any): Promise<Site> {
    const response = await api.post('/admin/sites', data);
    return response.data;
}

/**
 * Update a site
 */
export async function updateSite(id: number, data: any): Promise<Site> {
    const response = await api.put(`/admin/sites/${id}`, data);
    return response.data;
}

/**
 * Delete a site
 */
export async function deleteSite(id: number): Promise<void> {
    await api.delete(`/admin/sites/${id}`);
}

/**
 * Toggle site status
 */
export async function toggleSiteStatus(id: number): Promise<void> {
    await api.patch(`/admin/sites/${id}/toggle-status`);
}

/**
 * Get simple list of site names
 */
export async function getSiteNames(): Promise<string[]> {
    const response = await api.get<string[]>('/admin/sites/names');
    return response.data;
}

/**
 * Refresh site API key
 */
export async function refreshSiteKey(id: number): Promise<Site> {
    const response = await api.patch(`/admin/sites/${id}/refresh-key`);
    return response.data;
}
