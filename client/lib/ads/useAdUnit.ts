import { useState, useCallback } from "react";
import { AdUnit } from "./types";
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { CreateAdUnitPayload, UpdateAdUnitPayload } from "./useAdUnits";

interface UseAdUnitReturn {
  adUnit: AdUnit | null;
  isLoading: boolean;
  error: string | null;
  fetchAdUnit: (id: string | number) => Promise<void>;
  createAdUnit: (data: CreateAdUnitPayload) => Promise<AdUnit>;
  updateAdUnit: (id: string | number, data: UpdateAdUnitPayload) => Promise<AdUnit>;
}

export default function useAdUnit() {
  const [adUnit, setAdUnit] = useState<AdUnit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdUnit = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<AdUnit>(`/v1/admin/ad-units/${id}`);
      setAdUnit(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch ad unit");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAdUnit = useCallback(async (data: CreateAdUnitPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AXIOS_INSTANCE_ADMIN.post<AdUnit>("/v1/admin/ad-units", data);
      setAdUnit(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create ad unit";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAdUnit = useCallback(async (id: string | number, data: UpdateAdUnitPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AXIOS_INSTANCE_ADMIN.put<AdUnit>(`/v1/admin/ad-units/${id}`, data);
      setAdUnit(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update ad unit";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    adUnit,
    isLoading,
    error,
    fetchAdUnit,
    createAdUnit,
    updateAdUnit,
  };
}
