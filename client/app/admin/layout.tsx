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
          <div className="flex-1 p-6 bg-gray-50">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}