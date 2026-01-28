import { client } from "../client";
import { SiteResource } from "../types";

/**
 * Sites service
 */
export const siteService = {
  /**
   * Admin: Get all sites
   */
  async list(): Promise<{ data: SiteResource[] }> {
    return client.get<{ data: SiteResource[] }>("/admin/sites");
  },

  /**
   * Admin: Get site names only
   */
  async getNames(): Promise<string[]> {
    return client.get<string[]>("/admin/sites/names");
  },

  /**
   * Admin: Toggle site status
   */
  async toggleStatus(id: number): Promise<{ message: string; status: string }> {
    return client.patch<{ message: string; status: string }>(`/admin/sites/${id}/toggle-status`);
  },
};
