"use client";

import { useReducer, useEffect, useCallback } from "react";
import { AdUnit } from "./types";
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

export interface AdUnitResponse {
  data: AdUnit[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface CreateAdUnitPayload {
  name: string;
  type: "image" | "text" | null;
  page_url: string | null;
  size: "adaptive" | null;
  campaigns?: number[] | null;
}

export type UpdateAdUnitPayload = Partial<CreateAdUnitPayload>;

interface State {
  data: AdUnit[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: AdUnitResponse }
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
 * Hook for managing ad units (formerly Campaigns) on the admin side.
 */
export default function useAdUnits() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAdUnits = useCallback(async (page: number = 1) => {
    dispatch({ type: "FETCH_INIT" });
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<AdUnitResponse>("/v1/admin/ad-units", {
        params: { page },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch ad units";
      dispatch({ type: "FETCH_FAILURE", payload: errorMessage });
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAdUnits(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPage = useCallback(
    (page: number) => {
      fetchAdUnits(page);
    },
    [fetchAdUnits]
  );

  const nextPage = useCallback(() => {
    if (state.pagination && state.pagination.current_page < state.pagination.last_page) {
      fetchAdUnits(state.pagination.current_page + 1);
    }
  }, [fetchAdUnits, state.pagination]);

  const prevPage = useCallback(() => {
    if (state.pagination && state.pagination.current_page > 1) {
      fetchAdUnits(state.pagination.current_page - 1);
    }
  }, [fetchAdUnits, state.pagination]);

  // CRUD Operations
  const createAdUnit = useCallback(
    async (payload: CreateAdUnitPayload) => {
      try {
        await AXIOS_INSTANCE_ADMIN.post("/v1/admin/ad-units", payload);
        fetchAdUnits(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to create ad unit:", error);
        throw error;
      }
    },
    [fetchAdUnits, state.pagination]
  );

  const updateAdUnit = useCallback(
    async (id: string | number, payload: UpdateAdUnitPayload) => {
      try {
        await AXIOS_INSTANCE_ADMIN.put(`/v1/admin/ad-units/${id}`, payload);
        fetchAdUnits(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to update ad unit:", error);
        throw error;
      }
    },
    [fetchAdUnits, state.pagination]
  );

  const deleteAdUnit = useCallback(
    async (id: string | number) => {
      try {
        await AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/ad-units/${id}`);
        fetchAdUnits(state.pagination?.current_page || 1);
        return { success: true };
      } catch (error: any) {
        console.error("Failed to delete ad unit:", error);
        throw error;
      }
    },
    [fetchAdUnits, state.pagination]
  );

  return {
    ...state,
    refetch: () => fetchAdUnits(state.pagination?.current_page || 1),
    setPage,
    nextPage,
    prevPage,
    createAdUnit,
    updateAdUnit,
    deleteAdUnit,
  };
}
