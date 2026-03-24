"use client";

import React from "react";

interface WhatsAppIconProps {
  className?: string;
}

/**
 * WhatsApp Icon with a white bubble and green handset
 * Matches the style requested by the user: "message icon white, and the phone icon is green"
 */
export const WhatsAppIcon = ({ className }: WhatsAppIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Solid white background shape (The bubble) */}
    <path
      fill="white"
      d="M12.01 2.005c-5.46 0-9.89 4.43-9.89 9.89 0 1.76.46 3.47 1.33 4.98L2 22l5.3-1.39c1.47.81 3.13 1.23 4.81 1.23 5.46 0 9.89-4.43 9.89-9.89s-4.43-9.89-9.89-9.89z"
    />
    {/* Thick Green Phone Handset */}
    <path
      fill="#25D366"
      d="M17.15 14.61c-.27-.14-1.61-.8-1.86-.89-.25-.1-.43-.14-.61.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07s-1.15-.42-2.19-1.36c-.81-.73-1.36-1.63-1.52-1.91-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.1-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.44-.46-.61-.46-.16 0-.34 0-.52 0-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.91 2.92 4.63 4.09.65.28 1.15.45 1.55.57.65.21 1.24.18 1.71.11.53-.08 1.61-.66 1.84-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32z"
    />
  </svg>
);

export default WhatsAppIcon;
