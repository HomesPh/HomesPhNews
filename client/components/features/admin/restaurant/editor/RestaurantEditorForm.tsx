"use client";

import { useRef, useState } from 'react';
import { Upload, Loader2, MapPin, Star, Calendar, Clock, Globe } from 'lucide-react';
import { Countries } from "@/app/data";
import ArticleRichTextEditor from "@/components/features/admin/articles/editor/ArticleRichTextEditor";

interface RestaurantEditorFormProps {
    data: any;
    onDataChange: (field: string, value: any) => void;
    availableSites?: string[];
}

export default function RestaurantEditorForm({ data, onDataChange, availableSites = [] }: RestaurantEditorFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isScheduled, setIsScheduled] = useState(!!data.scheduled_at);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const reader = new FileReader();
            reader.onload = () => {
                onDataChange('image_url', reader.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Failed to read image", error);
            setIsUploading(false);
        }
    };

    const handleScheduleToggle = (checked: boolean) => {
        setIsScheduled(checked);
        if (!checked) {
            onDataChange('scheduled_at', null);
        } else {
            // Default to tomorrow at noon
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0, 0);
            const iso = tomorrow.toISOString().slice(0, 16);
            onDataChange('scheduled_at', iso);
        }
    };

    const toggleSite = (site: string) => {
        const current: string[] = data.published_sites || [];
        const updated = current.includes(site)
            ? current.filter((s: string) => s !== site)
            : [...current, site];
        onDataChange('published_sites', updated);
    };

    return (
        <div className="w-[600px] border-r border-[#e5e7eb] flex flex-col bg-white overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Core Info Section */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Basic Info
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Restaurant Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => onDataChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="e.g. Spiral Buffet"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Clickbait Hook (Hero Title)</label>
                        <input
                            type="text"
                            value={data.clickbait_hook}
                            onChange={(e) => onDataChange('clickbait_hook', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="e.g. Is this the best buffet in Manila?"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => onDataChange('description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="Short description..."
                        />
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Featured Image
                </h3>
                <div className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-gray-50 group relative cursor-pointer min-h-[160px] flex items-center justify-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
                            <p className="text-[13px] text-[#6b7280]">Uploading...</p>
                        </div>
                    ) : data.image_url ? (
                        <>
                            <img src={data.image_url} alt="Featured" className="w-full h-auto" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white rounded-[6px] text-[14px] font-medium text-[#111827]"
                                >
                                    Change Image
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 px-6 text-center w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
                            <p className="text-[14px] text-[#6b7280] mb-1 font-medium">Drag image here or click to browse</p>
                        </div>
                    )}
                </div>
                <div className="mt-2">
                    <label className="block text-[12px] font-medium text-[#6b7280] mb-1">Or direct URL:</label>
                    <input
                        type="text"
                        value={data.image_url || ''}
                        onChange={(e) => onDataChange('image_url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-[#d1d5db] rounded-[6px] text-[13px] text-[#111827]"
                    />
                </div>
            </div>

            {/* Classification */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Classification
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Cuisine Type</label>
                        <select
                            value={data.cuisine_type}
                            onChange={(e) => onDataChange('cuisine_type', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] bg-white text-[14px]"
                        >
                            <option value="">Select Cuisine</option>
                            <option value="Filipino">Filipino</option>
                            <option value="Italian">Italian</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Chinese">Chinese</option>
                            <option value="American">American</option>
                            <option value="Korean">Korean</option>
                            <option value="International">International</option>
                            <option value="Fusion">Fusion</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Price Range</label>
                        <select
                            value={data.price_range}
                            onChange={(e) => onDataChange('price_range', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] bg-white text-[14px]"
                        >
                            <option value="">Select Range</option>
                            <option value="$">$ (Cheap)</option>
                            <option value="$$">$$ (Moderate)</option>
                            <option value="$$$">$$$ (Expensive)</option>
                            <option value="$$$$">$$$$ (Luxury)</option>
                            <option value="₱">₱ (Cheap)</option>
                            <option value="₱₱">₱₱ (Moderate)</option>
                            <option value="₱₱₱">₱₱₱ (Expensive)</option>
                            <option value="₱₱₱₱">₱₱₱₱ (Luxury)</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Budget Category</label>
                        <select
                            value={data.budget_category}
                            onChange={(e) => onDataChange('budget_category', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] bg-white text-[14px]"
                        >
                            <option value="">Select Category</option>
                            <option value="Budget-Friendly">Budget-Friendly</option>
                            <option value="Mid-Range">Mid-Range</option>
                            <option value="High-End">High-End</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    <div className="flex items-center pt-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_filipino_owned}
                                onChange={(e) => onDataChange('is_filipino_owned', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-[#1428AE] focus:ring-[#1428AE]"
                            />
                            <span className="text-[14px] font-bold text-[#111827]">Filipino Owned? 🇵🇭</span>
                        </label>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-[14px] font-bold text-[#111827] mb-2">Average Meal Cost</label>
                    <input
                        type="text"
                        value={data.avg_meal_cost}
                        onChange={(e) => onDataChange('avg_meal_cost', e.target.value)}
                        className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                        placeholder="e.g. ₱500 - ₱1000 per person"
                    />
                </div>
                <div className="mt-4">
                    <label className="flex items-center gap-2 text-[14px] font-bold text-[#111827] mb-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        Rating
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={data.rating || ''}
                            onChange={(e) => onDataChange('rating', parseFloat(e.target.value) || 0)}
                            className="w-[120px] px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="0.0"
                        />
                        <span className="text-[13px] text-[#6b7280]">out of 5.0</span>
                        {(data.rating > 0) && (
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(data.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Location & Contact */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Location & Contact
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Full Address</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => onDataChange('address', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="Unit, Building, Street, City"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2">City/Location</label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => onDataChange('location', e.target.value)}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                                placeholder="e.g. Makati City"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2">Country</label>
                            <select
                                value={data.country}
                                onChange={(e) => onDataChange('country', e.target.value)}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] bg-white text-[14px]"
                            >
                                {Countries.map((country) => (
                                    <option key={country.id} value={country.id}>{country.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[14px] font-bold text-[#111827] mb-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            Google Maps URL
                        </label>
                        <input
                            type="text"
                            value={data.google_maps_url}
                            onChange={(e) => onDataChange('google_maps_url', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="https://goo.gl/maps/..."
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Contact Info</label>
                        <input
                            type="text"
                            value={data.contact_info}
                            onChange={(e) => onDataChange('contact_info', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="Phone number or email"
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Website</label>
                        <input
                            type="text"
                            value={data.website}
                            onChange={(e) => onDataChange('website', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[14px] font-bold text-[#111827] mb-2">
                            <Globe className="w-4 h-4 text-pink-500" />
                            Social Media
                        </label>
                        <input
                            type="text"
                            value={data.social_media}
                            onChange={(e) => onDataChange('social_media', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="Facebook, Instagram URL or @handle"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[14px] font-bold text-[#111827] mb-2">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            Opening Hours
                        </label>
                        <textarea
                            value={data.opening_hours}
                            onChange={(e) => onDataChange('opening_hours', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="e.g. Mon-Fri: 9AM-10PM, Sat-Sun: 8AM-11PM"
                        />
                    </div>
                </div>
            </div>

            {/* Details & Story */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Details & Story
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2">Owner / Chef</label>
                            <input
                                type="text"
                                value={data.owner_info}
                                onChange={(e) => onDataChange('owner_info', e.target.value)}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                                placeholder="e.g. Juan dela Cruz"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2">Company</label>
                            <input
                                type="text"
                                value={data.company}
                                onChange={(e) => onDataChange('company', e.target.value)}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                                placeholder="e.g. Sofitel Philippines"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Specialty Dish</label>
                        <input
                            type="text"
                            value={data.specialty_dish}
                            onChange={(e) => onDataChange('specialty_dish', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="e.g. Crispy Pata"
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Menu Highlights</label>
                        <textarea
                            value={data.menu_highlights}
                            onChange={(e) => onDataChange('menu_highlights', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="Dish A, Dish B, Dish C..."
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Why Filipinos Love It</label>
                        <textarea
                            value={data.why_filipinos_love_it}
                            onChange={(e) => onDataChange('why_filipinos_love_it', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="Highlight the emotional connection..."
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Brand Story</label>
                        <textarea
                            value={data.brand_story}
                            onChange={(e) => onDataChange('brand_story', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                            placeholder="History or background..."
                        />
                    </div>
                </div>
            </div>

            {/* More Details (Rich Text Content) */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    More Details
                </h3>
                <p className="text-[12px] text-[#6b7280] mb-3">Full rich-text content — like an article body.</p>
                <ArticleRichTextEditor
                    value={data.content || ''}
                    onChange={(val) => onDataChange('content', val)}
                    placeholder="Write a detailed article-style description of this restaurant..."
                    rows={10}
                />
            </div>

            {/* Food Tags */}
            <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-2">Food Tags</label>
                <input
                    type="text"
                    value={data.food_topics}
                    onChange={(e) => onDataChange('food_topics', e.target.value)}
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                    placeholder="Comma separated: Seafood, Buffet, Date Night"
                />
                <p className="text-[12px] text-[#6b7280] mt-1">Optional — separate tags with commas</p>
            </div>

            {/* Publish Settings */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Publish Settings
                </h3>
                <div className="space-y-5">
                    {/* Scheduled Publish */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <input
                                type="checkbox"
                                checked={isScheduled}
                                onChange={(e) => handleScheduleToggle(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#1428AE] focus:ring-[#1428AE]"
                            />
                            <span className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#1428AE]" />
                                Schedule for later
                            </span>
                        </label>
                        {isScheduled ? (
                            <div className="ml-7">
                                <label className="block text-[12px] font-medium text-[#6b7280] mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={data.scheduled_at || ''}
                                    onChange={(e) => onDataChange('scheduled_at', e.target.value || null)}
                                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[14px]"
                                />
                                <p className="text-[12px] text-[#6b7280] mt-1">The restaurant will be published automatically at this time.</p>
                            </div>
                        ) : (
                            <p className="ml-7 text-[13px] text-[#6b7280]">Publish immediately when you click Publish.</p>
                        )}
                    </div>

                    {/* Site Selection */}
                    {availableSites.length > 0 && (
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-3">Publish To</label>
                            <div className="space-y-2">
                                {availableSites.map((site) => (
                                    <label key={site} className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px] border border-transparent hover:border-gray-200 cursor-pointer group transition-all">
                                        <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#111827]">{site}</span>
                                        <input
                                            type="checkbox"
                                            checked={(data.published_sites || []).includes(site)}
                                            onChange={() => toggleSite(site)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#1428AE] focus:ring-[#1428AE]"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
