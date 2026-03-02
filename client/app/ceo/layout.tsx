"use client";

import CEOSidebar from "@/components/features/ceo/layout/CEOSidebar";
import AdminHeader from "@/components/features/admin/layout/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/features/auth/AuthGuard";

export default function CEOLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="force-light min-h-screen flex flex-col">
                <SidebarProvider>
                    <CEOSidebar />
                    <main className="flex-1 w-full flex flex-col">
                        <AdminHeader />
                        <div className="flex-1 p-0 bg-[#f9fafb]">
                            {children}
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </AuthGuard>
    );
}
