"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Save, Upload, User, CheckCircle2, Building, Palette, Globe } from "lucide-react";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import ChangePasswordModal from "@/components/features/admin/settings/ChangePasswordModal";
import { FormInput } from "@/components/features/admin/shared/FormFields";

// Theme Presets for easy customization
const THEME_PRESETS = [
    {
        id: "midnight",
        label: "Midnight",
        sidebarBg: "#1a1d2e",
        sidebarText: "#ffffff",
        primary: "#C10007",
        activeText: "#ffffff"
    },
    {
        id: "light",
        label: "Light",
        sidebarBg: "#ffffff",
        sidebarText: "#1f2937",
        primary: "#C10007",
        activeText: "#ffffff"
    },
    {
        id: "dark-red",
        label: "Crimson",
        sidebarBg: "#4a0404",
        sidebarText: "#ffffff",
        primary: "#ff4d4d",
        activeText: "#ffffff"
    },
    {
        id: "navy",
        label: "Navy",
        sidebarBg: "#0f172a",
        sidebarText: "#cbd5e1",
        primary: "#3b82f6",
        activeText: "#ffffff"
    },
    {
        id: "forest",
        label: "Forest",
        sidebarBg: "#064e3b",
        sidebarText: "#d1fae5",
        primary: "#10b981",
        activeText: "#000000"
    }
];

export default function SettingsPage() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Profile Data
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatar: null as string | null
    });

    // Branding & Theme Data
    const [branding, setBranding] = useState({
        companyName: "",
        logo: "/images/HomesTVwhite.png"
    });

    const [currentTheme, setCurrentTheme] = useState(THEME_PRESETS[0]);
    const [customColors, setCustomColors] = useState({
        sidebarBg: "#1a1d2e",
        sidebarText: "#ffffff",
        primary: "#C10007"
    });
    const [isCustomTheme, setIsCustomTheme] = useState(false);

    // Site Info
    const [siteInfo, setSiteInfo] = useState({
        siteName: "",
        siteUrl: ""
    });

    // Load initial data
    useEffect(() => {
        const loadSettings = () => {
            try {
                // Load User Profile
                const userStr = localStorage.getItem('user_info');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    setProfile({
                        firstName: userData.firstName || "",
                        lastName: userData.lastName || "",
                        email: userData.email || "",
                        avatar: userData.avatar || null
                    });
                }

                // Load Preferences/Branding
                const prefsStr = localStorage.getItem('user_preferences');
                if (prefsStr) {
                    const prefs = JSON.parse(prefsStr);
                    setBranding({
                        companyName: prefs.customization?.companyName || "",
                        logo: prefs.customization?.logo || "/images/HomesTVwhite.png"
                    });

                    // Load Theme
                    const savedTheme = prefs.customization?.themeObj;
                    if (savedTheme) {
                        setCurrentTheme(savedTheme);
                        if (savedTheme.id === 'custom') {
                            setIsCustomTheme(true);
                            setCustomColors({
                                sidebarBg: savedTheme.sidebarBg,
                                sidebarText: savedTheme.sidebarText,
                                primary: savedTheme.primary
                            });
                        } else {
                            // Try to match preset
                            const preset = THEME_PRESETS.find(p => p.id === savedTheme.id);
                            if (preset) setCurrentTheme(preset);
                        }
                    }

                    // Load Site Info
                    setSiteInfo({
                        siteName: prefs.customization?.siteName || "",
                        siteUrl: prefs.customization?.siteUrl || ""
                    });
                }
            } catch (e) {
                console.error("Failed to load settings", e);
            }
        };
        loadSettings();
    }, []);

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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBranding(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const applyTheme = (theme: typeof THEME_PRESETS[0]) => {
        setCurrentTheme(theme);
        setIsCustomTheme(theme.id === 'custom');
        if (theme.id === 'custom') {
            setCustomColors({
                sidebarBg: theme.sidebarBg,
                sidebarText: theme.sidebarText,
                primary: theme.primary
            });
        }
    };

    const handleCustomColorChange = (key: keyof typeof customColors, value: string) => {
        const newColors = { ...customColors, [key]: value };
        setCustomColors(newColors);

        // Update current theme object in real-time preview style
        const newCustomTheme = {
            id: 'custom',
            label: 'Custom',
            sidebarBg: newColors.sidebarBg,
            sidebarText: newColors.sidebarText,
            primary: newColors.primary,
            activeText: '#ffffff' // Default for custom
        };
        setCurrentTheme(newCustomTheme);
        setIsCustomTheme(true);
    };

    const handleSaveSettings = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Save Profile
            const userInfo = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                avatar: profile.avatar
            };
            localStorage.setItem('user_info', JSON.stringify(userInfo));

            // Save Preferences
            const currentPrefs = JSON.parse(localStorage.getItem('user_preferences') || '{}');
            const newPrefs = {
                ...currentPrefs,
                customization: {
                    ...currentPrefs.customization,
                    companyName: branding.companyName,
                    logo: branding.logo,
                    themeObj: currentTheme,
                    siteName: siteInfo.siteName,
                    siteUrl: siteInfo.siteUrl,
                }
            };
            localStorage.setItem('user_preferences', JSON.stringify(newPrefs));

            // Dispatch event for Sidebar update
            window.dispatchEvent(new Event('storage'));

            alert("Settings saved successfully!");
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Subscriber Settings"
                description="Manage your profile, branding, and portal customization"
            />

            <div className="space-y-8">
                {/* 1. Profile Section */}
                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
                    <div className="flex items-start gap-3 mb-8">
                        <div className="w-12 h-12 bg-[#dbeafe] rounded-[8px] flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-[#3b82f6]" />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                Profile Information
                            </h2>
                            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                Manage your personal account details
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

                    <div className="grid grid-cols-2 gap-6 mb-6">
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

                    <div className="pt-6 mt-6 border-t border-[#e5e7eb]">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 text-[14px] text-[#3b82f6] border border-[#3b82f6] rounded-[8px] hover:bg-[#eff6ff] transition-colors tracking-[-0.5px] font-medium"
                        >
                            <Lock className="w-4 h-4" />
                            Change Password
                        </button>
                    </div>
                </div>

                {/* 2. Branding Section */}
                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
                    <div className="flex items-start gap-3 mb-8">
                        <div className="w-12 h-12 bg-orange-100 rounded-[8px] flex items-center justify-center flex-shrink-0">
                            <Building className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                Company Branding
                            </h2>
                            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                Customize your portal with your brand identity
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <FormInput
                            label="Company Name"
                            placeholder="e.g. Acme Corp"
                            value={branding.companyName}
                            onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Site Name"
                                placeholder="e.g. My News Portal"
                                value={siteInfo.siteName}
                                onChange={(e) => setSiteInfo({ ...siteInfo, siteName: e.target.value })}
                            />
                            <div>
                                <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Site URL
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        placeholder="https://yoursite.com"
                                        value={siteInfo.siteUrl}
                                        onChange={(e) => setSiteInfo({ ...siteInfo, siteUrl: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2.5 text-[14px] border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                                Company Logo
                            </label>
                            <div className="flex items-start gap-6">
                                <div className="w-32 h-32 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                                    <img src={branding.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="logo-upload"
                                            onChange={handleLogoUpload}
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[14px] text-[#C10007] border border-[#C10007] rounded-[6px] hover:bg-[#fef2f2] transition-colors tracking-[-0.5px] font-medium w-fit"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload Logo
                                        </label>
                                    </div>
                                    <p className="text-[12px] text-gray-500">
                                        Recommended: PNG with transparent background.<br />Max size: 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Theme Customization */}
                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
                    <div className="flex items-start gap-3 mb-8">
                        <div className="w-12 h-12 bg-purple-100 rounded-[8px] flex items-center justify-center flex-shrink-0">
                            <Palette className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                Portal Theme
                            </h2>
                            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                Personalize the look and feel of your dashboard
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Presets */}
                        <div>
                            <label className="block text-[14px] font-semibold text-[#111827] mb-3 tracking-[-0.5px]">
                                Theme Presets
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {THEME_PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => applyTheme(preset)}
                                        className={`relative group p-3 rounded-xl border-2 transition-all hover:scale-105 flex flex-col items-center gap-2 ${currentTheme.id === preset.id
                                            ? 'border-[#C10007] bg-gray-50'
                                            : 'border-transparent hover:border-gray-200 bg-gray-50/50'
                                            }`}
                                    >
                                        <div className="flex gap-1 mb-1">
                                            <div className="w-4 h-8 rounded-l-sm" style={{ backgroundColor: preset.sidebarBg }}></div>
                                            <div className="w-8 h-8 rounded-r-sm bg-gray-200 relative">
                                                <div className="absolute top-1 left-1 w-6 h-2 rounded-sm" style={{ backgroundColor: preset.primary }}></div>
                                            </div>
                                        </div>
                                        <span className={`font-medium text-xs ${currentTheme.id === preset.id ? 'text-[#C10007]' : 'text-gray-600'}`}>
                                            {preset.label}
                                        </span>
                                        {currentTheme.id === preset.id && (
                                            <div className="absolute top-2 right-2 text-[#C10007]">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Colors */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="custom-mode"
                                    className="rounded border-gray-300 text-[#C10007] focus:ring-[#C10007]"
                                    checked={isCustomTheme}
                                    onChange={(e) => {
                                        setIsCustomTheme(e.target.checked);
                                        if (e.target.checked) {
                                            const custom = { ...currentTheme, id: 'custom', label: 'Custom' };
                                            setCurrentTheme(custom);
                                        }
                                    }}
                                />
                                <label htmlFor="custom-mode" className="text-[14px] font-medium text-gray-700 select-none cursor-pointer">
                                    Enable Advanced Color Customization
                                </label>
                            </div>

                            {isCustomTheme && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Sidebar Background</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={customColors.sidebarBg}
                                                onChange={(e) => handleCustomColorChange('sidebarBg', e.target.value)}
                                                className="h-9 w-9 p-0 border-0 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={customColors.sidebarBg}
                                                onChange={(e) => handleCustomColorChange('sidebarBg', e.target.value)}
                                                className="flex-1 h-9 px-3 border border-gray-200 rounded-md text-sm font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Sidebar Text</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={customColors.sidebarText}
                                                onChange={(e) => handleCustomColorChange('sidebarText', e.target.value)}
                                                className="h-9 w-9 p-0 border-0 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={customColors.sidebarText}
                                                onChange={(e) => handleCustomColorChange('sidebarText', e.target.value)}
                                                className="flex-1 h-9 px-3 border border-gray-200 rounded-md text-sm font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Primary Accent</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={customColors.primary}
                                                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                                                className="h-9 w-9 p-0 border-0 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={customColors.primary}
                                                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                                                className="flex-1 h-9 px-3 border border-gray-200 rounded-md text-sm font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSaveSettings}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-colors text-[16px] font-medium tracking-[-0.5px] shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save All Settings
                            </>
                        )}
                    </button>
                </div>
            </div>

            <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
}
