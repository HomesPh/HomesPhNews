"use client";

import { useState, useRef, useEffect } from 'react';
import {
    CheckCircle, Eye, Ban,
    FileText, MoreVertical, Edit, Trash2, Lock, ShieldAlert
} from 'lucide-react';
import { AdminUser } from "@/app/admin/users/data";
import { cn } from "@/lib/utils";

interface UsersTableProps {
    users: AdminUser[];
    onViewDetails: (user: AdminUser) => void;
    onSuspend: (user: AdminUser) => void;
    onUnsuspend: (user: AdminUser) => void;
    onBan: (user: AdminUser) => void;
    onUnban: (user: AdminUser) => void;
    onViewBlogs: (userName: string) => void;
    onEdit: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
    onChangePassword: (user: AdminUser) => void;
}

export default function UsersTable({
    users,
    onViewDetails,
    onSuspend,
    onUnsuspend,
    onBan,
    onUnban,
    onViewBlogs,
    onEdit,
    onDelete,
    onChangePassword
}: UsersTableProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <div className="overflow-visible min-h-[400px] mb-20">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">USER</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">ROLE</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">STATUS</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">BLOGS</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">LAST ACTIVE</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="border-b border-[#e5e7eb] hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() => onViewBlogs(user.name)}
                        >
                            <td className="px-5 py-4">
                                <div>
                                    <div className="text-[15px] font-semibold text-[#111827] tracking-[-0.5px]">
                                        {user.name}
                                    </div>
                                    <div className="text-[13px] text-[#6b7280] tracking-[-0.5px] mt-0.5">
                                        {user.email}
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <span className={cn(
                                    "inline-flex items-center px-3 py-1 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]",
                                    user.role === 'Admin'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                )}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-5 py-4">
                                {user.status === 'active' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Active
                                    </span>
                                )}
                                {user.status === 'suspended' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]">
                                        <Ban className="w-3.5 h-3.5" />
                                        Suspended
                                    </span>
                                )}
                                {user.status === 'banned' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]">
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                        Banned
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4">
                                {user.role === 'Blogger' ? (
                                    <div className="flex items-center gap-1.5 text-[15px] font-semibold text-blue-600 tracking-[-0.5px]">
                                        <FileText className="w-4 h-4" />
                                        {user.blogsPublished}
                                    </div>
                                ) : (
                                    <span className="text-[15px] font-semibold text-[#6b7280] tracking-[-0.5px]">
                                        N/A
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4">
                                <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">
                                    {user.lastActive}
                                </span>
                            </td>
                            <td className="px-5 py-4 relative">
                                <button
                                    onClick={(e) => toggleMenu(e, user.id)}
                                    className="p-2 hover:bg-gray-100 rounded-[6px] transition-colors text-gray-500"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {openMenuId === user.id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-1">
                                            <button
                                                onClick={() => {
                                                    onViewDetails(user);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-blue-600" />
                                                View Profile
                                            </button>

                                            <button
                                                onClick={() => {
                                                    onEdit(user);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                                Edit User
                                            </button>

                                            <button
                                                onClick={() => {
                                                    onChangePassword(user);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            >
                                                <Lock className="w-4 h-4 text-gray-600" />
                                                Change Password
                                            </button>

                                            <div className="h-px bg-gray-100 my-1" />

                                            {user.status !== 'suspended' && user.status !== 'banned' && (
                                                <button
                                                    onClick={() => {
                                                        onSuspend(user);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors"
                                                >
                                                    <Ban className="w-4 h-4 text-orange-600" />
                                                    Suspend User
                                                </button>
                                            )}

                                            {user.status === 'suspended' && (
                                                <button
                                                    onClick={() => {
                                                        onUnsuspend(user);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    Unsuspend
                                                </button>
                                            )}

                                            {user.status !== 'banned' && (
                                                <button
                                                    onClick={() => {
                                                        onBan(user);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                                                >
                                                    <ShieldAlert className="w-4 h-4 text-red-600" />
                                                    Ban User
                                                </button>
                                            )}

                                            {user.status === 'banned' && (
                                                <button
                                                    onClick={() => {
                                                        onUnban(user);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    Unban User
                                                </button>
                                            )}

                                            <div className="h-px bg-gray-100 my-1" />

                                            <button
                                                onClick={() => {
                                                    onDelete(user);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
