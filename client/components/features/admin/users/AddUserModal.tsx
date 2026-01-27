"use client";

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddUserModalProps {
    onClose: () => void;
    onAdd: (userData: any) => void;
}

export default function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Blogger',
        sendEmail: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[12px] w-full max-w-[500px] shadow-2xl">
                <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">Add New User</h2>
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
                            placeholder="e.g. Juan Dela Cruz"
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
                            placeholder="e.g. juan.delacruz@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                            Role <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.sendEmail}
                                    onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 checked:bg-[#C10007] checked:border-[#C10007] transition-all"
                                />
                                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-[14px] text-[#4b5563] font-medium tracking-[-0.5px] group-hover:text-[#111827] transition-colors">
                                Send invitation email and temporary password to user
                            </span>
                        </label>
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
                            <UserPlus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
