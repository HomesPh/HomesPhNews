"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthUser from "../users/AuthUser";

export default function AdminHeader() {


  return (
    <header className="bg-white border-b border-[#f3f4f6] px-8 py-6 h-auto shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:bg-gray-100 transition-colors" />
      </div>

      <AuthUser />
    </header>
  );
}
