"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * ReactQueryProvider Component
 *
 * This component sets up the React Query client provider for the application.
 * It is a Client Component ("use client") because it manages the QueryClient state
 * and uses the QueryClientProvider Context.
 *
 * @param children - The child components to wrap with the provider.
 */
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Create a new QueryClient instance.
   *
   * We use `useState` to ensure the QueryClient is only created once per
   * component lifecycle and is not recreated on re-renders.
   * This is crucial for maintaining the cache across client-side navigation.
   */
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only visible in development mode */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
