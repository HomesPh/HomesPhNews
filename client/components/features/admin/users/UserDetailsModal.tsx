"use client";

import { X } from 'lucide-react';
import { AdminUser } from "@/app/admin/users/data";

interface UserDetailsModalProps {
    user: AdminUser;
    onClose: () => void;
    onApprove?: (user: AdminUser) => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[12px] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">User Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-[#6b7280]" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* User Info */}
                    <div>
                        <h3 className="text-[16px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">Personal Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Name:</span>
                                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">{user.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Email:</span>
                                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">{user.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Role:</span>
                                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">{user.role}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Joined:</span>
                                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">{user.joinedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#e5e7eb] bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-[14px] font-bold text-[#6b7280] hover:text-[#111827] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
