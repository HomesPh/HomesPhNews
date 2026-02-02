"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AdminSidebar from "@/components/features/admin/layout/AdminSidebar";
import AdminHeader from "@/components/features/admin/layout/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/features/auth/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        <div className="force-light min-h-screen flex items-center justify-center">
          {children}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
      <div className="force-light h-full w-full flex bg-white text-gray-900">
        <AuthGuard>
          <SidebarProvider>
            <AdminSidebar />
            <main className="flex-1 w-full flex flex-col">
              <AdminHeader />
              <div className="flex-1 p-0 bg-[#f9fafb]">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </AuthGuard>
      </div>
    </ThemeProvider>
  );
}