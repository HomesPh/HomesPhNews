export interface AdMetricData {
  date: string;
  impressions: number | string;
  clicks: number | string;
  ad_unit_id?: number;
  campaign_id?: number;
}

export interface AdMetricFilters {
  period?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  from?: string; // Y-m-d
  to?: string;   // Y-m-d
  group_by?: 'date' | 'ad_unit_id' | 'campaign_id';
  sort_by?: 'date' | 'impressions' | 'clicks';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AdMetricPagination {
  current_page: number;
  data: AdMetricData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface AdMetricResponse {
  filters: {
    period: string;
    from: string;
    to: string;
    group_by: string;
    ad_unit_id: number | null;
    campaign_id: number | null;
  };
  analytics: AdMetricPagination;
}
