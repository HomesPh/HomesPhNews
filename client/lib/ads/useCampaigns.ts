"use client";

import { useReducer, useEffect, useCallback } from "react";
import { Campaign } from "./types";
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";

// ============================================================================
// Types
// ============================================================================

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface CampaignResponse {
  data: Campaign[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface CreateCampaignPayload {
  name: string;
  status: "active" | "paused" | "archived";
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  target_url: string;
  headline: string | null;
  banner_image_urls: string[] | null;
  ad_units?: number[] | null;
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

interface State {
  data: Campaign[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: CampaignResponse }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SET_PAGE"; payload: number };

const initialState: State = {
  data: [],
  pagination: null,
  isLoading: false,
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        pagination: {
          current_page: action.payload.current_page,
          from: action.payload.from,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          to: action.payload.to,
          total: action.payload.total,
        },
      };

    case "FETCH_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    case "SET_PAGE":
      return {
        ...state,
        pagination: state.pagination ? { ...state.pagination, current_page: action.payload } : null
      };

    default:
      return state;
  }
};

/**
 * Hook for fetching campaigns (formerly Ads) on the admin side.
 */
export default function useCampaigns() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCampaigns = useCallback(async (page: number = 1) => {
    dispatch({ type: "FETCH_INIT" });
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<CampaignResponse>("/v1/admin/campaigns", {
        params: { page },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch campaigns";
      dispatch({ type: "FETCH_FAILURE", payload: errorMessage });
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCampaigns(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPage = useCallback(
    (page: number) => {
      fetchCampaigns(page);
    },
    [fetchCampaigns]
  );

  const nextPage = useCallback(() => {
    if (state.pagination && state.pagination.current_page < state.pagination.last_page) {
      fetchCampaigns(state.pagination.current_page + 1);
    }
  }, [fetchCampaigns, state.pagination]);

  const prevPage = useCallback(() => {
    if (state.pagination && state.pagination.current_page > 1) {
      fetchCampaigns(state.pagination.current_page - 1);
    }
  }, [fetchCampaigns, state.pagination]);

  // CRUD Operations
  const createCampaign = useCallback(
    async (payload: CreateCampaignPayload) => {
      try {
        await AXIOS_INSTANCE_ADMIN.post("/v1/admin/campaigns", payload);
        fetchCampaigns(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to create campaign:", error);
        throw error;
      }
    },
    [fetchCampaigns, state.pagination]
  );

  const updateCampaign = useCallback(
    async (id: string | number, payload: UpdateCampaignPayload) => {
      try {
        await AXIOS_INSTANCE_ADMIN.put(`/v1/admin/campaigns/${id}`, payload);
        fetchCampaigns(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to update campaign:", error);
        throw error;
      }
    },
    [fetchCampaigns, state.pagination]
  );

  const deleteCampaign = useCallback(
    async (id: string | number) => {
      try {
        await AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/campaigns/${id}`);
        fetchCampaigns(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to delete campaign:", error);
        throw error;
      }
    },
    [fetchCampaigns, state.pagination]
  );

  return {
    ...state,
    refetch: () => fetchCampaigns(state.pagination?.current_page || 1),
    setPage,
    nextPage,
    prevPage,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
