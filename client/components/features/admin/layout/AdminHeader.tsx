"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">John Smith</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>
        <Avatar>
          <AvatarImage src="/images/avatar-placeholder.jpg" alt="John Smith" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
