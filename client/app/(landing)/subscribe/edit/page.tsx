"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowLeft, Mail, X, ChevronDown } from "lucide-react";
import { Categories, Countries } from "@/app/data";
import AXIOS_INSTANCE_PUBLIC from "@/lib/api-v2/public/axios-instance";
import Link from "next/link";

function EditSubscriptionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const [formData, setFormData] = useState({
        email: "",
        categories: [] as string[],
        countries: [] as string[]
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("No subscription ID provided.");
            setIsLoading(false);
            return;
        }

        const fetchSubscription = async () => {
            try {
                const response = await AXIOS_INSTANCE_PUBLIC.get<any>(`/subscribe/${id}`);
                const data = response.data;
                setFormData({
                    email: data.email,
                    categories: Array.isArray(data.category) ? data.category : JSON.parse(data.category || "[]"),
                    countries: Array.isArray(data.country) ? data.country : JSON.parse(data.country || "[]"),
                });
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
                setError("Could not find your subscription. It may have been removed.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSaving(true);
        try {
            await AXIOS_INSTANCE_PUBLIC.patch(`/subscribe/${id}`, {
                categories: formData.categories,
                countries: formData.countries,
            });
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#c10007]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/" className="inline-flex items-center text-[#c10007] font-semibold hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-gray-50 to-white py-16 px-4">
            <div className="max-w-[640px] mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white overflow-hidden animate-in fade-in zoom-in duration-700">
                    {/* Brand Header with subtle glow */}
                    <div className="h-[90px] bg-[#c10007] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                        <img src="/logo-white.png" alt="HomesTV" className="h-[36px] brightness-0 invert relative z-10" />
                    </div>

                    <div className="p-10">
                        {!isSuccess ? (
                            <>
                                <div className="mb-10 text-center">
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">
                                        Update Preferences
                                    </h1>
                                    <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
                                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-[13px] font-bold text-gray-600 tracking-tight">
                                            {formData.email}
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Categories Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                                    <Mail className="w-4 h-4 text-[#c10007]" />
                                                </div>
                                                <label className="text-sm font-black text-gray-800 uppercase tracking-widest">
                                                    Categories
                                                </label>
                                            </div>

                                            <div className="relative group">
                                                <select
                                                    className="w-full h-[48px] border-2 border-gray-100 rounded-2xl px-4 text-sm font-bold focus:ring-4 focus:ring-[#c10007]/5 focus:border-[#c10007] transition-all outline-none appearance-none cursor-pointer bg-gray-50/50 hover:bg-white"
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val && !formData.categories.includes(val)) {
                                                            setFormData({ ...formData, categories: [...formData.categories, val] });
                                                        }
                                                    }}
                                                    value=""
                                                >
                                                    <option value="" disabled>Browse categories...</option>
                                                    {Categories.filter(c => c.id !== "All" && !formData.categories.includes(c.id)).map(c => (
                                                        <option key={c.id} value={c.id}>{c.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                                            </div>

                                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                                {formData.categories.map((catId) => (
                                                    <div key={catId} className="flex items-center gap-2 bg-[#fef2f2] text-[#c10007] pl-3 pr-2 py-1.5 rounded-xl text-[12px] font-black border border-[#fee2e2] shadow-sm animate-in zoom-in duration-300">
                                                        {Categories.find(c => c.id === catId)?.label}
                                                        <button
                                                            type="button"
                                                            className="hover:bg-red-200 rounded-md p-0.5 transition-colors"
                                                            onClick={() => setFormData({ ...formData, categories: formData.categories.filter(id => id !== catId) })}
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.categories.length === 0 && (
                                                    <p className="text-xs text-gray-400 italic">No categories selected</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Countries Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <label className="text-sm font-black text-gray-800 uppercase tracking-widest">
                                                    Countries
                                                </label>
                                            </div>

                                            <div className="relative group">
                                                <select
                                                    className="w-full h-[48px] border-2 border-gray-100 rounded-2xl px-4 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none appearance-none cursor-pointer bg-gray-50/50 hover:bg-white"
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val && !formData.countries.includes(val)) {
                                                            setFormData({ ...formData, countries: [...formData.countries, val] });
                                                        }
                                                    }}
                                                    value=""
                                                >
                                                    <option value="" disabled>Browse countries...</option>
                                                    {Countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id)).map(c => (
                                                        <option key={c.id} value={c.id}>{c.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                                            </div>

                                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                                {formData.countries.map((countryId) => (
                                                    <div key={countryId} className="flex items-center gap-2 bg-blue-50 text-blue-700 pl-3 pr-2 py-1.5 rounded-xl text-[12px] font-black border border-blue-100 shadow-sm animate-in zoom-in duration-300">
                                                        {Countries.find(c => c.id === countryId)?.label}
                                                        <button
                                                            type="button"
                                                            className="hover:bg-blue-200 rounded-md p-0.5 transition-colors"
                                                            onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })}
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.countries.length === 0 && (
                                                    <p className="text-xs text-gray-400 italic">No countries selected</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full h-[60px] bg-gradient-to-r from-[#c10007] to-[#e60009] text-white rounded-[18px] font-black text-lg tracking-tight hover:shadow-[0_10px_30px_rgba(193,0,7,0.3)] hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span>Saving changes...</span>
                                                </>
                                            ) : (
                                                "Save My Preferences"
                                            )}
                                        </button>
                                        <Link href="/" className="block text-center mt-6 text-gray-400 text-[11px] hover:text-gray-600 transition-colors uppercase tracking-[0.2em] font-black">
                                            Return to HomesTV
                                        </Link>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-green-100 animate-bounce">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Preferences Updated!</h1>
                                <p className="text-gray-500 text-lg mb-10 max-w-[340px] mx-auto leading-relaxed">
                                    Your personal news feed is now tuned to your new choices.
                                </p>
                                <div className="flex items-center justify-center gap-3 text-gray-300 font-bold uppercase tracking-widest text-[10px]">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-200" />
                                    <span>Syncing with server...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50/50 p-8 text-center border-t border-gray-100">
                        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                            Need help? Contact our support team. <br />
                            By continuing, you agree to our <a href="#" className="text-gray-600 underline font-bold underline-offset-4 decoration-gray-200">Terms</a> and <a href="#" className="text-gray-600 underline font-bold underline-offset-4 decoration-gray-200">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EditSubscriptionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#c10007]" />
            </div>
        }>
            <EditSubscriptionContent />
        </Suspense>
    );
}
