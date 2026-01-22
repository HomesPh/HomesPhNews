import { useState } from 'react';
import { X, Eye, EyeOff, Lock } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[500px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#dbeafe] rounded-[8px] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
                Change Password
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 pr-12 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[12px] text-[#6b7280] mt-2 tracking-[-0.5px]">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 pr-12 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] p-4">
              <p className="text-[13px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Password Requirements:
              </p>
              <ul className="space-y-1 text-[12px] text-[#6b7280] tracking-[-0.5px]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#6b7280] rounded-full"></span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#6b7280] rounded-full"></span>
                  Contains uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#6b7280] rounded-full"></span>
                  Contains at least one number
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#6b7280] rounded-full"></span>
                  Contains at least one special character
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e7eb] px-8 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-colors text-[14px] font-medium tracking-[-0.5px]"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
