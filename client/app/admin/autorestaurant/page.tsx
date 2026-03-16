"use client";

import { useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Zap, Utensils } from "lucide-react";
import RestaurantCategoryList from "@/components/features/admin/autorestaurant/RestaurantCategoryList";
import RestaurantManualScrapePanel from "@/components/features/admin/autorestaurant/RestaurantManualScrapePanel";
import RestaurantTargetedManualScrapePanel from "@/components/features/admin/autorestaurant/RestaurantTargetedManualScrapePanel";
import RestaurantScraperControlPanel from "@/components/features/admin/autorestaurant/RestaurantScraperControlPanel";

export default function AutoRestaurantPage() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Auto Restaurant Configuration"
                description="Manage categories and settings for the automated restaurant scraper"
            />

            <div className="mt-6">
                <RestaurantScraperControlPanel />
            </div>

            <div className="mt-4">
                <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-white border border-[#e5e7eb] p-1 h-auto">
                            <TabsTrigger
                                value="categories"
                                className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-[#1428AE] data-[state=active]:text-white"
                            >
                                <Tag className="w-4 h-4" />
                                <span>Categories</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="manual-scrape"
                                className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-[#1428AE] data-[state=active]:text-white"
                            >
                                <Zap className="w-4 h-4" />
                                <span>Manual Scrape</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="categories" className="mt-0 border-none p-0 outline-none">
                        <RestaurantCategoryList />
                    </TabsContent>

                    <TabsContent value="manual-scrape" className="mt-0 border-none p-0 outline-none">
                        <RestaurantTargetedManualScrapePanel />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
