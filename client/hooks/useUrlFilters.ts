"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Configuration for a single filter
 */
interface FilterConfig<T extends string = string> {
  /** Default value when param is not in URL */
  default: T;
  /** Values that should remove the param from URL (e.g., 'all', 'All Category') */
  resetValues?: T[];
}

/**
 * Configuration object mapping filter keys to their configs
 */
type FiltersConfig<T extends Record<string, string>> = {
  [K in keyof T]: FilterConfig<T[K]>;
};

/**
 * Hook for synchronizing filter state with URL search params
 *
 * @example
 * const { filters, setFilter, setFilters } = useUrlFilters({
 *   status: { default: 'all', resetValues: ['all'] },
 *   category: { default: 'All Category', resetValues: ['All Category'] },
 *   country: { default: 'All Countries', resetValues: ['All Countries'] },
 * });
 *
 * // Access filter values
 * console.log(filters.status); // 'all' | 'published' | etc.
 *
 * // Update a single filter (also updates URL)
 * setFilter('status', 'published');
 *
 * // Update multiple filters at once
 * setFilters({ status: 'all', category: 'News' });
 */
export default function useUrlFilters<T extends Record<string, string>>(
  config: FiltersConfig<T>
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Get initial state from URL params, falling back to defaults
   */
  const getInitialState = useCallback((): T => {
    const state = {} as T;
    for (const key in config) {
      const paramValue = searchParams.get(key);
      state[key as keyof T] = (paramValue ?? config[key].default) as T[keyof T];
    }
    return state;
  }, [config, searchParams]);

  const [filters, setFiltersState] = useState<T>(getInitialState);

  /**
   * Check if a value should reset/remove the param from URL
   */
  const isResetValue = useCallback(
    (key: keyof T, value: string): boolean => {
      const resetValues = config[key]?.resetValues ?? [];
      return resetValues.includes(value as T[keyof T]);
    },
    [config]
  );

  /**
   * Build query string from current filters
   */
  const buildQueryString = useCallback(
    (newFilters: Partial<T>): string => {
      const params = new URLSearchParams(searchParams.toString());

      for (const key in newFilters) {
        const value = newFilters[key];
        if (value && !isResetValue(key, value)) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      return params.toString();
    },
    [searchParams, isResetValue]
  );

  /**
   * Update a single filter and sync to URL
   */
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      // Update state first
      setFiltersState((prev) => ({ ...prev, [key]: value }));

      // Then navigate (outside of state updater to avoid side effects during render)
      const query = buildQueryString({ [key]: value } as unknown as Partial<T>);
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [buildQueryString, pathname, router]
  );

  /**
   * Update multiple filters at once and sync to URL
   */
  const setFilters = useCallback(
    (updates: Partial<T>) => {
      // Update state first
      setFiltersState((prev) => ({ ...prev, ...updates }));

      // Then navigate (outside of state updater to avoid side effects during render)
      const query = buildQueryString(updates);
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [buildQueryString, pathname, router]
  );

  /**
   * Reset all filters to their default values
   */
  const resetFilters = useCallback(() => {
    const defaults = {} as T;
    for (const key in config) {
      defaults[key as keyof T] = config[key].default as T[keyof T];
    }
    setFiltersState(defaults);
    router.push(pathname, { scroll: false });
  }, [config, pathname, router]);

  /**
   * Sync state when URL changes externally (e.g., browser back/forward)
   */
  useEffect(() => {
    const newState = getInitialState();
    setFiltersState(newState);
  }, [searchParams, getInitialState]);

  return {
    /** Current filter values */
    filters,
    /** Update a single filter */
    setFilter,
    /** Update multiple filters at once */
    setFilters,
    /** Reset all filters to defaults */
    resetFilters,
  };
}
