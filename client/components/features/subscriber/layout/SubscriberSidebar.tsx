"use client";
import { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, BarChart3, LogOut, CreditCard, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/api-v2";

const SidebarItems = [
    {
        title: "Dashboard",
        href: "/subscriber",
        icon: LayoutDashboard
    },
    {
        title: "Articles",
        href: "/subscriber/articles",
        icon: FileText
    },
    {
        title: "Analytics",
        href: "/subscriber/analytics",
        icon: BarChart3
    },
    {
        title: "Subscription",
        href: "/subscriber/subscription",
        icon: CreditCard
    },
    {
        title: "Settings",
        href: "/subscriber/settings",
        icon: Settings
    }
]

export default function SubscriberSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const { logout } = useAuth();
    const isCollapsed = state === "collapsed";

    // Customization State
    const [branding, setBranding] = useState({
        logo: "/images/HomesTVwhite.png",
        name: "HomesTV"
    });

    const [theme, setTheme] = useState({
        sidebarBg: "#1a1d2e",
        sidebarText: "#ffffff",
        primary: "#C10007",
        activeText: "#ffffff"
    });

    useEffect(() => {
        const loadPreferences = () => {
            try {
                const stored = localStorage.getItem('user_preferences');
                if (stored) {
                    const prefs = JSON.parse(stored);

                    // Load Branding
                    setBranding({
                        logo: prefs.customization?.logo || "/images/HomesTVwhite.png",
                        name: prefs.customization?.companyName || "HomesTV"
                    });

                    // Load Theme
                    const themeObj = prefs.customization?.themeObj;
                    if (themeObj) {
                        setTheme({
                            sidebarBg: themeObj.sidebarBg || "#1a1d2e",
                            sidebarText: themeObj.sidebarText || "#ffffff",
                            primary: themeObj.primary || "#C10007",
                            activeText: themeObj.activeText || "#ffffff"
                        });
                    } else if (prefs.customization?.theme) {
                        // Fallback for legacy simple hex theme
                        const COLOR_MAP: Record<string, string> = {
                            red: "#C10007",
                            blue: "#0066cc",
                            green: "#008000",
                            purple: "#6600cc",
                            orange: "#ff6600"
                        };
                        const color = COLOR_MAP[prefs.customization.theme] || prefs.customization.theme || "#C10007";
                        setTheme(prev => ({ ...prev, primary: color }));
                    }
                }
            } catch (e) {
                console.error("Failed to load user preferences", e);
            }
        };

        loadPreferences();
        window.addEventListener('storage', loadPreferences);
        return () => window.removeEventListener('storage', loadPreferences);
    }, []);

    return (
        <Sidebar collapsible="icon" className="border-none">
            <div
                className="flex flex-col h-full transition-colors duration-300"
                style={{ backgroundColor: theme.sidebarBg, color: theme.sidebarText }}
            >
                <SidebarHeader className="px-4 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3 px-2">
                            <img
                                src={branding.logo}
                                alt={branding.name}
                                className="w-10 h-10 object-contain"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-[20px] font-bold leading-[1.4] tracking-[-0.5px] truncate max-w-[150px]" style={{ color: theme.sidebarText }}>
                                    {branding.name}
                                </h1>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <img
                                src={branding.logo}
                                alt={branding.name}
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
                                            !isActive && "hover:bg-white/10",
                                            isCollapsed ? "justify-center" : ""
                                        )}
                                        style={isActive ? { backgroundColor: theme.primary, color: theme.activeText } : { color: theme.sidebarText }}
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

                <SidebarFooter className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={async () => {
                            await logout();
                            window.location.href = '/admin/login';
                        }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full",
                            "hover:bg-white/10",
                            isCollapsed ? "justify-center" : ""
                        )}
                        style={{ color: theme.sidebarText }}
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
