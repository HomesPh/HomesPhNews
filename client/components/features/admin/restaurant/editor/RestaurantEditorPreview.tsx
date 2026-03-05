"use client";

import { useRef } from 'react';
import {
    MapPin, Star, Utensils, Phone, DollarSign,
    Wallet, Heart, Clock, Globe, ChefHat, Users, Upload, Building2
} from 'lucide-react';

interface RestaurantEditorPreviewProps {
    data: any;
    onDataChange?: (field: string, value: any) => void;
}

export default function RestaurantEditorPreview({ data, onDataChange }: RestaurantEditorPreviewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onDataChange) return;
        const reader = new FileReader();
        reader.onload = () => onDataChange('image_url', reader.result as string);
        reader.readAsDataURL(file);
        // Reset input so the same file can be re-selected
        e.target.value = '';
    };

    const isEmpty = !data.name && !data.description && !data.image_url;

    return (
        <div className="flex-1 bg-[#f3f4f6] overflow-y-auto custom-scrollbar h-full flex flex-col">
            {/* Preview label */}
            <div className="shrink-0 px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#6b7280] uppercase tracking-wider">Live Preview</span>
                <span className="text-[11px] text-[#9ca3af]">Updates as you type</span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-[860px] mx-auto bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">

                    {/* Hero Image — clickable to change */}
                    <div className="relative h-[280px] w-full bg-gray-200 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        {data.image_url ? (
                            <img
                                src={data.image_url}
                                alt={data.name || 'Restaurant'}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x600?text=Image+Error'; }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                                <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                <p className="text-[13px] text-gray-400 font-medium">Click to upload hero image</p>
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Change image hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg text-[13px] font-bold text-[#111827]">
                                <Upload className="w-4 h-4" />
                                Change Image
                            </div>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                {(data.cuisine_type) && (
                                    <span className="px-3 py-1 bg-[#C10007] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                        {data.cuisine_type}
                                    </span>
                                )}
                                {data.is_filipino_owned && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                                        🇵🇭 Filipino-Owned
                                    </span>
                                )}
                                {(data.rating > 0) && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded-full text-xs font-bold">
                                        <Star className="w-3 h-3 fill-white" />
                                        {data.rating}
                                    </span>
                                )}
                                {data.budget_category && (
                                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                                        {data.budget_category}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight drop-shadow-sm">
                                {data.name || <span className="opacity-40">Restaurant Name</span>}
                            </h1>
                            {(data.location || data.country) && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {[data.location, data.country].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6">

                        {/* Empty state hint */}
                        {isEmpty && (
                            <div className="text-center py-8 text-[#9ca3af]">
                                <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-[14px] font-medium">Start filling in the form to see a live preview</p>
                            </div>
                        )}

                        {/* Clickbait Hook */}
                        {data.clickbait_hook && (
                            <div className="bg-gradient-to-r from-[#C10007] to-[#ff4444] rounded-2xl p-5 mb-6 text-white shadow-md">
                                <p className="text-lg font-black text-center">{data.clickbait_hook}</p>
                            </div>
                        )}

                        {/* Quick Info Grid */}
                        {(data.price_range || data.rating > 0 || data.cuisine_type || data.budget_category) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <DollarSign className="w-4 h-4 text-[#C10007] mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                                    <p className="text-base font-black text-gray-900">{data.price_range || '—'}</p>
                                    {data.avg_meal_cost && <p className="text-[10px] text-gray-400 mt-0.5">{data.avg_meal_cost}</p>}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <Star className="w-4 h-4 text-yellow-400 mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Rating</p>
                                    <p className="text-base font-black text-gray-900">{data.rating > 0 ? `${data.rating}/5` : '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <Utensils className="w-4 h-4 text-emerald-500 mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Cuisine</p>
                                    <p className="text-base font-black text-gray-900 truncate">{data.cuisine_type || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <Wallet className="w-4 h-4 text-blue-500 mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Budget</p>
                                    <p className="text-base font-black text-gray-900 truncate">{data.budget_category || '—'}</p>
                                </div>
                            </div>
                        )}

                        {/* About */}
                        {data.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                                <p className="text-gray-600 leading-relaxed text-[14px]">{data.description}</p>
                            </div>
                        )}

                        {/* Why Filipinos Love It */}
                        {data.why_filipinos_love_it && (
                            <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
                                <h3 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-[#C10007]" />
                                    Why Filipinos Love It
                                </h3>
                                <p className="text-gray-700 text-[13px]">{data.why_filipinos_love_it}</p>
                            </div>
                        )}

                        {/* Brand Story */}
                        {data.brand_story && (
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    The Story
                                </h3>
                                <p className="text-gray-600 text-[13px] leading-relaxed">{data.brand_story}</p>
                            </div>
                        )}

                        {/* More Details (rich text content) */}
                        {data.content && (
                            <div className="mb-6 border-t border-gray-100 pt-5">
                                <h3 className="text-base font-bold text-gray-900 mb-3">More Details</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                />
                            </div>
                        )}

                        {/* Specialty + Menu */}
                        {(data.specialty_dish || data.menu_highlights) && (
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {data.specialty_dish && (
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <ChefHat className="w-4 h-4 text-[#C10007]" />
                                            Specialty
                                        </h3>
                                        <p className="text-gray-600 text-[13px]">{data.specialty_dish}</p>
                                    </div>
                                )}
                                {data.menu_highlights && (
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <Utensils className="w-4 h-4 text-emerald-500" />
                                            Menu Highlights
                                        </h3>
                                        <p className="text-gray-600 text-[13px]">{data.menu_highlights}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Opening Hours + Social */}
                        {(data.opening_hours || data.social_media) && (
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {data.opening_hours && (
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-emerald-500" />
                                            Opening Hours
                                        </h3>
                                        <p className="text-gray-600 text-[12px] whitespace-pre-wrap">{data.opening_hours}</p>
                                    </div>
                                )}
                                {data.social_media && (
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-pink-500" />
                                            Social Media
                                        </h3>
                                        <p className="text-gray-600 text-[12px] break-all">{data.social_media}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Location + Contact */}
                        {(data.address || data.contact_info || data.website || data.owner_info || data.company) && (
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {(data.address || data.location) && (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Address
                                            </p>
                                            <p className="text-gray-700 text-[13px]">{data.address || data.location}</p>
                                        </div>
                                    )}
                                    {data.contact_info && (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> Contact
                                            </p>
                                            <p className="text-gray-700 text-[13px]">{data.contact_info}</p>
                                        </div>
                                    )}
                                    {(data.owner_info || data.company) && (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                                                <Building2 className="w-3 h-3" /> Owner / Company
                                            </p>
                                            <p className="text-gray-700 text-[13px]">
                                                {[data.owner_info, data.company].filter(Boolean).join(' · ')}
                                            </p>
                                        </div>
                                    )}
                                    {data.website && (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Website
                                            </p>
                                            <p className="text-blue-500 text-[12px] truncate">{data.website}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Food Tags */}
                        {data.food_topics && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.food_topics.split(',').map((t: string) => t.trim()).filter(Boolean).map((tag: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
