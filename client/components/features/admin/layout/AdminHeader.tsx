"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-[#f3f4f6] px-8 py-6 h-auto shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:bg-gray-100 transition-colors" />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[16px] font-medium text-[#111827] tracking-[-0.5px]">John Smith</p>
          <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Admin</p>
        </div>
        <Avatar className="w-[50px] h-[50px]">
          <AvatarImage src="/images/avatar-placeholder.jpg" alt="John Smith" className="object-cover" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
