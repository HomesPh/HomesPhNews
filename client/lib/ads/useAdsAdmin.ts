"use client";

import { useReducer, useEffect, useCallback } from "react";
import { Ad } from "./types";
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

export interface AdResponse {
  data: Ad[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface MutateAdPayload {
  title: string;
  image_url: string;
  destination_url: string;
  is_active?: boolean;
  campaign_ids?: number[] | null;
}

interface State {
  data: Ad[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: AdResponse }
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
      // We can optimistically update page here if we want,
      // but usually we wait for fetch.
      // However, to trigger effect, we might need a separate page state
      // or just call fetch with new page.
      // Let's keep page in state if needed, or rely on pagination meta.
      // If we rely on pagination meta, we can't "set" page before fetch.
      // So we might need a separate 'page' state for the request.
      return {
        ...state,
        pagination: state.pagination ? { ...state.pagination, current_page: action.payload } : null
      };

    default:
      return state;
  }
};

/**
 * Hook for fetching ads on the admin side.
 */
export default function useAdsAdmin() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAds = useCallback(async (page: number = 1) => {
    dispatch({ type: "FETCH_INIT" });
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<AdResponse>("/admin/ads", {
        params: { page },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch ads";
      dispatch({ type: "FETCH_FAILURE", payload: errorMessage });
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    // Only fetch if not already loaded or if we want initial load
    // But usually we want to fetch on mount.
    // To avoid double fetch if strict mode, we can use a ref or just let it consist.
    fetchAds(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper functions for pagination
  const setPage = useCallback(
    (page: number) => {
      fetchAds(page);
    },
    [fetchAds]
  );

  const nextPage = useCallback(() => {
    if (state.pagination && state.pagination.current_page < state.pagination.last_page) {
      fetchAds(state.pagination.current_page + 1);
    }
  }, [fetchAds, state.pagination]);

  const prevPage = useCallback(() => {
    if (state.pagination && state.pagination.current_page > 1) {
      fetchAds(state.pagination.current_page - 1);
    }
  }, [fetchAds, state.pagination]);

  // CRUD Operations
  const createAd = useCallback(
    async (payload: MutateAdPayload) => {
      try {
        await AXIOS_INSTANCE_ADMIN.post("/admin/ads", payload);
        // Refetch current page or go to first? Usually first or stay.
        // Let's refetch current page.
        fetchAds(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to create ad:", error);
        throw error;
      }
    },
    [fetchAds, state.pagination]
  );

  const updateAd = useCallback(
    async (id: string | number, payload: MutateAdPayload) => {
      try {
        await AXIOS_INSTANCE_ADMIN.put(`/admin/ads/${id}`, payload);
        fetchAds(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to update ad:", error);
        throw error;
      }
    },
    [fetchAds, state.pagination]
  );

  const deleteAd = useCallback(
    async (id: string | number) => {
      try {
        await AXIOS_INSTANCE_ADMIN.delete(`/admin/ads/${id}`);
        fetchAds(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to delete ad:", error);
        throw error;
      }
    },
    [fetchAds, state.pagination]
  );

  return {
    ...state,
    refetch: () => fetchAds(state.pagination?.current_page || 1),
    setPage,
    nextPage,
    prevPage,
    createAd,
    updateAd,
    deleteAd,
  };
}