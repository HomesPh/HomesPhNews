"use client";

import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { AdminUser } from "@/app/admin/users/data";

interface ChangePasswordModalProps {
    user: AdminUser;
    onClose: () => void;
    onChangePassword: (id: string, newPassword: string) => void;
}

export default function ChangePasswordModal({ user, onClose, onChangePassword }: ChangePasswordModalProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        onChangePassword(user.id, password);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[12px] w-full max-w-[500px] shadow-2xl">
                <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">Change Password</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-[#6b7280]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-[14px] text-blue-700">
                            Changing password for <span className="font-semibold">{user.name}</span> ({user.email}).
                        </p>
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                            New Password <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="w-full h-[50px] px-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                            Confirm Password <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            className="w-full h-[50px] px-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-[14px] font-medium animate-in fade-in">
                            {error}
                        </div>
                    )}

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
                            <Lock className="w-4 h-4" />
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
