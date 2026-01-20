"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, BarChart3, Globe, Calendar, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: FileText
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3
  },
  {
    title: "Sites",
    href: "/admin/sites",
    icon: Globe
  },
  {
    title: "Ads",
    href: "/admin/ads",
    icon: FileText // Using FileText as in reference for Ads
  },
  {
    title: "Calendar",
    href: "/admin/calendar",
    icon: Calendar
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export default function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-none">
      <div className="flex flex-col h-full bg-[#1a1d2e] text-white">
        <SidebarHeader className="px-4 py-6 border-b border-[rgba(255,255,255,0.1)]">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2">
              <div className="w-[40px] h-[40px] bg-[#C10007] rounded-[8px] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d="M13.75 10C13.75 10.8672 13.7031 11.7031 13.6211 12.5H6.37891C6.29297 11.7031 6.25 10.8672 6.25 10C6.25 9.13281 6.29688 8.29687 6.37891 7.5H13.6211C13.707 8.29687 13.75 9.13281 13.75 10ZM14.875 7.5H19.6836C19.8906 8.30078 20 9.13672 20 10C20 10.8633 19.8906 11.6992 19.6836 12.5H14.875C14.957 11.6953 15 10.8594 15 10C15 9.14062 14.957 8.30469 14.875 7.5ZM19.2734 6.25H14.7148C14.3242 3.75391 13.5508 1.66406 12.5547 0.328125C15.6133 1.13672 18.1016 3.35547 19.2695 6.25H19.2734ZM13.4492 6.25H6.55078C6.78906 4.82812 7.15625 3.57031 7.60547 2.55078C8.01562 1.62891 8.47266 0.960938 8.91406 0.539063C9.35156 0.125 9.71484 0 10 0C10.2852 0 10.6484 0.125 11.0859 0.539063C11.5273 0.960938 11.9844 1.62891 12.3945 2.55078C12.8477 3.56641 13.2109 4.82422 13.4492 6.25ZM5.28516 6.25H0.726563C1.89844 3.35547 4.38281 1.13672 7.44531 0.328125C6.44922 1.66406 5.67578 3.75391 5.28516 6.25ZM0.316406 7.5H5.125C5.04297 8.30469 5 9.14062 5 10C5 10.8594 5.04297 11.6953 5.125 12.5H0.316406C0.109375 11.6992 0 10.8633 0 10C0 9.13672 0.109375 8.30078 0.316406 7.5ZM7.60547 17.4453C7.15234 16.4297 6.78906 15.1719 6.55078 13.75H13.4492C13.2109 15.1719 12.8437 16.4297 12.3945 17.4453C11.9844 18.3672 11.5273 19.0352 11.0859 19.457C10.6484 19.875 10.2852 20 10 20C9.71484 20 9.35156 19.875 8.91406 19.4609C8.47266 19.0391 8.01562 18.3711 7.60547 17.4492V17.4453ZM5.28516 13.75C5.67578 16.2461 6.44922 18.3359 7.44531 19.6719C4.38281 18.8633 1.89844 16.6445 0.726563 13.75H5.28516ZM19.2734 13.75C18.1016 16.6445 15.6172 18.8633 12.5586 19.6719C13.5547 18.3359 14.3242 16.2461 14.7187 13.75H19.2734Z" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[20px] font-bold text-white leading-[1.4] tracking-[-0.5px]">Global News</h1>
                <p className="text-[12px] font-normal text-[#9ca3af] leading-[1.3] tracking-[-0.5px]">Network</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-[40px] h-[40px] bg-[#C10007] rounded-[8px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d="M13.75 10C13.75 10.8672 13.7031 11.7031 13.6211 12.5H6.37891C6.29297 11.7031 6.25 10.8672 6.25 10C6.25 9.13281 6.29688 8.29687 6.37891 7.5H13.6211C13.707 8.29687 13.75 9.13281 13.75 10ZM14.875 7.5H19.6836C19.8906 8.30078 20 9.13672 20 10C20 10.8633 19.8906 11.6992 19.6836 12.5H14.875C14.957 11.6953 15 10.8594 15 10C15 9.14062 14.957 8.30469 14.875 7.5ZM19.2734 6.25H14.7148C14.3242 3.75391 13.5508 1.66406 12.5547 0.328125C15.6133 1.13672 18.1016 3.35547 19.2695 6.25H19.2734ZM13.4492 6.25H6.55078C6.78906 4.82812 7.15625 3.57031 7.60547 2.55078C8.01562 1.62891 8.47266 0.960938 8.91406 0.539063C9.35156 0.125 9.71484 0 10 0C10.2852 0 10.6484 0.125 11.0859 0.539063C11.5273 0.960938 11.9844 1.62891 12.3945 2.55078C12.8477 3.56641 13.2109 4.82422 13.4492 6.25ZM5.28516 6.25H0.726563C1.89844 3.35547 4.38281 1.13672 7.44531 0.328125C6.44922 1.66406 5.67578 3.75391 5.28516 6.25ZM0.316406 7.5H5.125C5.04297 8.30469 5 9.14062 5 10C5 10.8594 5.04297 11.6953 5.125 12.5H0.316406C0.109375 11.6992 0 10.8633 0 10C0 9.13672 0.109375 8.30078 0.316406 7.5ZM7.60547 17.4453C7.15234 16.4297 6.78906 15.1719 6.55078 13.75H13.4492C13.2109 15.1719 12.8437 16.4297 12.3945 17.4453C11.9844 18.3672 11.5273 19.0352 11.0859 19.457C10.6484 19.875 10.2852 20 10 20C9.71484 20 9.35156 19.875 8.91406 19.4609C8.47266 19.0391 8.01562 18.3711 7.60547 17.4492V17.4453ZM5.28516 13.75C5.67578 16.2461 6.44922 18.3359 7.44531 19.6719C4.38281 18.8633 1.89844 16.6445 0.726563 13.75H5.28516ZM19.2734 13.75C18.1016 16.6445 15.6172 18.8633 12.5586 19.6719C13.5547 18.3359 14.3242 16.2461 14.7187 13.75H19.2734Z" fill="white" />
                </svg>
              </div>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-4 py-6 overflow-y-auto">
          <SidebarMenu className="space-y-2">
            {SidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full h-auto",
                      isActive
                        ? "bg-[#C10007] text-white hover:bg-[#C10007] hover:text-white"
                        : "text-[#9ca3af] hover:bg-[#252836] hover:text-white",
                      isCollapsed ? "justify-center" : ""
                    )}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link href={item.href} className={cn("flex items-center w-full", isCollapsed ? "justify-center" : "")}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-[14px] font-medium tracking-[-0.5px]">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="px-4 py-4 border-t border-[#2a2d3e]">
          <button
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#252836] hover:text-white rounded-[8px] transition-colors w-full",
              isCollapsed ? "justify-center" : ""
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-[14px] font-medium tracking-[-0.5px]">Logout</span>
            )}
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}