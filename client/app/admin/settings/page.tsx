"use client";

import { useRef, useState } from "react";
import { Lock, Save, Upload, User } from "lucide-react";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import ChangePasswordModal from "@/components/features/admin/settings/ChangePasswordModal";
import { FormInput, FormSelect } from "@/components/features/admin/shared/FormFields";

export default function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "Admin User",
    username: "admin",
    email: "admin@globalnews.com",
    role: "Super Admin",
    phone: "+971 50 123 4567",
  });

  const openFilePicker = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    // Simple client-side preview (no backend upload yet)
    const url = URL.createObjectURL(file);
    setPhotoPreviewUrl(url);
  };

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <AdminPageHeader
        title="Settings"
        description="Manage your admin credentials"
      />

      <div className="space-y-8">
        {/* Admin Credentials Section */}
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-12 h-12 bg-[#dbeafe] rounded-[8px] flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                Admin Credentials
              </h2>
              <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                Manage your admin account information
              </p>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#e5e7eb]">
            <div className="relative">
              <button
                type="button"
                onClick={openFilePicker}
                className="w-24 h-24 bg-[#f3f4f6] rounded-full flex items-center justify-center overflow-hidden"
                title="Upload photo"
              >
                {photoPreviewUrl ? (
                  <img
                    src={photoPreviewUrl}
                    alt="Profile photo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-[#9ca3af]" />
                )}
              </button>

              <button
                type="button"
                onClick={openFilePicker}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#C10007] rounded-full flex items-center justify-center"
                title="Upload photo"
              >
                <Upload className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#111827] tracking-[-0.5px] mb-1">
                {formData.fullName}
              </p>
              <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-3">
                {formData.email}
              </p>
              <button
                type="button"
                onClick={openFilePicker}
                className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#C10007] border border-[#C10007] rounded-[6px] hover:bg-[#fef2f2] transition-colors tracking-[-0.5px] font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <FormInput
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              {/* Timezone intentionally omitted (per request) */}
              <FormSelect
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { value: "Super Admin", label: "Super Admin" },
                  { value: "Admin", label: "Admin" },
                  { value: "Editor", label: "Editor" },
                  { value: "Viewer", label: "Viewer" },
                ]}
              />
            </div>

            <div className="pt-6 border-t border-[#e5e7eb]">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-[14px] text-[#3b82f6] border border-[#3b82f6] rounded-[8px] hover:bg-[#eff6ff] transition-colors tracking-[-0.5px] font-medium"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Appearance section intentionally omitted (per request) */}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-3 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-colors text-[16px] font-medium tracking-[-0.5px]"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}


