"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Briefcase, ArrowLeft, CheckCircle2, ChevronDown, Clock, Calendar } from "lucide-react";
import { Categories, Countries, RestaurantCategories } from "@/app/data";

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'choice' | 'email' | 'service' | 'configure';

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>('choice');
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        companyName: "",
        service: "General Inquiry",
        categories: [] as string[],
        countries: [] as string[],
        frequency: "daily",
        deliveryTime: "08:00",
        plan: "",
        price: 0,
        logo: null as File | null
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleBack = () => {
        setStep('choice');
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setStep('choice');
        setFormData({
            email: "",
            name: "",
            companyName: "",
            service: "General Inquiry",
            categories: [],
            countries: [],
            frequency: "daily",
            deliveryTime: "08:00",
            plan: "",
            price: 0,
            logo: null
        });
    };

    const handleSelectPlan = (plan: string, price: number) => {
        router.push('/admin/login');
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, logo: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Only 'email' step is currently handled by the backend
            if (step === 'email') {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        categories: formData.categories,
                        countries: formData.countries,
                        features: formData.frequency,
                        time: formData.deliveryTime,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Save to browser cache for algorithm/personalization purpose
                    localStorage.setItem('user_preferences', JSON.stringify({
                        categories: formData.categories,
                        countries: formData.countries,
                        email: formData.email,
                        subId: data.data?.sub_Id
                    }));

                    setIsSubmitted(true);
                    setTimeout(() => {
                        handleReset();
                        onClose();
                    }, 3000);
                } else {
                    alert(data.message || 'Something went wrong. Please try again.');
                }
            } else if (step === 'configure') {
                // Handle service subscription with file upload
                const form = new FormData();
                form.append('email', formData.email);
                form.append('name', formData.name); // Although not in backend explicitly, nice to have
                form.append('company_name', formData.companyName); // Add Company Name
                // Add categories
                formData.categories.forEach(cat => form.append('categories[]', cat));
                formData.countries.forEach(country => form.append('countries[]', country));
                form.append('features', formData.service); // Using service type as features
                form.append('time', '09:00'); // Default time for business
                form.append('plan', formData.plan);
                form.append('price', formData.price.toString());

                if (formData.logo) {
                    form.append('logo', formData.logo);
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribe`, {
                    method: 'POST',
                    body: form,
                });

                const data = await response.json();

                if (response.ok) {
                    setIsSubmitted(true);
                    setTimeout(() => {
                        handleReset();
                        onClose();
                    }, 3000);
                } else {
                    alert(data.message || 'Something went wrong. Please try again.');
                }
            } else {
                // Fallback
                setIsSubmitted(true);
                setTimeout(() => {
                    handleReset();
                    onClose();
                }, 3000);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to connect to the server. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[24px] overflow-hidden max-w-[600px] w-full flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300 force-light"
                onClick={(e) => e.stopPropagation()}
            >
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e5e7eb;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #d1d5db;
                    }
                `}</style>

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

                {step !== 'choice' && !isSubmitted && (
                    <button
                        onClick={handleBack}
                        className="absolute top-[20px] left-[20px] text-white/80 hover:text-white transition-colors z-10 flex items-center gap-1 text-[14px] font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                )}

                <div className="p-5 md:p-[30px] flex-1">
                    {!isSubmitted ? (
                        <>
                            {step === 'choice' && (
                                <div className="space-y-[24px] animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-center">
                                        <h2 className="font-bold text-[24px] text-[#111827] tracking-[-1px] mb-[4px]">
                                            How can we help?
                                        </h2>
                                        <p className="text-[#6b7280] text-[15px] tracking-[-0.3px]">Choose an option to get started with HomesTV.</p>
                                    </div>

                                    <div className="grid gap-[12px]">
                                        <button
                                            onClick={() => setStep('email')}
                                            className="group flex items-center gap-[16px] p-[20px] bg-white border border-[#e5e7eb] rounded-[20px] text-left transition-all hover:border-[#c10007] hover:shadow-xl"
                                        >
                                            <div className="w-[50px] h-[50px] bg-[#fef2f2] rounded-[12px] flex items-center justify-center text-[#c10007] transition-all group-hover:scale-110">
                                                <Mail className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[17px] text-[#111827] tracking-[-0.5px]">Receive Daily News</h3>
                                                <p className="text-[#6b7280] text-[13px] leading-snug">Get the latest updates delivered to your inbox.</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setStep('service')}
                                            className="group flex items-center gap-[16px] p-[20px] bg-white border border-[#e5e7eb] rounded-[20px] text-left transition-all hover:border-[#c10007] hover:shadow-xl"
                                        >
                                            <div className="w-[50px] h-[50px] bg-[#fef2f2] rounded-[12px] flex items-center justify-center text-[#c10007] transition-all group-hover:scale-110">
                                                <Briefcase className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-[17px] text-[#111827] tracking-[-0.5px]">Avail our Services</h3>
                                                </div>
                                                <p className="text-[#6b7280] text-[13px] leading-snug">Professional real estate solutions.</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'email' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="font-bold text-[22px] text-[#111827] tracking-[-1px] mb-[8px]">
                                        Email Subscription
                                    </h2>
                                    <p className="text-[#6b7280] text-[14px] mb-[16px] leading-[20px]">
                                        Stay informed with breaking news and exclusive real estate stories.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-[14px]">
                                        <div className="grid grid-cols-2 gap-[16px]">
                                            {/* Categories Selection */}
                                            <div>
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[6px] tracking-[-0.3px]">
                                                    Categories
                                                </label>
                                                <div className="relative group">
                                                    <select
                                                        className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white transition-all appearance-none cursor-pointer"
                                                        value=""
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val && !formData.categories.includes(val)) {
                                                                setFormData({ ...formData, categories: [...formData.categories, val] });
                                                            }
                                                        }}
                                                    >
                                                        <option value="" disabled>Choose...</option>
                                                        {([
                                                            ...Categories.filter(c => c.id !== "All").map(c => ({ ...c, displayName: c.label })),
                                                            ...RestaurantCategories.filter(c => c.id !== "All").map(c => ({ id: c.label, label: c.label, displayName: `Restaurant (${c.label})` }))
                                                        ])
                                                            .filter(c => !formData.categories.includes(c.id))
                                                            .map((category) => (
                                                                <option key={`${category.id}-${category.label}`} value={category.id}>
                                                                    {category.displayName}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {formData.categories.map((catId) => {
                                                        const allCats = [
                                                            ...Categories.filter(c => c.id !== "All").map(c => ({ ...c, displayName: c.label })),
                                                            ...RestaurantCategories.filter(c => c.id !== "All").map(c => ({ id: c.label, label: c.label, displayName: `Restaurant (${c.label})` }))
                                                        ];
                                                        const matched = allCats.find(c => c.id === catId);
                                                        const label = matched ? matched.displayName : catId;
                                                        return (
                                                            <div key={catId} className="flex items-center gap-1 bg-[#fef2f2] text-[#c10007] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#fee2e2]">
                                                                {label}
                                                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFormData({ ...formData, categories: formData.categories.filter(id => id !== catId) })} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Countries Selection */}
                                            <div>
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[6px] tracking-[-0.3px]">
                                                    Countries
                                                </label>
                                                <div className="relative group">
                                                    <select
                                                        className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white transition-all appearance-none cursor-pointer"
                                                        value=""
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val && !formData.countries.includes(val)) {
                                                                setFormData({ ...formData, countries: [...formData.countries, val] });
                                                            }
                                                        }}
                                                    >
                                                        <option value="" disabled>Choose...</option>
                                                        {Countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id)).map((country) => (
                                                            <option key={country.id} value={country.id}>
                                                                {country.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {formData.countries.map((countryId) => (
                                                        <div key={countryId} className="flex items-center gap-1 bg-[#f0f9ff] text-[#0369a1] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#e0f2fe]">
                                                            {Countries.find(c => c.id === countryId)?.label}
                                                            <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                                className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-[12px]">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-[4px]">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <label className="block font-semibold text-[13px] text-[#374151] tracking-[-0.3px]">
                                                        Frequency
                                                    </label>
                                                </div>
                                                <div className="relative">
                                                    <select
                                                        className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white text-gray-900 transition-all appearance-none cursor-pointer"
                                                        value={formData.frequency}
                                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                                    >
                                                        <option value="daily" className="text-gray-900">Daily</option>
                                                        <option value="3days" className="text-gray-900">Every 3 Days</option>
                                                        <option value="5days" className="text-gray-900">Every 5 Days</option>
                                                        <option value="weekly" className="text-gray-900">Weekly</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-1.5 mb-[4px]">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <label className="block font-semibold text-[13px] text-[#374151] tracking-[-0.3px]">
                                                        Time
                                                    </label>
                                                </div>
                                                <input
                                                    type="time"
                                                    value={formData.deliveryTime}
                                                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                                    className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white text-gray-900 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#c10007] text-white py-[12px] rounded-[10px] font-bold text-[16px] tracking-[-0.5px] hover:bg-[#a00006] transition-all shadow-md active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? "Subscribing..." : "Subscribe Now"}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {step === 'service' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="font-bold text-[22px] text-[#111827] tracking-[-1px] mb-[8px]">
                                        Choose Your Plan
                                    </h2>
                                    <p className="text-[#6b7280] text-[14px] mb-[20px] leading-[20px]">
                                        Unlock premium features and grow your business with our tailored solutions.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-[12px] mb-[20px]">
                                        {/* Basic Plan */}
                                        <div className="border border-[#e5e7eb] rounded-[16px] p-[16px] flex flex-col hover:border-[#c10007] transition-all group relative overflow-hidden">
                                            <div className="mb-[12px]">
                                                <h3 className="font-bold text-[16px] text-[#111827]">Basic</h3>
                                                <p className="text-[12px] text-[#6b7280]">Essential tools for starters.</p>
                                            </div>
                                            <div className="mb-[16px]">
                                                <span className="text-[24px] font-bold text-[#111827]">₱499</span>
                                                <span className="text-[12px] text-[#6b7280] font-medium">/mo</span>
                                            </div>
                                            <ul className="space-y-[8px] mb-[16px] flex-1">
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    Daily News Updates
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    5 credits
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    Article management
                                                </li>
                                            </ul>
                                            <button
                                                onClick={() => handleSelectPlan('Basic', 499.00)}
                                                className="w-full py-[8px] border border-[#e5e7eb] rounded-[8px] text-[13px] font-semibold text-[#374151] hover:bg-gray-50 transition-colors"
                                            >
                                                Select Basic
                                            </button>
                                        </div>

                                        {/* Professional Plan */}
                                        <div className="border border-[#c10007] bg-[#fff5f5] rounded-[16px] p-[16px] flex flex-col relative shadow-lg md:scale-105 z-10">
                                            <div className="absolute top-0 right-0 bg-[#c10007] text-white text-[10px] font-bold px-2 py-1 rounded-bl-[10px] rounded-tr-[15px]">
                                                POPULAR
                                            </div>
                                            <div className="mb-[12px]">
                                                <h3 className="font-bold text-[16px] text-[#c10007]">Professional</h3>
                                                <p className="text-[12px] text-[#6b7280]">For growing businesses.</p>
                                            </div>
                                            <div className="mb-[16px]">
                                                <span className="text-[24px] font-bold text-[#111827]">₱2,499</span>
                                                <span className="text-[12px] text-[#6b7280] font-medium">/mo</span>
                                            </div>
                                            <ul className="space-y-[8px] mb-[16px] flex-1">
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151] font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    Everything in Basic
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151] font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    +15 credits
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151] font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    Priority Support
                                                </li>
                                            </ul>
                                            <button
                                                onClick={() => handleSelectPlan('Professional', 2499.00)}
                                                className="w-full py-[8px] bg-[#c10007] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#a00006] transition-colors shadow-md"
                                            >
                                                Select Pro
                                            </button>
                                        </div>

                                        {/* Enterprise Plan */}
                                        <div className="border border-[#e5e7eb] rounded-[16px] p-[16px] flex flex-col hover:border-[#c10007] transition-all group">
                                            <div className="mb-[12px]">
                                                <h3 className="font-bold text-[16px] text-[#111827]">Enterprise</h3>
                                                <p className="text-[12px] text-[#6b7280]">Maximum power & scale.</p>
                                            </div>
                                            <div className="mb-[16px]">
                                                <span className="text-[24px] font-bold text-[#111827]">₱4,999</span>
                                                <span className="text-[12px] text-[#6b7280] font-medium">/mo</span>
                                            </div>
                                            <ul className="space-y-[8px] mb-[16px] flex-1">
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    Everything in Pro
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    +30 credits
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0" />
                                                    Custom API Access
                                                </li>
                                            </ul>
                                            <button
                                                onClick={() => handleSelectPlan('Enterprise', 4999.00)}
                                                className="w-full py-[8px] border border-[#e5e7eb] rounded-[8px] text-[13px] font-semibold text-[#374151] hover:bg-gray-50 transition-colors"
                                            >
                                                Select Enterprise
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-[11px] text-[#9ca3af]">
                                            Need a custom plan? <a href="#" className="text-[#c10007] font-medium hover:underline">Contact us</a> for more details.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 'configure' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="font-bold text-[22px] text-[#111827] tracking-[-1px] mb-[8px]">
                                        Configure {formData.plan}
                                    </h2>
                                    <p className="text-[#6b7280] text-[14px] mb-[16px] leading-[20px]">
                                        Complete your profile to get started.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-[12px]">
                                        {/* Logo Upload */}
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#c10007] transition-colors cursor-pointer relative" onClick={() => document.getElementById('logo-upload')?.click()}>
                                            <input
                                                type="file"
                                                id="logo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                            />
                                            {formData.logo ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                                        <img src={URL.createObjectURL(formData.logo)} alt="Logo" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-medium">{formData.logo.name}</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                                        <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-medium">Upload Brand Logo</p>
                                                    <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                                                </div>
                                            )}
                                        </div>



                                        <div className="grid grid-cols-2 gap-[12px]">
                                            <div className="col-span-2">
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] transition-all"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                    Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                    placeholder="Company Name"
                                                    className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] transition-all"
                                                />
                                            </div>

                                            {/* Categories (Simplified for Configure Step) */}
                                            <div className="col-span-2">
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                    Category
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {Categories.filter(c => c.id !== "All").map((category) => (
                                                        <button
                                                            key={category.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, categories: [category.id] });
                                                            }}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${formData.categories.includes(category.id)
                                                                ? 'bg-[#fef2f2] border-[#c10007] text-[#c10007]'
                                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            {category.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                    Target Country
                                                </label>
                                                <select
                                                    className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white transition-all cursor-pointer"
                                                    onChange={(e) => {
                                                        if (e.target.value && !formData.countries.includes(e.target.value)) {
                                                            setFormData({ ...formData, countries: [e.target.value] }); // Single region for simplicity now
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select Country...</option>
                                                    {Countries.filter(c => c.id !== "Global").map((country) => (
                                                        <option key={country.id} value={country.id}>
                                                            {country.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 mt-4 flex items-center justify-between border border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Monthly</p>
                                                <p className="text-xl font-bold text-gray-900">₱{formData.price.toLocaleString()}</p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="bg-[#c10007] text-white px-6 py-2.5 rounded-[10px] font-bold text-[14px] hover:bg-[#a00006] transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? "Processing..." : "Confirm & Pay"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-[40px] animate-in zoom-in duration-500">
                            <div className="w-[80px] h-[80px] bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-[24px] border border-[#dcfce7]">
                                <CheckCircle2 className="w-[40px] h-[40px] text-[#16a34a]" />
                            </div>
                            <h3 className="font-bold text-[28px] text-[#111827] tracking-[-1px] mb-[12px]">
                                You're all set!
                            </h3>
                            <p className="text-[#6b7280] text-[16px] leading-[24px] max-w-[380px] mx-auto mb-[8px]">
                                Your subscription has been confirmed. A welcome email with your selected preferences has been sent to <strong>{formData.email}</strong>.
                            </p>
                            <p className="text-[#9ca3af] text-[14px]">Redirecting you back shortly...</p>
                        </div>
                    )}

                    <div className="mt-[20px] pt-[16px] border-t border-[#f3f4f6]">
                        <p className="font-normal text-[11px] text-[#9ca3af] tracking-[-0.5px] text-center">
                            By continuing, you agree to our <a href="#" className="underline hover:text-[#c10007]">Terms</a> and <a href="#" className="underline hover:text-[#c10007]">Privacy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
