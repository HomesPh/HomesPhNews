import { client } from "../client";
import { AnalyticsResponse } from "../types";

/**
 * Service for accessing administrative analytics and reports.
 */
export const analyticsService = {
  /**
   * Retrieves high-level analytics for the admin dashboard.
   * Includes visitor counts, engagement metrics, and regional data.
   * 
   * @param period The time range for the data (e.g., "7d", "30d", "1y")
   * @returns Detailed analytics report
   */
  async getAdminAnalytics(period: string = "7d"): Promise<AnalyticsResponse> {
    return client.get<AnalyticsResponse>("/admin/analytics", {
      params: { period },
    });
  },
};

