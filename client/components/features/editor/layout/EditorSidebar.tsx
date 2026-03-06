"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { FileText, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/api-v2";

const SidebarItems = [
    {
        title: "Articles",
        href: "/editor/articles",
        icon: FileText
    },
    {
        title: "Settings",
        href: "/editor/settings",
        icon: Settings
    }
]

export default function EditorSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const { logout } = useAuth();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" className="border-none">
            <div className="flex flex-col h-full bg-[#000785] text-white">
                <SidebarHeader className="px-4 py-6 border-b border-[rgba(255,255,255,0.1)]">
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3 px-2">
                            <img
                                src="/images/HomesLogoW.png"
                                alt="Homes.ph News"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <img
                                src="/images/HLogo.png"
                                alt="Homes.ph News"
                                className="w-6 h-6 object-contain"
                            />
                        </div>
                    )}
                </SidebarHeader>

                <SidebarContent className="px-4 py-6 overflow-y-auto">
                    <SidebarMenu className="space-y-2">
                        {SidebarItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full h-auto",
                                            isActive
                                                ? "bg-[#F4AA1D] text-black hover:bg-[#F4AA1D] hover:text-black"
                                                : "text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white",
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
                        onClick={async () => {
                            await logout();
                            window.location.href = '/admin/login';
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
