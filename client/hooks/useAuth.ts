"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api-v2/admin/service/auth/user";
import type { UserResource } from "@/lib/api-v2/types/UserResource";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<UserResource, Error>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await getUser();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
