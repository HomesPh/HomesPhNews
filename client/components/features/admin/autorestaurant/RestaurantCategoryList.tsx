"use client";

import { useState, useEffect } from 'react';
import { Tag, Info } from 'lucide-react';

// Restaurant categories from config.py
const RESTAURANT_CATEGORIES = [
    "Fine Dining",
    "Casual Dining",
    "Fast Food Industry",
    "Chef Interviews",
    "Michelin Guide",
];

export default function RestaurantCategoryList() {
    const [categories] = useState<string[]>(RESTAURANT_CATEGORIES);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e5e7eb]">
                <div>
                    <h2 className="text-lg font-semibold text-[#111827]">Restaurant Categories</h2>
                    <p className="text-sm text-[#6b7280] mt-1">
                        These categories are used by the restaurant scraper to find relevant content.
                    </p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Note:</p>
                    <p>Restaurant categories are currently configured in the Python scraper configuration file (config.py). 
                    To modify these categories, update the RESTAURANT_CATEGORIES list in the scraper configuration.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl border border-[#e5e7eb] hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Tag className="w-5 h-5 text-[#1428AE]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111827]">{category}</h3>
                                <p className="text-xs text-[#6b7280] mt-1">Used for scraping</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
