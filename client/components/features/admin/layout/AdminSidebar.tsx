"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, BarChart2, Globe, MonitorPlay, Calendar, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard // Dashboard
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: FileText // Articles
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart2 // Analytics
  },
  {
    title: "Sites",
    href: "/admin/sites",
    icon: Globe // Sites
  },
  {
    title: "Ads",
    href: "/admin/ads",
    icon: MonitorPlay // Ads
  },
  {
    title: "Calendar",
    href: "/admin/calendar",
    icon: Calendar // Calendar
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings // Settings
  }
]

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-none">
      <div className="flex flex-col h-full bg-[#0B1120] text-white">
        <SidebarHeader className="h-16 flex items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1 rounded-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Global News</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Network</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarMenu>
            {SidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-6 rounded-md hover:bg-gray-800 transition-colors hover:text-white",
                      isActive ? "bg-[#DC2626] hover:bg-[#DC2626] text-white" : "text-gray-300"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                      <span className="font-medium text-[15px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 mt-auto">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-2">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}