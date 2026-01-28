import { client } from "../client";
import { SiteResource } from "../types";

/**
 * Service for managing sites and domains.
 * Primarily used for administrative oversight of publishing targets.
 */
export const siteService = {
  /**
   * [Admin] Retrieves a list of all sites with full resource details.
   * 
   * @returns List of site resources
   */
  async list(): Promise<{ data: SiteResource[] }> {
    return client.get<{ data: SiteResource[] }>("/admin/sites");
  },

  /**
   * [Admin] Retrieves only the names of available sites.
   * Useful for dropdown menus or simple filtering.
   * 
   * @returns Array of site names
   */
  async getNames(): Promise<string[]> {
    return client.get<string[]>("/admin/sites/names");
  },

  /**
   * [Admin] Toggles the active status of a site.
   * 
   * @param id The numeric identifier of the site
   * @returns Confirmation message and the new status
   */
  async toggleStatus(id: number): Promise<{ message: string; status: string }> {
    return client.patch<{ message: string; status: string }>(`/admin/sites/${id}/toggle-status`);
  },
};

