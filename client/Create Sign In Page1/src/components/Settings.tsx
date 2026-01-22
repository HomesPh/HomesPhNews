import { useState } from 'react';
import { 
  User, 
  Upload, 
  Lock, 
  Save, 
  Palette
} from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';

interface SettingsProps {
  sidebarCollapsed: boolean;
  onNavigate: (page: string) => void;
}

export function Settings({ sidebarCollapsed, onNavigate }: SettingsProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@globalnews.com',
    role: 'Super Admin',
    phone: '+971 50 123 4567',
    timezone: 'Asia/Dubai (GMT+4)'
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactMode: false,
    showAvatars: true
  });

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
          Settings
        </h1>
        <p className="text-[14px] text-[#6b7280] mt-1 tracking-[-0.5px] leading-[20px]">
          Manage your admin credentials and appearance preferences
        </p>
      </div>

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
              <div className="w-24 h-24 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-[#9ca3af]" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#C10007] rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#111827] tracking-[-0.5px] mb-1">Admin User</p>
              <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-3">admin@globalnews.com</p>
              <button className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#C10007] border border-[#C10007] rounded-[6px] hover:bg-[#fef2f2] transition-colors tracking-[-0.5px] font-medium">
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                >
                  <option>Asia/Dubai (GMT+4)</option>
                  <option>Asia/Manila (GMT+8)</option>
                  <option>Asia/Singapore (GMT+8)</option>
                  <option>America/New_York (GMT-5)</option>
                  <option>Europe/London (GMT+0)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              >
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
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

        {/* Appearance Section */}
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-12 h-12 bg-[#fce7f3] rounded-[8px] flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 text-[#ec4899]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                Appearance Settings
              </h2>
              <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                Customize the look and feel of your admin panel
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-3 tracking-[-0.5px]">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'light' })}
                  className={`p-4 border-2 rounded-[8px] text-left transition-all ${
                    appearanceSettings.theme === 'light'
                      ? 'border-[#3b82f6] bg-[#eff6ff]'
                      : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white border border-[#e5e7eb] rounded"></div>
                    <p className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">Light Mode</p>
                  </div>
                  <p className="text-[12px] text-[#6b7280] tracking-[-0.5px]">
                    Clean and bright interface
                  </p>
                </button>
                <button
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })}
                  className={`p-4 border-2 rounded-[8px] text-left transition-all ${
                    appearanceSettings.theme === 'dark'
                      ? 'border-[#3b82f6] bg-[#eff6ff]'
                      : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#1f2937] border border-[#374151] rounded"></div>
                    <p className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">Dark Mode</p>
                  </div>
                  <p className="text-[12px] text-[#6b7280] tracking-[-0.5px]">
                    Easy on the eyes
                  </p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-[#e5e7eb]">
              <div>
                <p className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] mb-1">
                  Compact Mode
                </p>
                <p className="text-[13px] text-[#6b7280] tracking-[-0.5px]">
                  Reduce spacing and padding for denser layout
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appearanceSettings.compactMode}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] mb-1">
                  Show Avatars
                </p>
                <p className="text-[13px] text-[#6b7280] tracking-[-0.5px]">
                  Display user avatars in articles and comments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appearanceSettings.showAvatars}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showAvatars: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
              </label>
            </div>
          </div>
        </div>

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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
