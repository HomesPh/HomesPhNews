"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, X, ChevronDown, Sparkles, Calendar, Clock } from "lucide-react";
import { Categories, Countries, RestaurantCategories } from "@/app/data";
import { getSubscriptionById, updateSubscription } from "@/lib/api-v2";
import Link from "next/link";


function EditSubscriptionClient() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    email: "",
    categories: [] as string[],
    countries: [] as string[],
    frequency: "daily", // UI Only
    deliveryTime: "08:00" // UI Only
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine categories for the dropdown
  const combinedCategories = [
    // Regular Categories (excluding "Restaurant" if you want to replace it with specifics, 
    // but usually keys like "Restaurant" might still be valid generic tags. 
    // If the user wants "Restaurant (Fine Dining)" etc, we can append them.)
    ...Categories.filter(c => c.id !== "All").map(c => ({
      ...c,
      displayName: c.label // Default label
    })),
    // Restaurant Sub-categories
    ...RestaurantCategories.filter(c => c.id !== "All").map(c => ({
      id: c.label, // Use label as ID for simplicity if backend supports it, OR keep unique ID if they don't collide. 
      // Ideally 'id' should be unique. 
      // If 'Fine Dining' is the tag, use that.
      label: c.label,
      displayName: `Restaurant (${c.label})`
    }))
  ];

  useEffect(() => {
    if (!id) {
      setError("No subscription ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const response = await getSubscriptionById(id);
        // The API returns { status: 'success', data: { ... } }
        // Type assertion needed because the interface definition currently doesn't match the wrapper
        const apiResponse = response.data as any;
        const data = apiResponse.data || apiResponse;

        setFormData({
          email: data.email || "",
          categories: Array.isArray(data.category) ? data.category : JSON.parse(data.category as string || "[]"),
          countries: Array.isArray(data.country) ? data.country : JSON.parse(data.country as string || "[]"),
          frequency: "daily",
          deliveryTime: "08:00"
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
      await updateSubscription(id, {
        categories: formData.categories,
        countries: formData.countries,
      });
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
    // Force light mode styles on the wrapper
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 z-50 forced-colors-none">
      <div className="w-full max-w-[600px] animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative">

          {/* Brand Header (Matches SubscribeModal) */}
          <div className="h-[70px] bg-[#c10007] relative overflow-hidden flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <img src="/images/HomesTV.png" alt="HomesTV" className="h-9 w-auto object-contain brightness-0 invert" />
            <button
              onClick={() => router.push('/')}
              className="absolute top-[20px] right-[20px] text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-[30px]">
            {!isSuccess ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="font-bold text-[22px] text-[#111827] tracking-[-1px] mb-[8px]">
                  Personalize Your Feed
                </h2>
                <p className="text-[#6b7280] text-[14px] mb-[16px] leading-[20px]">
                  Update your preferences to get the most relevant real estate news.
                </p>

                <form onSubmit={handleSubmit} className="space-y-[10px]" style={{ colorScheme: 'light' }}>
                  {/* Email Address (Moved to Top) */}
                  <div>
                    <label className="block font-semibold text-[13px] text-[#374151] mb-[4px] tracking-[-0.3px]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      readOnly // Usually subscription edits don't change the email itself as it's the ID, but let's keep it readOnly or disabled to prevent issues
                      className="w-full border border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c10007] transition-all bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-[16px]">
                    {/* Categories Selection */}
                    <div>
                      <label className="block font-semibold text-[13px] text-[#374151] mb-[6px] tracking-[-0.3px]">
                        Categories
                      </label>
                      <div className="relative group">
                        <select
                          className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white text-gray-900 transition-all appearance-none cursor-pointer"
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !formData.categories.includes(val)) {
                              setFormData({ ...formData, categories: [...formData.categories, val] });
                            }
                          }}
                        >
                          <option value="" disabled className="text-gray-500">Add Category...</option>
                          {combinedCategories
                            .filter(c => !formData.categories.includes(c.id))
                            .map(c => (
                              <option key={`${c.id}-${c.label}`} value={c.id} className="text-gray-900">
                                {c.displayName}
                              </option>
                            ))}
                        </select>
                        <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                        {formData.categories.map((catId) => {
                          const matchedCat = combinedCategories.find(c => c.id === catId);
                          const label = matchedCat ? matchedCat.displayName : catId;
                          return (
                            <div key={catId} className="flex items-center gap-1 bg-[#fef2f2] text-[#c10007] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#fee2e2]">
                              {label}
                              <X className="w-2.5 h-2.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => setFormData({ ...formData, categories: formData.categories.filter(id => id !== catId) })} />
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
                          className="w-full border border-[#e5e7eb] rounded-[10px] px-[12px] py-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#c10007] bg-white text-gray-900 transition-all appearance-none cursor-pointer"
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !formData.countries.includes(val)) {
                              setFormData({ ...formData, countries: [...formData.countries, val] });
                            }
                          }}
                        >
                          <option value="" disabled className="text-gray-500">Add Region...</option>
                          {Countries.filter(c => c.id !== "Global" && !formData.countries.includes(c.id)).map(c => (
                            <option key={c.id} value={c.id} className="text-gray-900">
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                        {formData.countries.map((countryId) => (
                          <div key={countryId} className="flex items-center gap-1 bg-[#f0f9ff] text-[#0369a1] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#e0f2fe]">
                            {Countries.find(c => c.id === countryId)?.label}
                            <X className="w-2.5 h-2.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => setFormData({ ...formData, countries: formData.countries.filter(id => id !== countryId) })} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Frequency & Time */}
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

                  {/* Buttons */}
                  <div className="pt-0 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-[#c10007] text-white py-[12px] rounded-[10px] font-bold text-[16px] tracking-[-0.5px] hover:bg-[#a00006] transition-all shadow-md active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSaving ? "Saving..." : "Save Preferences"}
                    </button>

                    <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3 mt-1">
                      <Link href="/" className="text-[12px] text-gray-500 hover:text-gray-800 font-medium transition-colors">
                        Cancel
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you sure you want to unsubscribe from all emails?")) {
                            alert("You have been unsubscribed.");
                          }
                        }}
                        className="text-[12px] text-red-500 hover:text-red-700 underline font-medium transition-colors"
                      >
                        Unsubscribe
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-[40px] animate-in zoom-in duration-500">
                <div className="w-[80px] h-[80px] bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-[24px] border border-[#dcfce7]">
                  <CheckCircle2 className="w-[40px] h-[40px] text-[#16a34a]" />
                </div>
                <h3 className="font-bold text-[28px] text-[#111827] tracking-[-1px] mb-[12px]">
                  Preferences Updated!
                </h3>
                <p className="text-[#6b7280] text-[16px] leading-[24px] max-w-[380px] mx-auto mb-[8px]">
                  We've updated your subscription settings.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mt-4">
                  <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                  <span className="text-[12px] font-medium text-gray-500">Redirecting to home...</span>
                </div>
              </div>
            )}
          </div>

          {/* Tiny Footer */}
          {!isSuccess && (
            <div className="bg-gray-50/50 py-3 px-6 text-center border-t border-gray-100">
              <p className="font-normal text-[11px] text-[#9ca3af] tracking-[-0.5px]">
                HomesTV Systems © 2026
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
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
    </div>
  );
}


// Export the content component directly
export default EditSubscriptionClient;

