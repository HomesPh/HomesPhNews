"use client";

import { useReducer, useEffect, useCallback } from "react";
import { Campaign } from "./types";
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";

// ============================================================================
// Reducer
// ============================================================================
interface State {
  data: Response | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}

type Action =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: Response }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "NEXT_PAGE" }
  | { type: "PREV_PAGE" };

const initialState: State = {
  data: null,
  isLoading: false,
  error: null,
  currentPage: 1,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };

    case "FETCH_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    case "SET_PAGE":
      return { ...state, currentPage: action.payload };

    case "NEXT_PAGE":
      return { ...state, currentPage: state.currentPage + 1 };

    case "PREV_PAGE":
      return { ...state, currentPage: Math.max(1, state.currentPage - 1) };

    default:
      return state;
  }
};

// ============================================================================
// The Hook
// ============================================================================
interface Response {
  data: Campaign[];
  per_page: number;
  total: number;
}

/**
 * Hook for fetching campaigns on the admin side.
 */
export default function useCampaignAdmin() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Helper functions for pagination
  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const nextPage = useCallback(() => {
    dispatch({ type: "NEXT_PAGE" });
  }, []);

  const prevPage = useCallback(() => {
    dispatch({ type: "PREV_PAGE" });
  }, []);

  const fetchCampaigns = useCallback(async () => {
    // initialize loading state
    dispatch({ type: "FETCH_INIT" });

    // try to fetch campaigns
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<Response>("/admin/campaigns", {
        params: { page: state.currentPage },
      });

      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    }
    // if any mishaps happen...
    catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch campaigns";
      dispatch({
        type: "FETCH_FAILURE",
        payload: errorMessage
      });
    }

  }, [state.currentPage]);

  // runs once on mount and when page changes
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    ...state,
    refetch: fetchCampaigns,
    setPage,
    nextPage,
    prevPage,
  };
}