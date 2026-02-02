"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/api-v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuth((state) => state.login);

  useEffect(() => {
    login({ email: "", password: "" });
  }, [login]);

  return <>{children}</>;
}
