'use client';

import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import ProfileSettings from "@/components/features/admin/settings/ProfileSettings";

export default function EditorSettingsPage() {
    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="w-full">
                <ProfileSettings />
            </div>
        </div>
    );
}
