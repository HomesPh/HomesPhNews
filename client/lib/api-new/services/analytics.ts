import { client } from "../client";
import { AnalyticsResponse } from "../types";

/**
 * Analytics service
 */
export const analyticsService = {
  /**
   * Get admin analytics
   * @param period range for data (e.g. "7d", "30d")
   */
  async getAdminAnalytics(period: string = "7d"): Promise<AnalyticsResponse> {
    return client.get<AnalyticsResponse>("/admin/analytics", {
      params: { period },
    });
  },
};
