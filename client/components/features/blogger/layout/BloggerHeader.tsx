"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export default function BloggerHeader() {
    // Mock blogger data
    const user = {
        name: "Maria Santos",
        email: "maria.santos@email.com",
        avatar: "https://github.com/shadcn.png"
    };

    return (
        <header className="bg-white border-b border-[#f3f4f6] px-8 py-6 h-auto shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 hover:bg-gray-100 transition-colors" />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">Blogger</span>
                    </div>
                    <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
