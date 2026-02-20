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
            // Role-based route protection
            const user = useAuth.getState().user;
            const roles = (user?.roles || []).map(r => r.toLowerCase());

            if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
                const isAdmin = roles.some(r => ['admin', 'super-admin'].includes(r));
                const isCEO = roles.includes('ceo');

                if (!isAdmin && !isCEO) {
                    router.push('/blogger/dashboard');
                    return;
                }

                // If CEO tries to access anything other than mailing list, redirect
                if (isCEO && !isAdmin && !pathname.startsWith('/admin/mailing-list')) {
                    router.push('/admin/mailing-list');
                    return;
                }
            } else if (pathname.startsWith('/blogger')) {
                const isBlogger = roles.includes('blogger');
                if (!isBlogger) {
                    router.push('/admin');
                    return;
                }
            }

            setIsLoading(false);
        }
    }, [token, _hasHydrated, pathname, router]);

    // Show nothing while checking auth (or a loading spinner)
    if (isLoading && pathname !== "/admin/login") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#f9fafb]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C10007]"></div>
            </div>
        );
    }

    return <>{children}</>;
}
