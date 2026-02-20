"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import BloggerSidebar from "@/components/features/blogger/layout/BloggerSidebar";
import BloggerHeader from "@/components/features/blogger/layout/BloggerHeader";
import AuthGuard from "@/components/features/auth/AuthGuard";

export default function BloggerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-[#f9fafb]">
                    <BloggerSidebar />
                    <SidebarInset className="flex flex-col overflow-hidden">
                        <BloggerHeader />
                        <main className="flex-1 overflow-y-auto w-full">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </AuthGuard>
    );
}
