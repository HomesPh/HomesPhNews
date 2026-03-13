"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Check, Save, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminArticles } from "@/lib/api-v2/admin/service/article/getAdminArticles";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import { Input } from "@/components/ui/input";
import { scheduleArticles } from "@/lib/api-v2/admin/service/article-publications";
import { getAdminSites } from "@/lib/api-v2/admin/service/sites/getAdminSites";
import { SiteResource } from "@/lib/api-v2/types/SiteResource";
import { Globe, LayoutGrid } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";


export default function CreateEventPage() {
    const router = useRouter();

    // Event State
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState("08:00");
    const [selectedArticles, setSelectedArticles] = useState<ArticleResource[]>([]);

    // Articles State
    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Filters
    const [categoryFilter, setCategoryFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");
    const [availableFilters, setAvailableFilters] = useState<{ categories: { name: string, count: number }[], countries: { name: string, count: number }[] }>({ categories: [], countries: [] });

    // Success Modal State
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successData, setSuccessData] = useState<{ count: number, date: string, time: string } | null>(null);

    // Sites State
    const [sites, setSites] = useState<SiteResource[]>([]);
    const [selectedSites, setSelectedSites] = useState<number[]>([]);
    const [isSitesLoading, setIsSitesLoading] = useState(true);


    // Fetch Pending Articles
    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await getAdminArticles({
                    status: 'pending',
                    search: searchQuery || undefined,
                    category: categoryFilter || undefined,
                    country: countryFilter || undefined,
                    per_page: 50
                });
                setArticles(response.data.data ?? []);
                if (response.data.available_filters) {
                    setAvailableFilters(response.data.available_filters);
                }
            } catch (error) {
                console.error("Failed to fetch pending articles", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchArticles();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, categoryFilter, countryFilter]);

    // Fetch Sites
    useEffect(() => {
        const fetchSites = async () => {
            setIsSitesLoading(true);
            try {
                const response = await getAdminSites();
                setSites(response.data.data ?? []);
                // By default, select all active sites
                const activeSiteIds = response.data.data
                    .filter(s => s.status === 'active')
                    .map(s => s.id);
                setSelectedSites(activeSiteIds);
            } catch (error) {
                console.error("Failed to fetch sites", error);
            } finally {
                setIsSitesLoading(false);
            }
        };
        fetchSites();
    }, []);

    const handleSiteToggle = (siteId: number) => {
        setSelectedSites(prev => {
            if (prev.includes(siteId)) {
                return prev.filter(id => id !== siteId);
            } else {
                return [...prev, siteId];
            }
        });
    };

    const handleArticleToggle = (article: ArticleResource) => {
        setSelectedArticles(prev => {
            const isSelected = prev.some(a => a.id === article.id);
            if (isSelected) {
                return prev.filter(a => a.id !== article.id);
            } else {
                return [...prev, article];
            }
        });
    };

    const handleSave = async () => {
        if (!date || !time) {
            alert("Please select a date and time");
            return;
        }
        if (selectedArticles.length === 0) {
            alert("Please select at least one article to schedule");
            return;
        }
        if (selectedSites.length === 0) {
            alert("Please select at least one target site for publication");
            return;
        }

        try {
            await scheduleArticles({
                date: date,
                time: time,
                articles: selectedArticles.map(article => ({
                    id: String(article.id),
                    title: article.title,
                    image: article.image || article.image_url,
                    category: article.category,
                    country: article.country,
                    summary: article.summary,
                    source: article.source
                })),
                sites: selectedSites.map(String)
            });

            setSuccessData({
                count: selectedArticles.length,
                date: date,
                time: time
            });
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error("Failed to schedule articles", error);
            alert("Failed to schedule articles. Please try again.");
        }
    };


    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <div className="mb-6">
                <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Calendar
                </Button>
            </div>

            <AdminPageHeader
                title="Article Publication Scheduler"
                description="Schedule multiple articles for bulk publication on the selected date"
                actionLabel={`Schedule ${selectedArticles.length > 0 ? selectedArticles.length : ''} Article${selectedArticles.length !== 1 ? 's' : ''}`}
                onAction={handleSave}
                actionIcon={Save}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Left Panel: Date & Time Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            Publication Schedule
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Date</label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sites Selection */}
                        <div className="pt-4 border-t border-gray-50">
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                                <Globe className="w-5 h-5 text-gray-500" />
                                Target Sites
                            </h3>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                {isSitesLoading ? (
                                    <div className="text-sm text-gray-400 py-4 text-center">Loading sites...</div>
                                ) : sites.length === 0 ? (
                                    <div className="text-sm text-gray-400 py-4 text-center">No sites found.</div>
                                ) : (
                                    sites.map(site => (
                                        <div 
                                            key={site.id}
                                            onClick={() => handleSiteToggle(site.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                selectedSites.includes(site.id)
                                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                                    : "bg-white border-gray-100 hover:border-gray-300 text-gray-600"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center",
                                                selectedSites.includes(site.id) ? "bg-blue-600 border-blue-600" : "border-gray-300"
                                            )}>
                                                {selectedSites.includes(site.id) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium truncate">{site.name}</span>
                                                <span className="text-[10px] opacity-70 truncate">{site.domain}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-3 italic">
                                * Selection defaults to all active sites
                            </p>
                        </div>

                        {selectedArticles.length > 0 && (
                            <div className="space-y-3">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                                    <p className="text-sm text-blue-600 font-medium mb-1">Selections:</p>
                                    <p className="text-2xl font-bold text-blue-900">{selectedArticles.length}</p>
                                    <p className="text-xs text-blue-700 mt-1">Articles selected for scheduling</p>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                                    {selectedArticles.map(article => (
                                        <div key={article.id} className="text-xs bg-white border p-2 rounded flex justify-between items-start gap-2">
                                            <span className="line-clamp-2">{article.title}</span>
                                            <button
                                                onClick={() => handleArticleToggle(article)}
                                                className="text-red-500 hover:text-red-700 shrink-0"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Select Pending Articles */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[600px]">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Select Pending Review Articles</h3>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search pending review articles..."
                                        className="pl-9 h-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <select
                                    className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {availableFilters.categories.map(cat => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name} ({cat.count})
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
                                    value={countryFilter}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                >
                                    <option value="">All Countries</option>
                                    {availableFilters.countries.map(c => (
                                        <option key={c.name} value={c.name}>
                                            {c.name} ({c.count})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isLoading && articles.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">Loading pending articles...</div>
                            ) : articles.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">No pending articles found matching your filters.</div>
                            ) : (
                                <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                                    {articles.map(article => {
                                        const isSelected = selectedArticles.some(a => a.id === article.id);
                                        return (
                                            <div
                                                key={article.id}
                                                onClick={() => handleArticleToggle(article)}
                                                className={cn(
                                                    "cursor-pointer transition-all duration-200 border rounded-lg overflow-hidden relative",
                                                    isSelected
                                                        ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10"
                                                        : "hover:border-blue-300 border-gray-200 hover:bg-gray-50"
                                                )}
                                            >
                                                {/* Disable click on the internal card components to ensure row click works best */}
                                                <div className="pointer-events-none">
                                                    <ArticleListItem article={article} />
                                                </div>

                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 bg-blue-600 text-white p-1.5 rounded-full shadow-lg z-10">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isSuccessModalOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsSuccessModalOpen(false);
                    router.push('/admin/calendar');
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-col items-center justify-center pt-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center">Articles Scheduled!</DialogTitle>
                        <DialogDescription className="text-center text-gray-500 mt-2">
                            Your articles have been successfully queued for publication.
                        </DialogDescription>
                    </DialogHeader>

                    {successData && (
                        <div className="bg-gray-50 rounded-xl p-6 my-4 border border-gray-100">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Articles Count:</span>
                                    <span className="font-semibold text-gray-900">{successData.count}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Scheduled Date:</span>
                                    <span className="font-semibold text-gray-900">
                                        {(() => {
                                            const [year, month, day] = successData.date.split('-');
                                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            });
                                        })()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Scheduled Time:</span>
                                    <span className="font-semibold text-gray-900">{successData.time}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="sm:justify-center">
                        <Button
                            className="w-full sm:w-auto px-8"
                            onClick={() => {
                                setIsSuccessModalOpen(false);
                                router.push('/admin/calendar');
                            }}
                        >
                            Return to Calendar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

