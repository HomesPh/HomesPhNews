"use client";

import { useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Globe, Tag, Plus, Building2 } from "lucide-react";
import CategoryList from "@/components/features/admin/autonews/CategoryList";
import CountryList from "@/components/features/admin/autonews/CountryList";
import CityList from "@/components/features/admin/autonews/CityList";

export default function AutoNewsPage() {
    const [activeTab, setActiveTab] = useState("countries");

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Auto News Configuration"
                description="Manage countries, cities, and categories for the automated news scraper"
            />

            <div className="mt-8">
                <Tabs defaultValue="countries" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-white border border-[#e5e7eb] p-1 h-auto">
                            <TabsTrigger
                                value="countries"
                                className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-[#C10007] data-[state=active]:text-white"
                            >
                                <Globe className="w-4 h-4" />
                                <span>Countries</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="cities"
                                className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-[#C10007] data-[state=active]:text-white"
                            >
                                <Building2 className="w-4 h-4" />
                                <span>Cities</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-[#C10007] data-[state=active]:text-white"
                            >
                                <Tag className="w-4 h-4" />
                                <span>Categories</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="countries" className="mt-0 border-none p-0 outline-none">
                        <CountryList />
                    </TabsContent>

                    <TabsContent value="cities" className="mt-0 border-none p-0 outline-none">
                        <CityList />
                    </TabsContent>

                    <TabsContent value="categories" className="mt-0 border-none p-0 outline-none">
                        <CategoryList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
