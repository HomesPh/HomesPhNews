"use client";

import { useReducer, useEffect, useCallback } from "react";
import { Ad } from "./types";
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
// =============================================================================
interface Response {
  data: Ad[];
  per_page: number;
  total: number;
}

/**
 * Hook for fetching ads on the admin side.
 */
export default function useAdsAdmin() {
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

  // mark:  i call this: the all-in-one get ads for admin hook
  //        and i'm not even sure if it's necessary to add pagination here too
  const fetchAds = useCallback(async () => {
    // initialize loading state
    dispatch({ type: "FETCH_INIT" });

    // try to fetch ads
    try {
      const response = await AXIOS_INSTANCE_ADMIN.get<Response>("/admin/ads", {
        params: { page: state.currentPage },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    }
    // if any mishaps happen...
    catch (error: any) {
      // gemini 3 pro: axios error handling might already be wrapped, but let's be safe
      // mark: u motherf...
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch ads";
      dispatch({
        type: "FETCH_FAILURE",
        payload: errorMessage
      });
    }

  }, [state.currentPage]);

  // runs once on mount and when page changes
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return {
    ...state,
    refetch: fetchAds,
    setPage,
    nextPage,
    prevPage,
  };
}