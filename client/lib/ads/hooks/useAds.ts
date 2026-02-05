"use client";

import AXIOS_INSTANCE_PUBLIC from "@/lib/api-v2/public/axios-instance";
import { useEffect, useState } from "react";
import { Ad } from "../types";

interface Params {
  campaign: string;
}

export default function useAds({ campaign }: Params) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await AXIOS_INSTANCE_PUBLIC.get<{
          name: string;
          ads: Ad[];
        }>(`/ads/${campaign}`);

        setAds(response.data.ads);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ads");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, [campaign]);

  return {
    ads,
    isLoading,
    error,
  };
}