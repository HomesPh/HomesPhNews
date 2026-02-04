"use client";

import { useRef, useState } from 'react';
import { Upload, Loader2, Info, MapPin } from 'lucide-react';

interface RestaurantEditorFormProps {
    data: any;
    onDataChange: (field: string, value: any) => void;
}

export default function RestaurantEditorForm({ data, onDataChange }: RestaurantEditorFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

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
                                className="w-5 h-5 rounded border-gray-300 text-[#C10007] focus:ring-[#C10007]"
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
            </div>

            {/* Location */}
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
                                <option value="Philippines">Philippines</option>
                                <option value="International">International</option>
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
                </div>
            </div>

            {/* Details & Story */}
            <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                    Details & Story
                </h3>
                <div className="space-y-4">
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
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Specialty Dish</label>
                        <input
                            type="text"
                            value={data.specialty_dish}
                            onChange={(e) => onDataChange('specialty_dish', e.target.value)}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#111827] mb-2">Menu Highlights</label>
                        <textarea
                            value={data.menu_highlights}
                            onChange={(e) => onDataChange('menu_highlights', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                        />
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-2">Tags / Food Topics</label>
                <input
                    type="text"
                    value={data.food_topics}
                    onChange={(e) => onDataChange('food_topics', e.target.value)}
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                    placeholder="Comma separated: Seafood, Buffet, Date Night"
                />
            </div>
        </div>
    );
}
