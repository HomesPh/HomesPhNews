"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/api-v2";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, _hasHydrated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait for Zustand to finish hydrating from localStorage
        if (!_hasHydrated) return;

        // Skip check for login page
        if (pathname === "/admin/login") {
            setIsLoading(false);
            return;
        }

        if (!token) {
            router.push("/admin/login");
        } else {
            setIsLoading(false);
        }
    }, [token, _hasHydrated, pathname, router]);

    // Show nothing while checking auth (or a loading spinner)
    if (isLoading && pathname !== "/admin/login") {
        return null;
    }

    return <>{children}</>;
}
