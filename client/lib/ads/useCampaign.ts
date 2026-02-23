import { useState, useCallback } from "react";
import { Campaign } from "./types";
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { CreateCampaignPayload, UpdateCampaignPayload } from "./useCampaigns";

interface UseCampaignReturn {
  campaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  fetchCampaign: (id: string | number) => Promise<void>;
  createCampaign: (data: CreateCampaignPayload) => Promise<Campaign>;
  updateCampaign: (id: string | number, data: UpdateCampaignPayload) => Promise<Campaign>;
}

export default function useCampaign() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<Campaign>(`/v1/admin/campaigns/${id}`);
      setCampaign(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch campaign");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (data: CreateCampaignPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AXIOS_INSTANCE_ADMIN.post<Campaign>("/v1/admin/campaigns", data);
      setCampaign(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create campaign";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCampaign = useCallback(async (id: string | number, data: UpdateCampaignPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AXIOS_INSTANCE_ADMIN.put<Campaign>(`/v1/admin/campaigns/${id}`, data);
      setCampaign(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update campaign";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    campaign,
    isLoading,
    error,
    fetchCampaign,
    createCampaign,
    updateCampaign,
  };
}
