"use client";

import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { BarChart3 } from "lucide-react";

export default function BloggerAnalyticsPage() {
    return (
        <div className="p-8 space-y-8">
            <AdminPageHeader
                title="Analytics"
                description="Detailed insights into your content performance."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Views by Region</h3>
                    <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        Map visualization placeholder
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic Sources</h3>
                    <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        Chart visualization placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
