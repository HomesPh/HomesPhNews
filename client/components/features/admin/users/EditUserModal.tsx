"use client";

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { AdminUser } from "@/app/admin/users/data";

interface EditUserModalProps {
    user: AdminUser;
    onClose: () => void;
    onSave: (id: string, updates: Partial<AdminUser>) => void;
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Blogger' as 'Admin' | 'Blogger',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(user.id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[12px] w-full max-w-[500px] shadow-2xl">
                <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">Edit User</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-[#6b7280]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                            Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-[50px] px-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                            Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-[50px] px-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                            Role <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Blogger' })}
                                className="w-full h-[50px] px-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] appearance-none"
                            >
                                <option value="Blogger">Blogger</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-[14px] font-bold text-[#6b7280] hover:text-[#111827] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-2 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-all text-[14px] font-bold shadow-md shadow-red-900/10"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
