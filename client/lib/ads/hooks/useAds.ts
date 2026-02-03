"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { Ad, AdPlacement } from "../types";
import { getRandomAdForPlacement, getAdsByPlacement } from "../mock/data";

// ============================================================
// Types
// ============================================================

interface UseAdsConfig {
  placement: AdPlacement;
  /** Auto-rotate ads at this interval (ms). Set to 0 to disable. */
  rotateInterval?: number;
}

interface UseAdsReturn {
  /** Current ad to display */
  ad: Ad | null;
  /** All available ads for this placement */
  allAds: Ad[];
  /** Whether ads are loading */
  isLoading: boolean;
  /** Track an impression */
  trackImpression: () => void;
  /** Track a click */
  trackClick: () => void;
  /** Manually rotate to next ad */
  rotateAd: () => void;
}

// ============================================================
// Hook Implementation
// ============================================================

/**
 * Hook for managing ad display at public site.
 * Handles ad selection, rotation, and tracking.
 *
 * @example
 * const { ad, isLoading, trackClick } = useAds({
 *   placement: 'sidebar-top',
 *   rotateInterval: 30000, // Rotate every 30 seconds
 * });
 */
export default function useAds(config: UseAdsConfig): UseAdsReturn {
  const { placement, rotateInterval = 0 } = config;

  // ----------------------
  // State
  // ----------------------
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ----------------------
  // Memoized Values
  // ----------------------
  const allAds = useMemo(() => getAdsByPlacement(placement), [placement]);

  // ----------------------
  // Actions
  // ----------------------
  const rotateAd = useCallback(() => {
    const newAd = getRandomAdForPlacement(placement);
    setAd(newAd);
  }, [placement]);

  const trackImpression = useCallback(() => {
    if (!ad) return;
    // In production, this would call an API
    console.log(`[Ad Impression] ${ad.id}: ${ad.name}`);
  }, [ad]);

  const trackClick = useCallback(() => {
    if (!ad) return;
    // In production, this would call an API
    console.log(`[Ad Click] ${ad.id}: ${ad.name}`);
  }, [ad]);

  // ----------------------
  // Effects
  // ----------------------

  // Initial ad load
  useEffect(() => {
    setIsLoading(true);
    const initialAd = getRandomAdForPlacement(placement);
    setAd(initialAd);
    setIsLoading(false);
  }, [placement]);

  // Track impression when ad changes
  useEffect(() => {
    if (ad && !isLoading) {
      trackImpression();
    }
  }, [ad, isLoading, trackImpression]);

  // Auto-rotate ads
  useEffect(() => {
    if (rotateInterval <= 0 || allAds.length <= 1) return;

    const interval = setInterval(() => {
      rotateAd();
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [rotateInterval, allAds.length, rotateAd]);

  // ----------------------
  // Return
  // ----------------------
  return {
    ad,
    allAds,
    isLoading,
    trackImpression,
    trackClick,
    rotateAd,
  };
}