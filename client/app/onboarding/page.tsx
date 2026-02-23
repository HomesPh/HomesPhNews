"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Upload, Palette, Globe, Layers, ArrowRight, Loader2 } from "lucide-react";
import { Countries, Categories } from "@/app/data";

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

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Preferences State
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Customization State
    const [companyName, setCompanyName] = useState("");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [selectedThemeId, setSelectedThemeId] = useState(THEME_PRESETS[0].id);
    const [siteName, setSiteName] = useState("");
    const [siteUrl, setSiteUrl] = useState("");

    // Mock limits based on plan (retrieve from localStorage in real app)
    const MAX_COUNTRIES = 10;
    const MAX_CATEGORIES = 10;

    // Filter out "Global" and "All" options for onboarding
    const availableCountries = Countries.filter(c => c.id !== "Global");
    const availableCategories = Categories.filter(c => c.id !== "All");

    const handleCountryToggle = (id: string) => {
        if (selectedCountries.includes(id)) {
            setSelectedCountries(prev => prev.filter(c => c !== id));
        } else {
            if (selectedCountries.length < MAX_COUNTRIES) {
                setSelectedCountries(prev => [...prev, id]);
            } else {
                alert(`You can only select up to ${MAX_COUNTRIES} countries on your current plan.`);
            }
        }
    };

    const handleCategoryToggle = (id: string) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(prev => prev.filter(c => c !== id));
        } else {
            if (selectedCategories.length < MAX_CATEGORIES) {
                setSelectedCategories(prev => [...prev, id]);
            } else {
                alert(`You can only select up to ${MAX_CATEGORIES} categories on your current plan.`);
            }
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Mock upload - create object URL
            const url = URL.createObjectURL(file);
            setLogoUrl(url);
        }
    };

    const handleFinish = () => {
        setIsLoading(true);

        // Find full theme object
        const themeObj = THEME_PRESETS.find(t => t.id === selectedThemeId) || THEME_PRESETS[0];

        // Simulate saving preferences
        setTimeout(() => {
            const preferences = {
                countries: selectedCountries,
                categories: selectedCategories,
                customization: {
                    companyName,
                    logo: logoUrl,
                    themeObj: themeObj,
                    siteName,
                    siteUrl,
                },
                isSetupComplete: true
            };

            localStorage.setItem('user_preferences', JSON.stringify(preferences));

            // Redirect to Dashboard
            router.push('/subscriber');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b py-4 px-6 fixed top-0 w-full z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="/images/HomesTV.png" alt="HomesTV" className="h-8 w-auto object-contain" />
                    <span className="font-semibold text-gray-900">Setup</span>
                </div>
                <div className="text-sm text-gray-500">
                    Step {step} of 2
                </div>
            </div>

            <main className="flex-1 pt-24 pb-12 px-4 flex flex-col items-center max-w-4xl mx-auto w-full">

                {/* Step 1: Preferences */}
                {step === 1 && (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">Personalize your feed</h1>
                            <p className="text-gray-500">Select what matters most to you. Your plan allows up to {MAX_COUNTRIES} countries and {MAX_CATEGORIES} categories.</p>
                        </div>

                        {/* Countries */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-semibold">Regions of Interest</h2>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 ml-auto">
                                    {selectedCountries.length}/{MAX_COUNTRIES} selected
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {availableCountries.map(country => (
                                    <button
                                        key={country.id}
                                        onClick={() => handleCountryToggle(country.id)}
                                        className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${selectedCountries.includes(country.id)
                                            ? 'border-red-600 bg-red-50 ring-1 ring-red-600'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={`font-medium ${selectedCountries.includes(country.id) ? 'text-red-700' : 'text-gray-700'}`}>
                                            {country.label}
                                        </span>
                                        {selectedCountries.includes(country.id) && (
                                            <Check className="w-4 h-4 text-red-600 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-semibold">News Categories</h2>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 ml-auto">
                                    {selectedCategories.length}/{MAX_CATEGORIES} selected
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {availableCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryToggle(cat.id)}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedCategories.includes(cat.id)
                                            ? 'border-red-600 bg-red-600 text-white shadow-md transform scale-105'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => setStep(2)}
                                className="bg-gray-900 text-white hover:bg-black px-8 py-6 rounded-lg text-lg flex items-center gap-2"
                                disabled={selectedCountries.length === 0 || selectedCategories.length === 0}
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Customization */}
                {step === 2 && (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">Customize your workspace</h1>
                            <p className="text-gray-500">Make the dashboard feel like home. You can change these anytime in Settings.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Branding */}
                            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-lg font-semibold">Company Branding</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                                        <Input
                                            placeholder="Enter your company name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Your Site Name</label>
                                        <Input
                                            placeholder="e.g. My News Portal"
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Your Site URL</label>
                                        <Input
                                            placeholder="https://yoursite.com"
                                            type="url"
                                            value={siteUrl}
                                            onChange={(e) => setSiteUrl(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Company Logo (Simulated)</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleLogoUpload}
                                            />
                                            {logoUrl ? (
                                                <div className="relative">
                                                    <img src={logoUrl} alt="Logo Preview" className="h-16 w-auto object-contain" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                                        <span className="text-white text-xs">Change</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400">
                                                        <Upload className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-sm text-gray-600 font-medium">Click to upload logo</p>
                                                    <p className="text-xs text-gray-400">SVG, PNG, JPG (max 2MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Theme */}
                            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Palette className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-lg font-semibold">Color Theme</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {THEME_PRESETS.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedThemeId(theme.id)}
                                            className={`p-3 rounded-lg border flex items-center gap-4 transition-all ${selectedThemeId === theme.id
                                                ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex gap-1">
                                                <div className="w-4 h-8 rounded-l-sm" style={{ backgroundColor: theme.sidebarBg }}></div>
                                                <div className="w-8 h-8 rounded-r-sm bg-gray-200 relative">
                                                    <div className="absolute top-1 left-1 w-6 h-2 rounded-sm" style={{ backgroundColor: theme.primary }}></div>
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-700">{theme.label}</span>
                                            {selectedThemeId === theme.id && (
                                                <Check className="w-4 h-4 text-gray-900 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleFinish}
                                className="bg-[#bf0000] text-white hover:bg-[#a60000] px-8 py-6 rounded-lg text-lg flex items-center gap-2"
                                disabled={isLoading}
                                style={{ backgroundColor: THEME_PRESETS.find(t => t.id === selectedThemeId)?.primary }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Setting up...
                                    </>
                                ) : (
                                    <>
                                        Finish Setup <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
