"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, BarChart3, Calendar, Settings, LogOut, Users, BookOpen, Globe, Megaphone, Utensils, Bot, Send, Code, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
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
    icon: Globe,
    subItems: [
      {
        title: "All Sites",
        href: "/admin/sites",
        icon: Globe
      },
      {
        title: "API Integration",
        href: "/admin/sites/integration",
        icon: Code
      }
    ]
  },
  {
    title: "Configuration",
    icon: Bot,
    subItems: [
      {
        title: "AutoNewsConfig",
        href: "/admin/autonews",
        icon: Bot
      },
      {
        title: "AutoRestaurantConfig",
        href: "/admin/autorestaurant",
        icon: Utensils
      }
    ]
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
  const { logout, user } = useAuth();
  const isCollapsed = state === "collapsed";
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  useEffect(() => {
    const activeSubmenus = SidebarItems.filter(item =>
      item.subItems?.some(sub => pathname.startsWith(sub.href))
    ).map(item => item.title);

    if (activeSubmenus.length > 0) {
      setOpenSubMenus(prev => Array.from(new Set([...prev, ...activeSubmenus])));
    }
  }, [pathname]);

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const filteredSidebarItems = SidebarItems.filter(item => {
    // If user is CEO, only show Mailing List, Articles and Calendar
    if (user?.roles?.includes('ceo')) {
      return item.title === "Mailing List" || item.title === "Articles" || item.title === "Calendar";
    }
    // If user is Editor, only show Articles, Settings and Calendar
    if (user?.roles?.includes('editor')) {
      return item.title === "Articles" || item.title === "Settings" || item.title === "Calendar";
    }
    // Default: show all for admin or other roles
    return true;
  });

  return (
    <Sidebar collapsible="icon" className="border-none">
      <div className="flex flex-col h-full bg-sidebar text-white">
        <SidebarHeader className="px-4 py-6 border-b border-[rgba(255,255,255,0.1)]">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2">
              <img
                src="/images/HomesLogoW.png"
                alt="Homes.ph News"
                className="h-12 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src="/images/HLogo.png"
                alt="Homes.ph News"
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-4 py-6 overflow-y-auto">
          <SidebarMenu className="space-y-2">
            {filteredSidebarItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSubMenuOpen = openSubMenus.includes(item.title);

              let href = item.href || "";
              if (item.title === "Articles") {
                if (user?.roles?.includes('ceo')) href = "/ceo/articles";
                else if (user?.roles?.includes('editor')) href = "/editor/articles";
              } else if (item.title === "Calendar") {
                if (user?.roles?.includes('ceo')) href = "/ceo/calendar";
                else if (user?.roles?.includes('editor')) href = "/editor/calendar";
              } else if (item.title === "Settings") {
                 if (user?.roles?.includes('editor')) href = "/editor/settings";
              }

              const isActive = hasSubItems
                ? item.subItems?.some(sub => pathname.startsWith(sub.href))
                : (href === "/admin" || href === "/ceo" ? pathname === href : pathname.startsWith(href));

              return (
                <SidebarMenuItem key={item.title}>
                  {hasSubItems ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleSubMenu(item.title)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full h-auto text-left",
                          isActive
                            ? "bg-[#F4AA1D] text-black hover:bg-[#F4AA1D] hover:text-black"
                            : "text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white",
                          isCollapsed ? "justify-center" : ""
                        )}
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="text-[14px] font-medium tracking-[-0.5px] flex-1">
                              {item.title}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isSubMenuOpen && "rotate-180")} />
                          </>
                        )}
                      </SidebarMenuButton>

                      {isSubMenuOpen && !isCollapsed && (
                        <SidebarMenuSub className="mt-1 ml-4 space-y-1 border-l border-[rgba(255, 255, 255, 0.98)]">
                          {item.subItems?.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            const SubIcon = subItem.icon;
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "group flex items-center gap-2 px-3 py-2 rounded-[6px] transition-colors text-[13px] w-full",
                                      isSubActive ? "text-[#F4AA1D] font-semibold" : "text-white"
                                    )}
                                  >
                                    {SubIcon && (
                                      <SubIcon
                                        className={cn(
                                          "w-3.5 h-3.5 transition-colors",
                                          isSubActive ? "text-[#F4AA1D]" : "text-white/70 group-hover:text-white"
                                        )}
                                      />
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full h-auto",
                        isActive
                          ? "bg-[#F4AA1D] text-black hover:bg-[#F4AA1D] hover:text-white"
                          : "text-white hover:bg-[rgba(255, 255, 255, 1)] hover:text-white",
                        isCollapsed ? "justify-center" : ""
                      )}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center w-full",
                          isCollapsed ? "justify-center" : ""
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="text-[14px] font-medium tracking-[-0.5px]">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="px-4 py-4 border-t border-[#2a2d3e]">
          <button
            onClick={async () => {
              await logout();
              window.location.href = '/login';
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white rounded-[8px] transition-colors w-full",
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