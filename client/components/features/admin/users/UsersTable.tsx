"use client";

import { CheckCircle, XCircle, Eye, Ban, UserCheck, FileText } from 'lucide-react';
import { AdminUser } from "@/app/admin/users/data";
import { cn } from "@/lib/utils";

interface UsersTableProps {
    users: AdminUser[];
    onViewDetails: (user: AdminUser) => void;
    onVerify: (user: AdminUser) => void;
    onSuspend: (user: AdminUser) => void;
    onUnsuspend: (user: AdminUser) => void;
    onViewBlogs: (userName: string) => void;
}

export default function UsersTable({
    users,
    onViewDetails,
    onVerify,
    onSuspend,
    onUnsuspend,
    onViewBlogs
}: UsersTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">USER</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">ROLE</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">STATUS</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">VERIFICATION</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">BLOGS</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">LAST ACTIVE</th>
                        <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#6b7280] tracking-[-0.5px]">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="border-b border-[#e5e7eb] hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => onViewBlogs(user.name)}
                        >
                            <td className="px-5 py-4">
                                <div>
                                    <div className="text-[15px] font-semibold text-[#111827] tracking-[-0.5px]">
                                        {user.name}
                                    </div>
                                    <div className="text-[13px] text-[#6b7280] tracking-[-0.5px] flex items-center gap-1.5 mt-0.5">
                                        {user.emailVerified ? (
                                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                        ) : (
                                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                                        )}
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
                                {user.status === 'verified' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                )}
                                {user.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        Pending
                                    </span>
                                )}
                                {user.status === 'suspended' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-[4px] text-[13px] font-medium tracking-[-0.5px]">
                                        <Ban className="w-3.5 h-3.5" />
                                        Suspended
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        {user.emailVerified ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Email</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {user.documentsVerified ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">ID</span>
                                    </div>
                                </div>
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
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDetails(user);
                                        }}
                                        className="p-2 hover:bg-blue-50 rounded-[6px] transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4 text-blue-600" />
                                    </button>
                                    {user.status === 'pending' && (
                                        <button
                                            onClick={() => onVerify(user)}
                                            className="p-2 hover:bg-green-50 rounded-[6px] transition-colors"
                                            title="Verify User"
                                        >
                                            <UserCheck className="w-4 h-4 text-green-600" />
                                        </button>
                                    )}
                                    {user.status !== 'suspended' ? (
                                        <button
                                            onClick={() => onSuspend(user)}
                                            className="p-2 hover:bg-red-50 rounded-[6px] transition-colors"
                                            title="Suspend User"
                                        >
                                            <Ban className="w-4 h-4 text-red-600" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onUnsuspend(user)}
                                            className="p-2 hover:bg-green-50 rounded-[6px] transition-colors"
                                            title="Unsuspend User"
                                        >
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
