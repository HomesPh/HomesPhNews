"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Briefcase, ArrowLeft, CheckCircle2, ChevronDown, Clock, Calendar, HelpCircle, ChevronUp } from "lucide-react";
import { Categories, Countries, RestaurantCategories } from "@/app/data";
import { useAlert } from "@/hooks/useAlert";

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories?: { id: string; label: string }[];
    countries?: { id: string; label: string }[];
}

type Step = 'choice' | 'email' | 'service' | 'configure';

export default function SubscribeModal({ isOpen, onClose, categories = [], countries = [] }: SubscribeModalProps) {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [step, setStep] = useState<Step>('choice');
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        companyName: "",
        service: "General Inquiry",
        categories: [] as string[],
        countries: [] as string[],
        province: "",
        city: "",
        user_country: "",
        user_province: "",
        user_city: "",
        frequency: "daily",
        deliveryTime: "08:00",
        plan: "",
        price: 0,
        logo: null as File | null
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [locationsFetched, setLocationsFetched] = useState(false);
    const [provincesList, setProvincesList] = useState<{ id: number, name: string, country?: { id: number, name: string } }[]>([]);
    const [citiesList, setCitiesList] = useState<{ id?: number, city_id?: number, name: string, province_id: number | null, country?: { id: number, name: string } }[]>([]);
    const [showProvDrop, setShowProvDrop] = useState<'email' | 'configure' | null>(null);
    const [showCityDrop, setShowCityDrop] = useState<'email' | 'configure' | null>(null);

    const [categorySearch, setCategorySearch] = useState("");
    const [countrySearch, setCountrySearch] = useState("");
    const [userCountrySearch, setUserCountrySearch] = useState("");
    const [showCatDrop, setShowCatDrop] = useState(false);
    const [showCountryDrop, setShowCountryDrop] = useState(false);
    const [showUserCountryDrop, setShowUserCountryDrop] = useState(false);
    const [showUserProvDrop, setShowUserProvDrop] = useState<'email' | 'configure' | null>(null);
    const [showUserCityDrop, setShowUserCityDrop] = useState<'email' | 'configure' | null>(null);

    useEffect(() => {
        if (isOpen && !locationsFetched) {
            const fetchLocations = async () => {
                try {
                    const [provRes, cityRes] = await Promise.all([
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/provinces`),
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/cities`)
                    ]);
                    const provData = await provRes.json();
                    const cityData = await cityRes.json();
                    if (provData.data) setProvincesList(provData.data);
                    if (cityData.data) setCitiesList(cityData.data);
                    setLocationsFetched(true);
                } catch (error) {
                    console.error('Failed to fetch locations', error);
                }
            };
            fetchLocations();
        }
    }, [isOpen, locationsFetched]);

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 'email') {
            setStep('choice');
        } else if (step === 'configure') {
            setStep('service');
        } else if (step === 'service') {
            setStep('choice');
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setStep('choice');
        // ... rest of reset logic
        setFormData({
            email: "",
            name: "",
            companyName: "",
            service: "General Inquiry",
            categories: [],
            countries: [],
            province: "",
            city: "",
            user_country: "",
            user_province: "",
            user_city: "",
            frequency: "daily",
            deliveryTime: "08:00",
            plan: "",
            price: 0,
            logo: null
        });
        setErrors({});
        setShowConfirmation(false);
        setShowManual(false);
    };

    const handleSelectPlan = (plan: string, price: number) => {
        localStorage.setItem('pending_plan', plan.toLowerCase());
        const token = localStorage.getItem('auth_token');
        if (token) {
            router.push(`/subscription/checkout?plan=${plan.toLowerCase()}`);
        } else {
            router.push('/admin/login');
        }
        onClose();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, logo: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 'email') {
            const newErrors: { [key: string]: string } = {};
            if (formData.categories.length === 0) newErrors.categories = "Please select at least one category";
            if (formData.countries.length === 0) newErrors.countries = "Please select at least one country";
            if (!formData.email) newErrors.email = "Please enter your email address";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setShowConfirmation(true);
        } else {
            // For other steps (if any used), we still allow confirmation if needed
            setShowConfirmation(true);
        }
    };

    const processSubscription = async () => {
        setIsLoading(true);
        setShowConfirmation(false);

        try {
            // Only 'email' step is currently handled by the backend
            if (step === 'email') {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        categories: formData.categories,
                        countries: formData.countries,
                        province: formData.province,
                        city: formData.city,
                        user_country: formData.user_country,
                        user_province: formData.user_province,
                        user_city: formData.user_city,
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
                    showAlert('Error', data.message || 'Something went wrong. Please try again.');
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
                form.append('province', formData.province);
                form.append('city', formData.city);
                form.append('user_country', formData.user_country);
                form.append('user_province', formData.user_province);
                form.append('user_city', formData.user_city);
                form.append('features', formData.service); // Using service type as features
                form.append('time', '09:00'); // Default time for business
                form.append('plan', formData.plan);
                form.append('price', formData.price.toString());

                if (formData.logo) {
                    form.append('logo', formData.logo);
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subscribe`, {
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
                    showAlert('Error', data.message || 'Something went wrong. Please try again.');
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
            showAlert('Connection Error', 'Failed to connect to the server. Please check your internet connection.');
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
                <div className="h-[70px] bg-[#000785] relative overflow-hidden flex items-center justify-between px-[20px] flex-shrink-0">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    {/* Left Section: Back Button */}
                    <div className="w-[80px] flex items-center justify-start z-10">
                        {step !== 'choice' && !isSubmitted && (
                            <button
                                onClick={handleBack}
                                className="text-white/80 hover:text-white transition-colors flex items-center gap-1 text-[14px] font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}
                    </div>

                    {/* Center Section: Logo */}
                    <div className="flex-1 flex items-center justify-center z-10">
                        <img
                            src="/images/HomesLogoW.png"
                            alt="Homes.ph News Logo"
                            className="h-7 w-auto object-contain"
                        />
                    </div>

                    {/* Right Section: Close Button */}
                    <div className="w-[80px] flex items-center justify-end z-10">
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-[24px] flex-1 overflow-y-auto max-h-[85vh]">
                    {!isSubmitted ? (
                        <>
                            {step === 'choice' && (
                                <div className="space-y-[24px] animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-center">
                                        <h2 className="font-bold text-[24px] text-[#111827] tracking-[-1px] mb-[4px]">
                                            How can we help?
                                        </h2>
                                        <p className="text-[#6b7280] text-[15px] tracking-[-0.3px]">Choose an option to get started with Homes.ph News.</p>
                                    </div>

                                    <div className="grid gap-[12px]">
                                        <button
                                            onClick={() => setStep('email')}
                                            className="group flex items-center gap-[16px] p-[20px] bg-white border border-[#e5e7eb] rounded-[20px] text-left transition-all hover:border-[#000785] hover:shadow-xl"
                                        >
                                            <div className="w-[50px] h-[50px] bg-blue-50 rounded-[12px] flex items-center justify-center text-[#000785] transition-all group-hover:scale-110">
                                                <Mail className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[17px] text-[#111827] tracking-[-0.5px]">Receive Daily News</h3>
                                                <p className="text-[#6b7280] text-[13px] leading-snug">Get the latest updates delivered to your inbox.</p>
                                            </div>
                                        </button>

                                        <button
                                            disabled
                                            className="group flex items-center gap-[16px] p-[20px] bg-gray-50/50 border border-[#e5e7eb] rounded-[20px] text-left opacity-70 cursor-not-allowed"
                                        >
                                            <div className="w-[50px] h-[50px] bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-400">
                                                <Briefcase className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-[17px] text-gray-400 tracking-[-0.5px]">Avail our Services</h3>
                                                </div>
                                                <p className="text-gray-400 text-[13px] leading-snug">Professional real estate solutions (Currently Unavailable)</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'email' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h2 className="font-bold text-[20px] text-[#111827] tracking-[-1px]">
                                                Email Subscription
                                            </h2>
                                            <p className="text-[#6b7280] text-[13px] leading-snug">Stay informed with exclusive real estate stories.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowManual(!showManual)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-[#000785] transition-colors"
                                        >
                                            <HelpCircle className="w-3.5 h-3.5" />
                                            <span className="font-bold text-[12px] tracking-[-0.3px]">Help</span>
                                            {showManual ? <ChevronUp className="w-3 h-3 text-[#9ca3af]" /> : <ChevronDown className="w-3 h-3 text-[#9ca3af]" />}
                                        </button>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-300 bg-blue-50/30 rounded-xl mb-4 ${showManual ? 'max-h-[400px] p-4 border border-blue-100' : 'max-h-0'}`}>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px] text-[#4b5563]">
                                            <div className="flex gap-2.5">
                                                <div className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-[#000785] text-white flex items-center justify-center text-[9px] font-bold">1</div>
                                                <p><span className="font-semibold text-[#111827]">Pick Topics:</span> Categories like "Sports".</p>
                                            </div>
                                            <div className="flex gap-2.5">
                                                <div className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-[#000785] text-white flex items-center justify-center text-[9px] font-bold">2</div>
                                                <p><span className="font-semibold text-[#111827]">Select Regions:</span> Target news areas.</p>
                                            </div>
                                            <div className="flex gap-2.5">
                                                <div className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-[#000785] text-white flex items-center justify-center text-[9px] font-bold">3</div>
                                                <p><span className="font-semibold text-[#111827]">User Location:</span> For our data analytics.</p>
                                            </div>
                                            <div className="flex gap-2.5">
                                                <div className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-[#000785] text-white flex items-center justify-center text-[9px] font-bold">4</div>
                                                <p><span className="font-semibold text-[#111827]">Confirm:</span> Set schedule & email.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-[12px]">
                                        {/* Row 1: News Interests */}
                                        <div className="bg-white border border-[#e5e7eb] rounded-xl p-3 space-y-3">
                                            <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af]">News Interests</p>
                                            <div className="grid grid-cols-2 gap-[12px]">
                                                <div>
                                                    <label className="block font-semibold text-[12px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                        Categories
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={categorySearch}
                                                            onChange={(e) => {
                                                                setCategorySearch(e.target.value);
                                                                setShowCatDrop(true);
                                                            }}
                                                            onFocus={() => setShowCatDrop(true)}
                                                            onBlur={() => setTimeout(() => setShowCatDrop(false), 200)}
                                                            placeholder="Type categories..."
                                                            className={`w-full border ${errors.categories ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[10px] px-[12px] py-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#000785] transition-all`}
                                                        />
                                                        {showCatDrop && (
                                                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                                {categories.filter(c => c.id !== "All" && !formData.categories.includes(c.id) && c.label.toLowerCase().includes(categorySearch.toLowerCase())).map((category) => (
                                                                    <button key={category.id} type="button" className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100" onClick={() => {
                                                                        setFormData({ ...formData, categories: [...formData.categories, category.id] });
                                                                        setErrors({ ...errors, categories: "" });
                                                                        setCategorySearch("");
                                                                        setShowCatDrop(false);
                                                                    }}>
                                                                        {category.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {formData.categories.map((catId) => (
                                                            <div key={catId} className="flex items-center gap-1 bg-blue-50 text-[#000785] px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-blue-100">
                                                                {categories.find(c => c.id === catId)?.label || catId}
                                                                <X className="w-2 h-2 cursor-pointer" onClick={() => setFormData({ ...formData, categories: formData.categories.filter(id => id !== catId) })} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block font-semibold text-[12px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                                                        Target Countries
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={countrySearch}
                                                            onChange={(e) => {
                                                                setCountrySearch(e.target.value);
                                                                setShowCountryDrop(true);
                                                            }}
                                                            onFocus={() => setShowCountryDrop(true)}
                                                            onBlur={() => setTimeout(() => setShowCountryDrop(false), 200)}
                                                            placeholder="Type countries..."
                                                            className={`w-full border ${errors.countries ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[10px] px-[12px] py-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#000785] transition-all`}
                                                        />
                                                        {showCountryDrop && (
                                                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                                {countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id) && c.label.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                                                                    <button key={country.id} type="button" className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100" onClick={() => {
                                                                        setFormData({ ...formData, countries: [...formData.countries, country.id] });
                                                                        setErrors({ ...errors, countries: "" });
                                                                        setCountrySearch("");
                                                                        setShowCountryDrop(false);
                                                                    }}>
                                                                        {country.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {formData.countries.map((countryId) => (
                                                            <div key={countryId} className="flex items-center gap-1 bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-sky-100">
                                                                {countries.find(c => c.id === countryId)?.label || countryId}
                                                                <X className="w-2 h-2 cursor-pointer" onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-[12px]">
                                                <div className="relative">
                                                    <label className="block font-semibold text-[12px] text-[#374151] mb-[2px]">Target Province</label>
                                                    <input
                                                        type="text"
                                                        value={formData.province}
                                                        onChange={(e) => { setFormData({ ...formData, province: e.target.value, city: "" }); setShowProvDrop('email'); }}
                                                        onFocus={() => setShowProvDrop('email')}
                                                        onBlur={() => setTimeout(() => setShowProvDrop(null), 200)}
                                                        placeholder="e.g. Metro Manila"
                                                        className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#000785]"
                                                    />
                                                    {showProvDrop === 'email' && formData.province && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                            {provincesList.filter(p => {
                                                                if (formData.countries.length > 0 && !formData.countries.includes("Global")) {
                                                                    if (p.country?.name && !formData.countries.includes(p.country.name)) return false;
                                                                }
                                                                return p.name.toLowerCase().includes(formData.province.toLowerCase());
                                                            }).map(p => (
                                                                <button key={p.id} type="button" className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, province: p.name, city: "" }); setShowProvDrop(null); }}>
                                                                    {p.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <label className="block font-semibold text-[12px] text-[#374151] mb-[2px]">Target City</label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => { setFormData({ ...formData, city: e.target.value }); setShowCityDrop('email'); }}
                                                        onFocus={() => setShowCityDrop('email')}
                                                        onBlur={() => setTimeout(() => setShowCityDrop(null), 200)}
                                                        placeholder="e.g. Makati"
                                                        className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#000785]"
                                                    />
                                                    {showCityDrop === 'email' && formData.city && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                            {citiesList.filter(c => {
                                                                if (formData.countries.length > 0 && !formData.countries.includes("Global")) {
                                                                    if (c.country?.name && !formData.countries.includes(c.country.name)) return false;
                                                                }
                                                                const prov = provincesList.find(p => p.name === formData.province);
                                                                if (prov && c.province_id && c.province_id !== prov.id) return false;
                                                                return c.name.toLowerCase().includes(formData.city.toLowerCase());
                                                            }).map(c => (
                                                                <button key={c.city_id || c.id} type="button" className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, city: c.name }); setShowCityDrop(null); }}>
                                                                    {c.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Delivery & Origin Setup */}
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="space-y-3">
                                                    <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-1">Delivery Settings</p>
                                                    <div className="grid grid-cols-3 gap-[10px] items-end">
                                                        <div className="col-span-1">
                                                            <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">Email Address</label>
                                                            <input
                                                                type="email" required value={formData.email}
                                                                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                                                                placeholder="email@work.com"
                                                                className={`w-full border ${errors.email ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[10px] px-[10px] py-[7px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#000785]`}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block font-semibold text-[11px] text-[#374151] mb-[2px] flex items-center gap-1"><Calendar className="w-3 h-3" /> Frequency</label>
                                                            <select className="w-full border border-[#e5e7eb] rounded-[10px] px-[8px] py-[7px] text-[13px] bg-white" value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}>
                                                                <option value="daily">Daily</option>
                                                                <option value="3days">3 Days</option>
                                                                <option value="5days">5 Days</option>
                                                                <option value="weekly">Weekly</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block font-semibold text-[11px] text-[#374151] mb-[2px] flex items-center gap-1"><Clock className="w-3 h-3" /> Time</label>
                                                            <input type="time" value={formData.deliveryTime} onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })} className="w-full border border-[#e5e7eb] rounded-[10px] px-[8px] py-[7px] text-[13px] bg-white" />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-[10px]">
                                                        <div className="relative">
                                                            <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">Country</label>
                                                            <input
                                                                type="text"
                                                                value={userCountrySearch || formData.user_country}
                                                                onChange={(e) => { setUserCountrySearch(e.target.value); setShowUserCountryDrop(true); }}
                                                                onFocus={() => setShowUserCountryDrop(true)}
                                                                onBlur={() => setTimeout(() => setShowUserCountryDrop(false), 200)}
                                                                placeholder="Select..."
                                                                className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[7px] text-[13px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#000785]"
                                                            />
                                                            {showUserCountryDrop && (
                                                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                                    {countries.filter(c => c.id !== "Global" && c.label.toLowerCase().includes(userCountrySearch.toLowerCase())).map((country) => (
                                                                        <button key={country.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => {
                                                                            setFormData({ ...formData, user_country: country.label, user_province: "", user_city: "" });
                                                                            setUserCountrySearch("");
                                                                            setShowUserCountryDrop(false);
                                                                        }}>
                                                                            {country.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">Province</label>
                                                            <input
                                                                type="text"
                                                                value={formData.user_province}
                                                                onChange={(e) => { setFormData({ ...formData, user_province: e.target.value, user_city: "" }); setShowUserProvDrop('email'); }}
                                                                onFocus={() => setShowUserProvDrop('email')}
                                                                onBlur={() => setTimeout(() => setShowUserProvDrop(null), 200)}
                                                                placeholder="Select..."
                                                                className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[7px] text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#000785]"
                                                            />
                                                            {showUserProvDrop === 'email' && formData.user_province && (
                                                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                                    {provincesList.filter(p => {
                                                                        if (formData.user_country && p.country?.name && p.country.name !== formData.user_country) return false;
                                                                        return p.name.toLowerCase().includes(formData.user_province.toLowerCase());
                                                                    }).map(p => (
                                                                        <button key={p.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, user_province: p.name, user_city: "" }); setShowUserProvDrop(null); }}>
                                                                            {p.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">City</label>
                                                            <input
                                                                type="text"
                                                                value={formData.user_city}
                                                                onChange={(e) => { setFormData({ ...formData, user_city: e.target.value }); setShowUserCityDrop('email'); }}
                                                                onFocus={() => setShowUserCityDrop('email')}
                                                                onBlur={() => setTimeout(() => setShowUserCityDrop(null), 200)}
                                                                placeholder="Select..."
                                                                className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[7px] text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#000785]"
                                                            />
                                                            {showUserCityDrop === 'email' && formData.user_city && (
                                                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                                    {citiesList.filter(c => {
                                                                        if (formData.user_country && c.country?.name && c.country.name !== formData.user_country) return false;
                                                                        const prov = provincesList.find(p => p.name === formData.user_province);
                                                                        if (prov && c.province_id && c.province_id !== prov.id) return false;
                                                                        return c.name.toLowerCase().includes(formData.user_city.toLowerCase());
                                                                    }).map(c => (
                                                                        <button key={c.city_id || c.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, user_city: c.name }); setShowUserCityDrop(null); }}>
                                                                            {c.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={isLoading} className="w-full bg-[#000785] text-white py-[11px] rounded-[12px] font-bold text-[15px] hover:bg-[#000566] transition-all shadow-md active:scale-[0.98] disabled:opacity-70">
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
                                        <div className="border border-[#e5e7eb] rounded-[16px] p-[16px] flex flex-col hover:border-[#000785] transition-all group relative overflow-hidden">
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
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    Daily News Updates
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    5 credits
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
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
                                        <div className="border border-[#000785] bg-blue-50/50 rounded-[16px] p-[16px] flex flex-col relative shadow-lg md:scale-105 z-10">
                                            <div className="absolute top-0 right-0 bg-[#000785] text-white text-[10px] font-bold px-2 py-1 rounded-bl-[10px] rounded-tr-[15px]">
                                                POPULAR
                                            </div>
                                            <div className="mb-[12px]">
                                                <h3 className="font-bold text-[16px] text-[#000785]">Professional</h3>
                                                <p className="text-[12px] text-[#6b7280]">For growing businesses.</p>
                                            </div>
                                            <div className="mb-[16px]">
                                                <span className="text-[24px] font-bold text-[#111827]">₱2,499</span>
                                                <span className="text-[12px] text-[#6b7280] font-medium">/mo</span>
                                            </div>
                                            <ul className="space-y-[8px] mb-[16px] flex-1">
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151] font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    Everything in Basic
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151] font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    +15 credits
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151] font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    Priority Support
                                                </li>
                                            </ul>
                                            <button
                                                onClick={() => handleSelectPlan('Professional', 2499.00)}
                                                className="w-full py-[8px] bg-[#000785] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#000566] transition-colors shadow-md"
                                            >
                                                Select Pro
                                            </button>
                                        </div>

                                        {/* Enterprise Plan */}
                                        <div className="border border-[#e5e7eb] rounded-[16px] p-[16px] flex flex-col hover:border-[#000785] transition-all group">
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
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    Everything in Pro
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
                                                    +30 credits
                                                </li>
                                                <li className="flex items-start gap-[8px] text-[12px] text-[#374151]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#000785] flex-shrink-0" />
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
                                            Need a custom plan? <a href="#" className="text-[#000785] font-medium hover:underline">Contact us</a> for more details.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 'configure' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="font-bold text-[20px] text-[#111827] tracking-[-1px] mb-[2px]">
                                        Configure {formData.plan}
                                    </h2>
                                    <p className="text-[#6b7280] text-[13px] mb-3">Complete your profile to get started.</p>

                                    <form onSubmit={handleSubmit} className="space-y-[10px]">
                                        <div className="flex gap-4 items-start">
                                            {/* Logo Upload */}
                                            <div className="w-[120px] h-[120px] flex-shrink-0 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#000785] transition-colors cursor-pointer relative bg-gray-50/50" onClick={() => document.getElementById('logo-upload')?.click()}>
                                                <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                                {formData.logo ? (
                                                    <img src={URL.createObjectURL(formData.logo)} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <div className="text-center p-2">
                                                        <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Upload Logo</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                <div className="col-span-2">
                                                    <label className="block font-semibold text-[12px] text-[#374151] mb-[2px]">Email Address</label>
                                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[7px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#000785]" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block font-semibold text-[12px] text-[#374151] mb-[2px]">Company Name</label>
                                                    <input type="text" required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="Company Name" className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[7px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#000785]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Categories Selection */}
                                        <div className="bg-white border border-[#e5e7eb] rounded-xl p-3 space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-[#9ca3af]">Service Details</p>
                                            <div className="space-y-2">
                                                <label className="block font-semibold text-[12px] text-[#374151]">Select Primary Category</label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {categories.filter(c => c.id !== "All").map((category) => (
                                                        <button key={category.id} type="button" onClick={() => setFormData({ ...formData, categories: [category.id] })} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${formData.categories.includes(category.id) ? 'bg-[#000785] border-[#000785] text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                            {category.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* News Targets */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="relative">
                                                <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">Target Country</label>
                                                <input type="text" value={countrySearch} onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDrop(true); }} onFocus={() => setShowCountryDrop(true)} onBlur={() => setTimeout(() => setShowCountryDrop(false), 200)} placeholder="Search..." className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[7px] text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#000785]" />
                                                {showCountryDrop && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                        {countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id) && c.label.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                                                            <button key={country.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, countries: [...formData.countries, country.id] }); setCountrySearch(""); setShowCountryDrop(false); }}>
                                                                {country.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {formData.countries.map((countryId) => (
                                                        <div key={countryId} className="flex items-center gap-1 bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold border border-sky-100">
                                                            {countries.find(c => c.id === countryId)?.label || countryId}
                                                            <X className="w-2 h-2 cursor-pointer" onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">Target Province</label>
                                                <input type="text" value={formData.province} onChange={(e) => { setFormData({ ...formData, province: e.target.value, city: "" }); setShowProvDrop('configure'); }} onFocus={() => setShowProvDrop('configure')} onBlur={() => setTimeout(() => setShowProvDrop(null), 200)} placeholder="Province..." className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[7px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#000785]" />
                                                {showProvDrop === 'configure' && formData.province && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                        {provincesList.filter(p => {
                                                            if (formData.countries.length > 0 && !formData.countries.includes("Global")) {
                                                                if (p.country?.name && !formData.countries.includes(p.country.name)) return false;
                                                            }
                                                            return p.name.toLowerCase().includes(formData.province.toLowerCase());
                                                        }).map(p => (
                                                            <button key={p.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, province: p.name, city: "" }); setShowProvDrop(null); }}>
                                                                {p.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <label className="block font-semibold text-[11px] text-[#374151] mb-[2px]">Target City</label>
                                                <input type="text" value={formData.city} onChange={(e) => { setFormData({ ...formData, city: e.target.value }); setShowCityDrop('configure'); }} onFocus={() => setShowCityDrop('configure')} onBlur={() => setTimeout(() => setShowCityDrop(null), 200)} placeholder="City..." className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[7px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#000785]" />
                                                {showCityDrop === 'configure' && formData.city && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                        {citiesList.filter(c => {
                                                            if (formData.countries.length > 0 && !formData.countries.includes("Global")) {
                                                                if (c.country?.name && !formData.countries.includes(c.country.name)) return false;
                                                            }
                                                            const prov = provincesList.find(p => p.name === formData.province);
                                                            if (prov && c.province_id && c.province_id !== prov.id) return false;
                                                            return c.name.toLowerCase().includes(formData.city.toLowerCase());
                                                        }).map(c => (
                                                            <button key={c.city_id || c.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, city: c.name }); setShowCityDrop(null); }}>
                                                                {c.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* User Origin */}
                                        <div className="bg-gray-50 border border-[#e5e7eb] rounded-xl p-3 space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">User Origin (For Data Analysis)</p>
                                            <div className="grid grid-cols-3 gap-2.5">
                                                <div className="relative">
                                                    <label className="block font-semibold text-[11px] text-[#374151]">Country</label>
                                                    <input type="text" value={userCountrySearch || formData.user_country} onChange={(e) => { setUserCountrySearch(e.target.value); setShowUserCountryDrop(true); }} onFocus={() => setShowUserCountryDrop(true)} onBlur={() => setTimeout(() => setShowUserCountryDrop(false), 200)} placeholder="Select..." className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[6px] text-[12px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#000785]" />
                                                    {showUserCountryDrop && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                            {countries.filter(c => c.id !== "Global" && c.label.toLowerCase().includes(userCountrySearch.toLowerCase())).map((country) => (
                                                                <button key={country.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, user_country: country.label, user_province: "", user_city: "" }); setUserCountrySearch(""); setShowUserCountryDrop(false); }}>
                                                                    {country.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <label className="block font-semibold text-[11px] text-[#374151]">Province</label>
                                                    <input type="text" value={formData.user_province} onChange={(e) => { setFormData({ ...formData, user_province: e.target.value, user_city: "" }); setShowUserProvDrop('configure'); }} onFocus={() => setShowUserProvDrop('configure')} onBlur={() => setTimeout(() => setShowUserProvDrop(null), 200)} placeholder="Province..." className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[6px] text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#000785]" />
                                                    {showUserProvDrop === 'configure' && formData.user_province && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                            {provincesList.filter(p => {
                                                                if (formData.user_country && p.country?.name && p.country.name !== formData.user_country) return false;
                                                                return p.name.toLowerCase().includes(formData.user_province.toLowerCase());
                                                            }).map(p => (
                                                                <button key={p.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, user_province: p.name, user_city: "" }); setShowUserProvDrop(null); }}>
                                                                    {p.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <label className="block font-semibold text-[11px] text-[#374151]">City</label>
                                                    <input type="text" value={formData.user_city} onChange={(e) => { setFormData({ ...formData, user_city: e.target.value }); setShowUserCityDrop('configure'); }} onFocus={() => setShowUserCityDrop('configure')} onBlur={() => setTimeout(() => setShowUserCityDrop(null), 200)} placeholder="City..." className="w-full border border-[#e5e7eb] rounded-[10px] px-[10px] py-[6px] text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#000785]" />
                                                    {showUserCityDrop === 'configure' && formData.user_city && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                                            {citiesList.filter(c => {
                                                                if (formData.user_country && c.country?.name && c.country.name !== formData.user_country) return false;
                                                                const prov = provincesList.find(p => p.name === formData.user_province);
                                                                if (prov && c.province_id && c.province_id !== prov.id) return false;
                                                                return c.name.toLowerCase().includes(formData.user_city.toLowerCase());
                                                            }).map(c => (
                                                                <button key={c.city_id || c.id} type="button" className="w-full text-left px-2 py-1.5 text-[12px] hover:bg-gray-100" onClick={() => { setFormData({ ...formData, user_city: c.name }); setShowUserCityDrop(null); }}>
                                                                    {c.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#000785]/5 rounded-xl px-4 py-3 flex items-center justify-between border border-[#000785]/10">
                                            <div>
                                                <p className="text-[10px] text-[#000785]/60 font-black uppercase tracking-wider">Plan Total</p>
                                                <p className="text-lg font-black text-[#000785]">₱{formData.price.toLocaleString()}<span className="text-[12px] font-medium text-[#000785]/60 ml-1">/month</span></p>
                                            </div>
                                            <button type="submit" disabled={isLoading} className="bg-[#000785] text-white px-8 py-2.5 rounded-full font-bold text-[14px] hover:bg-[#000566] transition-all shadow-lg active:scale-[0.98] disabled:opacity-70">
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
                            By continuing, you agree to our <a href="#" className="underline hover:text-[#000785]">Terms</a> and <a href="#" className="underline hover:text-[#000785]">Privacy</a>.
                        </p>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[20px] p-[24px] max-w-[320px] w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                            <h4 className="font-bold text-[18px] text-[#111827] mb-[8px]">Are you sure?</h4>
                            <p className="text-[#6b7280] text-[14px] leading-relaxed mb-[20px]">
                                Please confirm your selection before we process your subscription.
                            </p>
                            <div className="flex gap-[12px]">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 py-[10px] rounded-[10px] border border-[#e5e7eb] text-[#374151] font-semibold text-[14px] hover:bg-gray-50 transition-colors"
                                >
                                    No, Review
                                </button>
                                <button
                                    onClick={processSubscription}
                                    className="flex-1 py-[10px] rounded-[10px] bg-[#000785] text-white font-semibold text-[14px] hover:bg-[#000566] transition-all shadow-md active:scale-[0.98]"
                                >
                                    Yes, Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
