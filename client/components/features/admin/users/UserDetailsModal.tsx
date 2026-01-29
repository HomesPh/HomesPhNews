"use client";

import { X, CheckCircle, XCircle } from 'lucide-react';
import { AdminUser } from "@/app/admin/users/data";

interface UserDetailsModalProps {
    user: AdminUser;
    onClose: () => void;
    onApprove: (user: AdminUser) => void;
}

export default function UserDetailsModal({ user, onClose, onApprove }: UserDetailsModalProps) {
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

                    {/* Verification Documents */}
                    {user.verificationIdUrl && (
                        <div>
                            <h3 className="text-[16px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">Verification Document</h3>
                            <div className="p-3 border border-[#e5e7eb] rounded-[10px] bg-gray-50 max-w-[400px]">
                                <img
                                    src={user.verificationIdUrl}
                                    alt="Verification ID"
                                    className="w-full h-[180px] object-cover rounded-lg mb-3 shadow-sm border border-gray-200"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-semibold text-[#111827] tracking-[-0.5px]">Government ID</div>
                                            <div className="text-[11px] text-[#6b7280] tracking-[-0.5px]">Uploaded {user.joinedDate}</div>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 text-[12px] font-bold text-blue-600 hover:bg-blue-100 rounded-[6px] transition-colors border border-blue-200 bg-white">
                                        Full View
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-[#e5e7eb] bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-[14px] font-bold text-[#6b7280] hover:text-[#111827] transition-colors"
                    >
                        Close
                    </button>
                    {user.status === 'pending' && (
                        <button
                            onClick={() => onApprove(user)}
                            className="px-6 py-2 bg-green-600 text-white rounded-[8px] hover:bg-green-700 transition-colors text-[14px] font-bold shadow-sm"
                        >
                            Approve User
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
