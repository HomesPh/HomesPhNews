"use client";

import { useState } from "react";
import { X, Mail, Briefcase, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { Categories, Countries } from "@/app/data";

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'choice' | 'email' | 'service';

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
    const [step, setStep] = useState<Step>('choice');
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        service: "General Inquiry",
        categories: [] as string[],
        countries: [] as string[]
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

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
            service: "General Inquiry",
            categories: [],
            countries: []
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            handleReset();
            onClose();
        }, 3000);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[24px] overflow-hidden max-w-[600px] w-full flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300"
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

                <div className="p-[30px] flex-1">
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
                                            disabled
                                            className="group flex items-center gap-[16px] p-[20px] bg-gray-50 border border-[#e5e7eb] rounded-[20px] text-left transition-all cursor-not-allowed opacity-70"
                                        >
                                            <div className="w-[50px] h-[50px] bg-gray-200 rounded-[12px] flex items-center justify-center text-gray-400 grayscale">
                                                <Briefcase className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-[17px] text-gray-400 tracking-[-0.5px]">Avail our Services</h3>
                                                    <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span>
                                                </div>
                                                <p className="text-gray-400 text-[13px] leading-snug">Professional real estate solutions.</p>
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
                                                        {Categories.filter(c => c.id !== "All" && !formData.categories.includes(c.id)).map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {formData.categories.map((catId) => (
                                                        <div key={catId} className="flex items-center gap-1 bg-[#fef2f2] text-[#c10007] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#fee2e2]">
                                                            {Categories.find(c => c.id === catId)?.label}
                                                            <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setFormData({ ...formData, categories: formData.categories.filter(id => id !== catId) })} />
                                                        </div>
                                                    ))}
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

                                        <button
                                            type="submit"
                                            className="w-full bg-[#c10007] text-white py-[12px] rounded-[10px] font-bold text-[16px] tracking-[-0.5px] hover:bg-[#a00006] transition-all shadow-md active:scale-[0.98] mt-2"
                                        >
                                            Subscribe Now
                                        </button>
                                    </form>
                                </div>
                            )}

                            {step === 'service' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="font-bold text-[22px] text-[#111827] tracking-[-1px] mb-[8px]">
                                        Service Inquiry
                                    </h2>
                                    <p className="text-[#6b7280] text-[14px] mb-[16px] leading-[20px]">
                                        Tell us about your needs and our team will get back to you soon.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-[12px]">
                                        <div className="grid grid-cols-2 gap-[12px]">
                                            <div className="col-span-2">
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Ricar Doe"
                                                    className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] transition-all"
                                                />
                                            </div>
                                            <div className="col-span-1">
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
                                            <div className="col-span-1">
                                                <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                    Service Type
                                                </label>
                                                <select
                                                    className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white transition-all cursor-pointer"
                                                    value={formData.service}
                                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                                >
                                                    <option>Property Management</option>
                                                    <option>Consultation</option>
                                                    <option>Buy/Sell</option>
                                                    <option>Advertising</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[#c10007] text-white py-[12px] rounded-[10px] font-bold text-[16px] tracking-[-0.5px] hover:bg-[#a00006] transition-all shadow-md active:scale-[0.98] mt-2"
                                        >
                                            Send Request
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-[20px] animate-in zoom-in duration-500">
                            <div className="w-[60px] h-[60px] bg-green-50 rounded-full flex items-center justify-center mx-auto mb-[16px]">
                                <CheckCircle2 className="w-[30px] h-[30px] text-green-600" />
                            </div>
                            <h3 className="font-bold text-[24px] text-[#111827] tracking-[-1px] mb-[8px]">
                                Success!
                            </h3>
                            <p className="text-[#6b7280] text-[15px] leading-[22px] max-w-[320px] mx-auto mb-[10px]">
                                Your request has been successfully submitted. We'll be in touch soon!
                            </p>
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
