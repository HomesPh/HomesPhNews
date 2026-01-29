"use client";

import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";

/**
 * Hydrate Component
 *
 * This is a Client Component wrapper around React Query's Hydrate component.
 * It is used to hydrate the query client with data pre-fetched on the server.
 *
 * In Next.js App Router, we need this boundary to pass the dehydrated state
 * from Server Components to Client Components.
 *
 * @param props - The props for the Hydrate component (state and children).
 */
export default function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
