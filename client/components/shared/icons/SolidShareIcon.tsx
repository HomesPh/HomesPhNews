"use client";

import React from "react";

interface SolidShareIconProps {
  className?: string;
}

/**
 * Solid version of the network share icon
 */
export const SolidShareIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="5" r="4" />
    <circle cx="6" cy="12" r="4" />
    <circle cx="18" cy="19" r="4" />
    <path
      d="M17.42 17.49L8.59 13.51"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15.41 6.51L8.59 10.49"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export default SolidShareIcon;
