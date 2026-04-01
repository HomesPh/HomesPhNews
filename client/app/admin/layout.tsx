"use client";

import AdminSidebar from "@/components/features/admin/layout/AdminSidebar";
import AdminHeader from "@/components/features/admin/layout/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/features/auth/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="force-light h-screen flex flex-col overflow-hidden">
        <SidebarProvider>
          <AdminSidebar />
          <main className="flex-1 w-full flex flex-col overflow-hidden">
            <AdminHeader />
            <div className="flex-1 p-0 bg-[#f9fafb] overflow-hidden flex flex-col">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}