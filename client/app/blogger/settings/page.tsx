"use client";

import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { User, Shield, Bell, Globe } from "lucide-react";

export default function BloggerSettingsPage() {
    return (
        <div className="p-8 space-y-8 font-inter">
            <AdminPageHeader
                title="Settings"
                description="Manage your profile and platform preferences."
            />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-4xl">
                <div className="p-8 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[#C10007]">
                            <User className="w-5 h-5" />
                            <h3 className="font-bold tracking-tight">Profile Information</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-gray-700">Display Name</label>
                                <input type="text" defaultValue="Maria Santos" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-gray-700">Email Address</label>
                                <input type="email" defaultValue="maria.santos@email.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-[#C10007]">
                            <Bell className="w-5 h-5" />
                            <h3 className="font-bold tracking-tight">Notification Preferences</h3>
                        </div>
                        <div className="space-y-3">
                            {['Email on new comments', 'Weekly performance reports', 'Platform announcements'].map(pref => (
                                <label key={pref} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#C10007] focus:ring-[#C10007]" />
                                    <span className="text-sm text-gray-600">{pref}</span>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="bg-gray-50 p-6 flex justify-end">
                    <button className="px-6 py-2 bg-[#C10007] text-white font-bold rounded-lg text-sm hover:bg-[#A00006] transition-all">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
