'use client';

import { useState, useEffect, useRef } from "react";
import { Lock, Save, Upload, User } from "lucide-react";
import { FormInput } from "@/components/features/admin/shared/FormFields";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAuth, updateProfile } from "@/lib/api-v2";

interface ProfileSettingsProps {
    title?: string;
    description?: string;
}

export default function ProfileSettings({
    title = "Profile Information",
    description = "Manage your personal account details"
}: ProfileSettingsProps) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, updateUser } = useAuth();

    // Profile Data
    const [profile, setProfile] = useState({
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        email: user?.email || "",
        avatar: user?.avatar || null
    });

    // Update profile state when user changes (e.g. hydration)
    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                email: user.email || "",
                avatar: user.avatar || null
            });
        }
    }, [user]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const response = await updateProfile({
                first_name: profile.firstName,
                last_name: profile.lastName,
                avatar: profile.avatar
            });

            if (response.data.data) {
                updateUser(response.data.data);
                alert("Profile updated successfully!");
            }
        } catch (e: any) {
            console.error("Failed to save profile", e);
            const message = e.response?.data?.message || "Failed to save profile.";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
            <div className="flex items-start gap-3 mb-8">
                <div className="w-12 h-12 bg-[#dbeafe] rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <div>
                    <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                        {title}
                    </h2>
                    <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                        {description}
                    </p>
                </div>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#e5e7eb]">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 bg-[#f3f4f6] rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
                        title="Upload photo"
                    >
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-[#9ca3af]" />
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>
                <div>
                    <p className="text-[16px] font-bold text-[#111827] tracking-[-0.5px] mb-1">
                        {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-3">
                        {profile.email}
                    </p>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#C10007] border border-[#C10007] rounded-[6px] hover:bg-[#fef2f2] transition-colors tracking-[-0.5px] font-medium"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                />
                <FormInput
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                />
            </div>
            <FormInput
                label="Email Address"
                value={profile.email}
                disabled={true}
                onChange={() => { }} // Read only
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-[#e5e7eb]">
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-[14px] text-[#3b82f6] border border-[#3b82f6] rounded-[8px] hover:bg-[#eff6ff] transition-colors tracking-[-0.5px] font-medium"
                >
                    <Lock className="w-4 h-4" />
                    Change Password
                </button>

                <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-colors text-[14px] font-medium tracking-[-0.5px] shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                >
                    {isLoading ? "Saving..." : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Profile Changes
                        </>
                    )}
                </button>
            </div>

            <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
}
