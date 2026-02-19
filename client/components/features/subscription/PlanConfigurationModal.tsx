"use client";

import { useState } from "react";
import { X, CheckCircle2, ChevronDown, Upload } from "lucide-react";
import { Categories, Countries, RestaurantCategories } from "@/app/data";
import { Button } from "@/components/ui/button";

interface PlanConfigurationModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: {
        name: string;
        price: number;
    } | null;
    userInfo: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    onConfirm: (data: ConfigurationData) => Promise<void>;
}

export interface ConfigurationData {
    companyName: string;
    categories: string[];
    countries: string[];
    logo: File | null;
}

export default function PlanConfigurationModal({
    isOpen,
    onClose,
    plan,
    userInfo,
    onConfirm
}: PlanConfigurationModalProps) {
    const [formData, setFormData] = useState<ConfigurationData>({
        companyName: "",
        categories: [],
        countries: [],
        logo: null
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !plan) return null;

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, logo: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.categories.length === 0 || formData.countries.length === 0) {
            alert("Please select at least one category and one country.");
            return;
        }
        setIsLoading(true);
        try {
            await onConfirm(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const allCategories = [
        ...Categories.filter(c => c.id !== "All").map(c => ({ id: c.id, label: c.label })),
        ...RestaurantCategories.filter(c => c.id !== "All").map(c => ({ id: c.label, label: `Restaurant (${c.label})` }))
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div
                className="bg-white rounded-[24px] overflow-hidden max-w-[600px] w-full flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300 my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Brand Header */}
                <div className="h-[70px] bg-[#c10007] relative overflow-hidden flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <img
                        src="/images/HomesTV.png"
                        alt="HomesTV"
                        className="h-9 w-auto object-contain brightness-0 invert"
                    />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-[20px] right-[20px] text-white/80 hover:text-white transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="font-bold text-2xl text-gray-900 tracking-tight mb-2">
                            Configure {plan.name} Plan
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Complete your business profile to get started with your subscription.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <label className="block font-semibold text-sm text-gray-700">
                                Business Logo
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#c10007] transition-all cursor-pointer bg-gray-50/50 group"
                                onClick={() => document.getElementById('config-logo-upload')?.click()}
                            >
                                <input
                                    type="file"
                                    id="config-logo-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                />
                                {formData.logo ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-20 h-20 rounded-xl bg-white shadow-md overflow-hidden border border-gray-100">
                                            <img src={URL.createObjectURL(formData.logo)} alt="Logo Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">{formData.logo.name}</span>
                                        <button
                                            type="button"
                                            className="text-xs text-[#c10007] font-semibold hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFormData({ ...formData, logo: null });
                                            }}
                                        >
                                            Remove and change
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-gray-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">Click to upload your brand logo</p>
                                        <p className="text-xs text-gray-400">PNG or JPG up to 2MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm text-gray-700 mb-2">
                                    Company/Business Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="e.g. Acme Real Estate"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10007]/20 focus:border-[#c10007] transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm text-gray-700 mb-2">
                                    Target Categories
                                </label>
                                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-1 custom-scrollbar">
                                    {allCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                const isSelected = formData.categories.includes(category.id);
                                                setFormData({
                                                    ...formData,
                                                    categories: isSelected
                                                        ? formData.categories.filter(id => id !== category.id)
                                                        : [...formData.categories, category.id]
                                                });
                                            }}
                                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${formData.categories.includes(category.id)
                                                    ? 'bg-[#fef2f2] border-[#c10007] text-[#c10007] shadow-sm'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm text-gray-700 mb-2">
                                    Target Regions/Countries
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c10007]/20 focus:border-[#c10007] bg-white transition-all appearance-none cursor-pointer"
                                        value=""
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val && !formData.countries.includes(val)) {
                                                setFormData({ ...formData, countries: [...formData.countries, val] });
                                            }
                                        }}
                                    >
                                        <option value="" disabled>Select regions...</option>
                                        {Countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id)).map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.countries.map((countryId) => (
                                        <div key={countryId} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200">
                                            {Countries.find(c => c.id === countryId)?.label}
                                            <X
                                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                                onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Plan Summary & Total */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Plan Summary</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-gray-900">₱{plan.price.toLocaleString()}</span>
                                    <span className="text-gray-500 text-xs font-medium">/ month</span>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#c10007] hover:bg-[#a00006] text-white px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-red-200 active:scale-95 transition-all disabled:opacity-70"
                            >
                                {isLoading ? "Processing..." : "Confirm & Subscribe"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
