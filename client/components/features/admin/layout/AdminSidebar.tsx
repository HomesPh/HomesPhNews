"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, BarChart3, Calendar, Settings, LogOut, Users, BookOpen, Globe, Megaphone, Utensils, Bot, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/api-v2";

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
    title: "Mailing List",
    href: "/admin/mailing-list",
    icon: Send
  },
  {
    title: "Restaurant",
    href: "/admin/restaurant",
    icon: Utensils
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: BookOpen
  },
  {
    title: "Sites",
    href: "/admin/sites",
    icon: Globe
  },
  {
    title: "AutoNewsConfig",
    href: "/admin/autonews",
    icon: Bot
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3
  },
  {
    title: "Ads",
    href: "/admin/ads",
    icon: Megaphone
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
  const { logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-none">
      <div className="flex flex-col h-full bg-[#1a1d2e] text-white">
        <SidebarHeader className="px-4 py-6 border-b border-[rgba(255,255,255,0.1)]">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2">
              <img
                src="/images/HomesTVwhite.png"
                alt="HomesTV"
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-[20px] font-bold text-white leading-[1.4] tracking-[-0.5px]">HomesTV</h1>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src="/images/HomesTVwhite.png"
                alt="HomesTV"
                className="w-10 h-10 object-contain"
              />
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
            onClick={() => {
              logout();
              window.location.href = '/admin/login';
            }}
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