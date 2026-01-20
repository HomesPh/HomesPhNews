import AdminSidebar from "@/components/features/admin/layout/AdminSidebar";
import AdminHeader from "@/components/features/admin/layout/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 w-full flex flex-col">
          <AdminHeader />
          <div className="flex-1 p-0 bg-[#f9fafb]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}