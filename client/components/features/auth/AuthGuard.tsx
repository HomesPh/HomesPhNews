"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, sendEmailOTP, getUser } from "@/lib/api-v2";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, _hasHydrated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
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
                const userRes = await getUser();
                const user = userRes.data.data;
                const roles = (user?.roles || []).map(r => r.toLowerCase());

                // Determine strict primary role for this session to prevent crossover
                const isCEO = roles.includes('ceo');
                const isEditor = roles.includes('editor');
                const isAdmin = roles.some(r => ['admin', 'super-admin'].includes(r));
                const isBlogger = roles.includes('blogger');
                const isSubscriber = roles.includes('subscriber');

                // Order of precedence if user has multiple roles in the database
                const primaryRole = isCEO ? 'ceo' : (isEditor ? 'editor' : (isAdmin ? 'admin' : (isBlogger ? 'blogger' : (isSubscriber ? 'subscriber' : 'guest'))));

                // Helper to redirect to correct dashboard
                const redirectHome = () => {
                    if (primaryRole === 'ceo') router.push('/ceo/articles');
                    else if (primaryRole === 'editor') router.push('/editor/articles');
                    else if (primaryRole === 'admin') router.push('/admin/articles');
                    else if (primaryRole === 'blogger') router.push('/blogger/dashboard');
                    else if (primaryRole === 'subscriber') router.push('/subscriber/articles');
                    else router.push('/login');
                };

                if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
                    if (primaryRole !== 'admin') {
                        redirectHome();
                        return;
                    }
                } else if (pathname.startsWith('/ceo')) {
                    if (primaryRole !== 'ceo') {
                        redirectHome();
                        return;
                    }
                } else if (pathname.startsWith('/editor')) {
                    if (primaryRole !== 'editor') {
                        redirectHome();
                        return;
                    }
                } else if (pathname.startsWith('/blogger')) {
                    if (primaryRole !== 'blogger') {
                        redirectHome();
                        return;
                    }
                } else if (pathname.startsWith('/subscriber')) {
                    if (primaryRole !== 'subscriber') {
                        redirectHome();
                        return;
                    }

                    // Verification protection for subscribers
                    if (!user?.email_verified_at) {
                        // Automatically send OTP so the verify-email page is ready to accept input
                        if (user?.email) {
                            sendEmailOTP({ email: user.email }).catch((err) =>
                                console.error("Failed to send verification OTP", err)
                            );
                        }
                        router.push('/verify-email');
                        return;
                    }
                } else {
                    // This block handles other routes, like those under the (landing) layout (e.g., /feed)
                    // The user wants these to be restricted to staff roles only.
                    const staffRoles = ['admin', 'ceo', 'editor', 'blogger'];
                    const isStaff = staffRoles.includes(primaryRole);
                    const publicRoutes = ["/login", "/register", "/verify-email"];

                    if (!isStaff && !publicRoutes.includes(pathname)) {
                        redirectHome();
                        return;
                    }
                }

                setIsLoading(false);
            }
            };

            run();
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
