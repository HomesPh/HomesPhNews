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
                    router.push("/admin/login");
                }
            } else {
                router.push("/admin/login");
            }
        } else {
            // Role-based route protection
            const user = useAuth.getState().user;
            const roles = (user?.roles || []).map(r => r.toLowerCase());
            const isAdmin = roles.some(r => ['admin', 'super-admin'].includes(r));
            const isBlogger = roles.includes('blogger');
            const isSubscriber = roles.includes('subscriber');

            if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
                if (!isAdmin) {
                    // Non-admin tried /admin — route them to their correct home
                    if (isSubscriber) router.push('/subscriber');
                    else if (isBlogger) router.push('/blogger/dashboard');
                    else router.push('/admin/login');
                    return;
                }
            } else if (pathname.startsWith('/blogger')) {
                if (!isBlogger) {
                    if (isSubscriber) router.push('/subscriber');
                    else if (isAdmin) router.push('/admin');
                    else router.push('/admin/login');
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
