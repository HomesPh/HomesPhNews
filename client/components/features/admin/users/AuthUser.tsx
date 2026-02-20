"use client";

import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthUser() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-[50px] w-[50px] rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Use the first role or default to 'Admin' if no roles
  const displayRole = user.roles && user.roles.length > 0 ? user.roles[0] : "Admin";

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-[16px] font-medium text-[#111827] tracking-[-0.5px]">
          {user.name}
        </p>
        <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] capitalize">
          {displayRole}
        </p>
      </div>
      <Avatar className="h-12.5 w-12.5">
        <AvatarImage
          src={user.avatar || "/images/avatar-placeholder.jpg"}
          alt={user.name}
          className="object-cover"
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
}