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

        // Skip check for login and register pages
        const publicRoutes = ["/login", "/register", "/verify-email"];
        if (publicRoutes.includes(pathname)) {
            setIsLoading(false);
            return;
        }

        const legacyToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const legacyUserStr = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;

        if (!token) {
            // Attempt to recover session from legacy localStorage
            if (legacyToken && legacyUserStr) {
                try {
                    const legacyUser = JSON.parse(legacyUserStr);
                    // Construct UserResource-like object from legacy info if needed, 
                    // or assume it matches. Legacy user_info has firstName, lastName, email, roles.
                    // We need a full UserResource for the store, but for AuthGuard basic checks, roles are key.

                    // We need to match UserResource interface for setAuth
                    const userResource = {
                        id: 0, // Placeholder
                        first_name: legacyUser.firstName,
                        last_name: legacyUser.lastName,
                        name: `${legacyUser.firstName} ${legacyUser.lastName}`,
                        email: legacyUser.email,
                        avatar: null,
                        roles: legacyUser.roles || [],
                        email_verified_at: null,
                        created_at: null,
                        updated_at: null
                    } as unknown as import("@/lib/api-v2/types/UserResource").UserResource;

                    useAuth.getState().setAuth(legacyToken, userResource);
                    // Don't redirect yet, let the next render pick up the token
                    return;
                } catch (e) {
                    console.error("Failed to recover legacy session", e);
                    localStorage.removeItem('auth_token'); // Clear corrupted data
                    router.push("/login");
                }
            } else {
                router.push("/login");
            }
        } else {
            // Role-based route protection
            const user = useAuth.getState().user;
            const roles = (user?.roles || []).map(r => r.toLowerCase());
            const isAdmin = roles.some(r => ['admin', 'super-admin'].includes(r));
            const isBlogger = roles.includes('blogger');
            const isSubscriber = roles.includes('subscriber');

            if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
                const isAdmin = roles.some(r => ['admin', 'super-admin'].includes(r));
                const isCEO = roles.includes('ceo');
                const isEditor = roles.includes('editor');

                if (!isAdmin && !isCEO && !isEditor) {
                    router.push('/blogger/dashboard');
                    return;
                }

                // If CEO tries to access anything other than allowed admin paths, redirect them
                if (isCEO && !isAdmin) {
                    router.push('/ceo/articles');
                    return;
                }

                // If Editor tries to access anything other than articles or settings, redirect
                if (isEditor && !isAdmin && !pathname.startsWith('/admin/articles') && !pathname.startsWith('/admin/settings')) {
                    router.push('/admin/articles');
                    return;
                }
            } else if (pathname.startsWith('/ceo')) {
                const isCEO = roles.includes('ceo');
                if (!isCEO && !isAdmin) {
                    router.push('/login');
                    return;
                }
            } else if (pathname.startsWith('/blogger')) {
                if (!isBlogger) {
                    if (isSubscriber) router.push('/subscriber');
                    else if (isAdmin) router.push('/admin');
                    else router.push('/login');
                    return;
                }
            } else if (pathname.startsWith('/subscriber')) {
                if (!isSubscriber) {
                    router.push('/login');
                    return;
                }

                // [ADD] Verification protection for subscribers
                if (!user?.email_verified_at) {
                    router.push('/verify-email');
                    return;
                }
            }

            setIsLoading(false);
        }
    }, [token, _hasHydrated, pathname, router]);

    // Show nothing while checking auth (or a loading spinner)
    const publicRoutes = ["/login", "/register"];
    if (isLoading && !publicRoutes.includes(pathname)) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#f9fafb]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C10007]"></div>
            </div>
        );
    }

    return <>{children}</>;
}
