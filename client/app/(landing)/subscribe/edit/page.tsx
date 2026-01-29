"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Mail, X, ChevronDown, Bell, Globe, Sparkles } from "lucide-react";
import { Categories, Countries } from "@/app/data";
import { client } from "@/lib/api-new/client";
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
                const response = await client.get<any>(`/subscribe/${id}`);
                const data = response.data;
                setFormData({
                    email: data.email,
                    categories: Array.isArray(data.category) ? data.category : JSON.parse(data.category || "[]"),
                    countries: Array.isArray(data.country) ? data.country : JSON.parse(data.country || "[]"),
                });
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
                setError("Could not find your subscription.");
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
            await client.patch(`/subscribe/${id}`, {
                categories: formData.categories,
                countries: formData.countries,
            });

            localStorage.setItem('user_preferences', JSON.stringify({
                categories: formData.categories,
                countries: formData.countries,
                email: formData.email,
                subId: id
            }));

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 2500);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#c10007]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 z-50">
                <div className="bg-white p-8 rounded-[24px] shadow-2xl max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-[#c10007]" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <Link href="/" className="inline-flex h-10 items-center justify-center px-6 bg-gray-900 text-white rounded-lg font-bold text-sm">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 z-50">
            <div className="w-full max-w-[650px] animate-in fade-in zoom-in duration-300">
                <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden">

                    {/* Compact Header */}
                    <div className="h-[60px] bg-[#c10007] flex items-center justify-between px-6 relative">
                        <img src="/images/HomesTV.png" alt="HomesTV" className="h-[28px] brightness-0 invert" />
                        <button
                            onClick={() => router.push('/')}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-6">
                        {!isSuccess ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title & Email Block */}
                                <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-[#c10007] mb-0.5">
                                            <Sparkles className="w-3 h-3 fill-current" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Preferences</span>
                                        </div>
                                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Personalize Feed</h1>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                        <span className="text-[12px] font-bold text-gray-600">{formData.email}</span>
                                    </div>
                                </div>

                                {/* Selection Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Categories */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Categories</label>
                                        </div>
                                        <div className="relative">
                                            <select
                                                className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm font-bold bg-gray-50 focus:bg-white transition-all appearance-none outline-none focus:ring-2 focus:ring-[#c10007]/10"
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val && !formData.categories.includes(val)) {
                                                        setFormData({ ...formData, categories: [...formData.categories, val] });
                                                    }
                                                }}
                                                value=""
                                            >
                                                <option value="" disabled>Add Category...</option>
                                                {Categories.filter(c => c.id !== "All" && !formData.categories.includes(c.id)).map(c => (
                                                    <option key={c.id} value={c.id}>{c.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 h-[64px] overflow-y-auto custom-scrollbar content-start">
                                            {formData.categories.map((catId) => (
                                                <span key={catId} className="inline-flex items-center gap-1.5 bg-red-50 text-[#c10007] px-2 py-1 rounded-lg text-[10px] font-black border border-red-100">
                                                    {Categories.find(c => c.id === catId)?.label}
                                                    <X className="w-3 h-3 cursor-pointer hover:scale-110" onClick={() => setFormData({ ...formData, categories: formData.categories.filter(id => id !== catId) })} />
                                                </span>
                                            ))}
                                            {formData.categories.length === 0 && <span className="text-[10px] text-gray-300 italic py-1">None selected</span>}
                                        </div>
                                    </div>

                                    {/* Countries */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Target Areas</label>
                                        </div>
                                        <div className="relative">
                                            <select
                                                className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm font-bold bg-gray-50 focus:bg-white transition-all appearance-none outline-none focus:ring-2 focus:ring-blue-500/10"
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val && !formData.countries.includes(val)) {
                                                        setFormData({ ...formData, countries: [...formData.countries, val] });
                                                    }
                                                }}
                                                value=""
                                            >
                                                <option value="" disabled>Add Region...</option>
                                                {Countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id)).map(c => (
                                                    <option key={c.id} value={c.id}>{c.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 h-[64px] overflow-y-auto custom-scrollbar content-start">
                                            {formData.countries.map((countryId) => (
                                                <span key={countryId} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-black border border-blue-100">
                                                    {Countries.find(c => c.id === countryId)?.label}
                                                    <X className="w-3 h-3 cursor-pointer hover:scale-110" onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })} />
                                                </span>
                                            ))}
                                            {formData.countries.length === 0 && <span className="text-[10px] text-gray-300 italic py-1">None selected</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Link href="/" className="text-[10px] font-black text-gray-400 hover:text-[#c10007] transition-colors uppercase tracking-[0.1em]">
                                            Cancel
                                        </Link>
                                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                        <Link href="/" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.1em]">
                                            Return to HomesTV
                                        </Link>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="h-12 px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[13px] tracking-tight shadow-lg shadow-gray-200 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 mb-2">Updated Successfully!</h1>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">Your preferences have been synced with our news engine.</p>
                                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <Loader2 className="w-3 h-3 animate-spin text-gray-300" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Redirecting...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tiny Footer */}
                    <div className="bg-gray-50/50 py-3 px-6 text-center border-t border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">HomesTV Systems © 2026</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            `}</style>
        </div>
    );
}

export default function EditSubscriptionPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#c10007]" />
            </div>
        }>
            <EditSubscriptionContent />
        </Suspense>
    );
}
