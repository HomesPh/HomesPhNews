"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Send,
    Users,
    FileText,
    ChevronRight,
    ChevronLeft,
    Search,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Check,
    Plus,
    FolderPlus,
    Users2,
    Trash2,
    ArrowLeft,
    Inbox
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import {
    getAdminArticles,
    getSubscribersList,
    bulkSendNewsletter,
    getMailingListStats,
    type Subscriber,
    type ArticleResource,
    type MailingListStats,
    type MailingListGroup,
    getMailingListGroups,
    getMailingListGroupDetails,
    createMailingListGroup,
    deleteMailingListGroup
} from "@/lib/api-v2";
import StatCard from "@/components/features/admin/shared/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Step = 'articles' | 'recipients' | 'review';

export default function ManualNewsletterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>('articles');

    // Selection state
    const [selectedArticles, setSelectedArticles] = useState<ArticleResource[]>([]);
    const [selectedSubscriberIds, setSelectedSubscriberIds] = useState<string[]>([]);

    // Data state
    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);
    const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [mailingStats, setMailingStats] = useState<MailingListStats | null>(null);
    const [groups, setGroups] = useState<MailingListGroup[]>([]);
    const [isSending, setIsSending] = useState(false);

    // Group Creation State
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [recipientTab, setRecipientTab] = useState<'individual' | 'groups'>('individual');

    // Filters
    const [articleSearch, setArticleSearch] = useState('');
    const [articleCategory, setArticleCategory] = useState('');
    const [articleCountry, setArticleCountry] = useState('');

    const [subscriberSearch, setSubscriberSearch] = useState('');
    const [subscriberCategory, setSubscriberCategory] = useState('');
    const [subscriberCountry, setSubscriberCountry] = useState('');

    const [availableFilters, setAvailableFilters] = useState<{
        categories: string[];
        countries: string[];
    }>({ categories: [], countries: [] });

    useEffect(() => {
        fetchArticles();
        fetchSubscribers();
        fetchMailingStats();
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setIsLoadingGroups(true);
        try {
            const response = await getMailingListGroups();
            setGroups(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setIsLoadingGroups(false);
        }
    };

    const fetchMailingStats = async () => {
        setIsLoadingStats(true);
        try {
            const response = await getMailingListStats();
            setMailingStats(response.data);
        } catch (error) {
            console.error("Failed to fetch mailing stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const fetchArticles = async () => {
        setIsLoadingArticles(true);
        try {
            const response = await getAdminArticles({ status: 'published', per_page: 100 });
            setArticles(response.data.data || []);
            if (response.data.available_filters) {
                setAvailableFilters(response.data.available_filters);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setIsLoadingArticles(false);
        }
    };

    const fetchSubscribers = async () => {
        setIsLoadingSubscribers(true);
        try {
            const response = await getSubscribersList();
            setSubscribers(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch subscribers:", error);
        } finally {
            setIsLoadingSubscribers(false);
        }
    };

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = !articleSearch || a.title.toLowerCase().includes(articleSearch.toLowerCase());
            const matchesCategory = !articleCategory || a.category === articleCategory;
            const matchesCountry = !articleCountry || a.country === articleCountry;
            return matchesSearch && matchesCategory && matchesCountry;
        });
    }, [articles, articleSearch, articleCategory, articleCountry]);

    const filteredSubscribers = useMemo(() => {
        return subscribers.filter(s => {
            const matchesSearch = !subscriberSearch || s.email.toLowerCase().includes(subscriberSearch.toLowerCase());

            // For subscribers, category and country can be arrays
            const matchesCategory = !subscriberCategory || (
                Array.isArray(s.category) ? s.category.includes(subscriberCategory) : s.category === subscriberCategory
            );
            const matchesCountry = !subscriberCountry || (
                Array.isArray(s.country) ? s.country.includes(subscriberCountry) : s.country === subscriberCountry
            );

            return matchesSearch && matchesCategory && matchesCountry;
        });
    }, [subscribers, subscriberSearch, subscriberCategory, subscriberCountry]);

    const handleToggleArticle = (article: ArticleResource) => {
        setSelectedArticles(prev => {
            const isSelected = prev.find(a => a.id === article.id);
            if (isSelected) {
                return prev.filter(a => a.id !== article.id);
            } else {
                return [...prev, article];
            }
        });
    };

    const handleToggleSubscriber = (id: string) => {
        setSelectedSubscriberIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectGroup = async (group: MailingListGroup) => {
        setIsLoadingSubscribers(true);
        try {
            const response = await getMailingListGroupDetails(group.id);
            const data = response.data.data;
            const groupSubscribers = data.subscribers || [];

            // Be defensive with ID mapping (handle sub_Id or sub_id)
            const groupIds = groupSubscribers.map((s: any) => s.sub_Id || s.sub_id).filter(Boolean);

            if (groupIds.length === 0 && (data as any).debug_count > 0) {
                console.error("Diagnostic mismatch: subscribers found in DB but ID mapping failed.", groupSubscribers);
            }

            setSelectedSubscriberIds(prev => {
                const newIds = [...prev];
                groupIds.forEach(id => {
                    if (!newIds.includes(id)) newIds.push(id);
                });
                return newIds;
            });

            setRecipientTab('individual');
            alert(`Added ${groupIds.length} subscribers from group "${group.name}"`);
        } catch (error) {
            console.error("Failed to load group details:", error);
        } finally {
            setIsLoadingSubscribers(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName || selectedSubscriberIds.length === 0) {
            alert("Please provide a name and select at least one subscriber.");
            return;
        }

        try {
            await createMailingListGroup({
                name: newGroupName,
                description: newGroupDesc,
                subscriber_ids: selectedSubscriberIds
            });
            alert(`Group "${newGroupName}" created with ${selectedSubscriberIds.length} members!`);
            setIsCreateGroupOpen(false);
            setNewGroupName('');
            setNewGroupDesc('');
            fetchGroups();
        } catch (error) {
            console.error("Failed to create group:", error);
            alert("Failed to create group.");
        }
    };

    const handleDeleteGroup = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this group?")) return;
        try {
            await deleteMailingListGroup(id);
            fetchGroups();
        } catch (error) {
            console.error("Failed to delete group:", error);
        }
    };

    const handleSend = async () => {
        if (selectedArticles.length === 0) return;

        setIsSending(true);
        try {
            const articleIds = selectedArticles.map(a => a.id);
            const subscriberIds = selectedSubscriberIds.length > 0 ? selectedSubscriberIds : undefined;

            const response = await bulkSendNewsletter(articleIds, subscriberIds);
            alert(response.data.message || "Newsletter distribution started!");
            router.push('/admin/articles');
        } catch (error: any) {
            console.error("Broadcast failed:", error);
            alert(error.response?.data?.message || "Failed to trigger distribution.");
        } finally {
            setIsSending(false);
        }
    };

    const steps = [
        { id: 'articles', label: 'Select Articles', icon: FileText, desc: 'Choose content to send' },
        { id: 'recipients', label: 'Select Recipients', icon: Users, desc: 'Hand-pick your audience' },
        { id: 'review', label: 'Dispatch', icon: Send, desc: 'Review and broadcast' },
    ];

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen" data-layout-v2="true">
            <AdminPageHeader
                title="Manual Mailing List Broadcast"
                description="Targeted article distribution to your subscriber base"
            />

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {isLoadingStats ? (
                    Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl bg-white shadow-sm" />
                    ))
                ) : (
                    <>
                        <StatCard
                            title="Total Broadcasts"
                            value={mailingStats?.stats.total_broadcasts ?? 0}
                            trend="Historical Total"
                            iconName="Mail"
                        />
                        <StatCard
                            title="Total Recipients Reached"
                            value={(mailingStats?.stats.total_recipients ?? 0).toLocaleString()}
                            trend="Campaign Impact"
                            iconName="Users"
                        />
                        <StatCard
                            title="Current Subscribers"
                            value={(mailingStats?.stats.total_subscribers ?? 0).toLocaleString()}
                            trend="Total Audience"
                            iconName="Users"
                        />
                    </>
                )}
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
                {steps.map((step, idx) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;
                    const StepIcon = step.icon;

                    return (
                        <div key={step.id} className="flex-1 flex items-center group">
                            <div className="flex flex-col items-center flex-1">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-100" :
                                        isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={cn(
                                        "text-[13px] font-bold tracking-tight",
                                        isActive ? "text-blue-600" : "text-gray-500"
                                    )}>{step.label}</p>
                                    <p className="text-[11px] text-gray-400 font-medium">{step.desc}</p>
                                </div>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden flex flex-col min-h-[500px]">

                {/* Step 1: Articles */}
                {currentStep === 'articles' && (
                    <>
                        <div className="p-6 border-b border-gray-100 flex flex-col gap-6 bg-gray-50/50">
                            {/* Row 1: Header */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                                <div>
                                    <h2 className="text-lg font-bold text-[#1e293b]">Choose Articles</h2>
                                    <p className="text-sm text-gray-500">Pick one or more published articles for your digest.</p>
                                </div>
                            </div>

                            {/* Row 2: Search and Filters */}
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search published articles..."
                                        value={articleSearch}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArticleSearch(e.target.value)}
                                        className="pl-10 rounded-lg border-gray-200 w-full"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <select
                                        value={articleCategory}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArticleCategory(e.target.value)}
                                        className="flex-1 md:w-auto h-10 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {availableFilters.categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <select
                                        value={articleCountry}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArticleCountry(e.target.value)}
                                        className="flex-1 md:w-auto h-10 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Countries</option>
                                        {availableFilters.countries.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Actions (Moved Up) */}
                        <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-tight text-center sm:text-left">
                                {selectedArticles.length} articles selected
                            </p>
                            <Button
                                onClick={() => setCurrentStep('recipients')}
                                disabled={selectedArticles.length === 0}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-full shadow-lg shadow-blue-100 transition-all active:scale-95"
                            >
                                NEXT: SELECT RECIPIENTS <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[600px] p-6">
                            {isLoadingArticles ? (
                                <div className="h-64 flex items-center justify-center flex-col gap-3">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                    <span className="text-sm font-medium text-gray-400">Fetching published articles...</span>
                                </div>
                            ) : filteredArticles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredArticles.map((article) => {
                                        const isSelected = selectedArticles.some(a => a.id === article.id);
                                        return (
                                            <div
                                                key={article.id}
                                                onClick={() => handleToggleArticle(article)}
                                                className={cn(
                                                    "group relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                                                    isSelected ? "border-blue-500 bg-blue-50/30" : "border-gray-100 bg-white hover:border-blue-200"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-0.5">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                                <div className="aspect-video w-full rounded-md overflow-hidden mb-3 bg-gray-100">
                                                    <img
                                                        src={article.image_url || 'https://placehold.co/400x225'}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <Badge variant="secondary" className="mb-2 bg-gray-100 text-gray-600 border-none uppercase text-[10px] font-bold">
                                                    {article.category}
                                                </Badge>
                                                <h3 className="text-sm font-bold text-[#1e293b] line-clamp-2 leading-tight">
                                                    {article.title}
                                                </h3>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                    <Inbox className="w-12 h-12 mb-2 opacity-20" />
                                    <p className="font-medium">No published articles available</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Step 2: Recipients */}
                {currentStep === 'recipients' && (
                    <>
                        <div className="p-6 border-b border-gray-100 flex flex-col gap-6 bg-gray-50/50">
                            {/* Row 1: Header and Tabs */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                                <div>
                                    <h2 className="text-lg font-bold text-[#1e293b]">Choose Recipients</h2>
                                    <p className="text-sm text-gray-500">Pick specific people or keep empty to send based on preferences.</p>
                                </div>
                                <div className="flex flex-wrap justify-center bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
                                    <button
                                        onClick={() => {
                                            setRecipientTab('individual');
                                            setSubscriberSearch('');
                                        }}
                                        className={cn(
                                            "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            recipientTab === 'individual' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                                        )}
                                    >
                                        INDIVIDUALS
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRecipientTab('groups');
                                            setSubscriberSearch('');
                                        }}
                                        className={cn(
                                            "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            recipientTab === 'groups' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                                        )}
                                    >
                                        GROUPS
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Search and Filters */}
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder={recipientTab === 'individual' ? "Search by email..." : "Search groups..."}
                                        value={subscriberSearch}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubscriberSearch(e.target.value)}
                                        className="pl-10 rounded-lg border-gray-200 w-full"
                                    />
                                </div>
                                {recipientTab === 'individual' && (
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <select
                                            value={subscriberCategory}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubscriberCategory(e.target.value)}
                                            className="flex-1 md:w-auto h-10 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Matches Category</option>
                                            {availableFilters.categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <select
                                            value={subscriberCountry}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubscriberCountry(e.target.value)}
                                            className="flex-1 md:w-auto h-10 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Matches Country</option>
                                            {availableFilters.countries.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Actions (Moved Up) */}
                        <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex flex-col items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                                <Button variant="ghost" onClick={() => setCurrentStep('articles')} className="w-full sm:w-auto font-bold text-gray-500 order-2 sm:order-1">
                                    <ChevronLeft className="mr-2 w-4 h-4" /> BACK
                                </Button>

                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
                                    {selectedSubscriberIds.length > 0 && (
                                        <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full sm:w-auto h-11 px-6 font-bold border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition-all">
                                                    <FolderPlus className="w-4 h-4 mr-2" /> SAVE AS GROUP
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black text-[#1e293b] uppercase tracking-tight">Create New Group</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-6 py-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Group Name</Label>
                                                        <Input
                                                            placeholder="e.g. VIP Clients, Tech News Group..."
                                                            value={newGroupName}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGroupName(e.target.value)}
                                                            className="rounded-xl border-gray-200 text-sm font-medium h-12"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description (Optional)</Label>
                                                        <Textarea
                                                            placeholder="What is this group for?"
                                                            value={newGroupDesc}
                                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewGroupDesc(e.target.value)}
                                                            className="rounded-xl border-gray-200 text-sm font-medium resize-none min-h-[100px]"
                                                        />
                                                    </div>
                                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                                        <span className="text-[11px] font-black text-gray-400 uppercase leading-none">Members Selected</span>
                                                        <span className="text-lg font-black text-blue-600 leading-none">{selectedSubscriberIds.length}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button variant="ghost" onClick={() => setIsCreateGroupOpen(false)} className="flex-1 font-bold text-gray-400 h-12">CANCEL</Button>
                                                    <Button
                                                        onClick={handleCreateGroup}
                                                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl shadow-lg shadow-blue-100"
                                                    >
                                                        CREATE GROUP
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-tight text-center">
                                        {selectedSubscriberIds.length > 0 ? `${selectedSubscriberIds.length} recipients selected` : "Sending to matching preferences"}
                                    </p>
                                    <Button
                                        onClick={() => setCurrentStep('review')}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-full shadow-lg transition-all active:scale-95"
                                    >
                                        NEXT: REVIEW & SEND <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[600px] p-6">
                            {recipientTab === 'individual' ? (
                                <>
                                    {isLoadingSubscribers ? (
                                        <div className="h-64 flex items-center justify-center flex-col gap-3">
                                            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                            <span className="text-sm font-medium text-gray-400">Loading subscribers...</span>
                                        </div>
                                    ) : filteredSubscribers.length > 0 ? (
                                        <div className="border border-gray-100 rounded-xl overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent divide-y divide-gray-50">
                                            <div className="min-w-[600px]">
                                                {filteredSubscribers.map((sub) => (
                                                    <div
                                                        key={sub.sub_Id}
                                                        onClick={() => handleToggleSubscriber(sub.sub_Id)}
                                                        className={cn(
                                                            "flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                                                            selectedSubscriberIds.includes(sub.sub_Id) && "bg-blue-50/50"
                                                        )}
                                                    >
                                                        <Checkbox checked={selectedSubscriberIds.includes(sub.sub_Id)} className="shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-[#1e293b] truncate">{sub.email}</p>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {Array.isArray(sub.category) && sub.category.map((c: string, i: number) => (
                                                                    <span key={i} className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter shrink-0">#{c}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase shrink-0">
                                                            {Array.isArray(sub.country) ? sub.country[0] : sub.country}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                            <Users className="w-12 h-12 mb-2 opacity-20" />
                                            <p className="font-medium">No subscribers found</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {isLoadingGroups ? (
                                        <div className="h-64 flex items-center justify-center flex-col gap-3">
                                            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                            <span className="text-sm font-medium text-gray-400">Loading groups...</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {groups.filter(g => g.name.toLowerCase().includes(subscriberSearch.toLowerCase())).map((group) => (
                                                <div
                                                    key={group.id}
                                                    onClick={() => handleSelectGroup(group)}
                                                    className="p-5 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            <Users2 className="w-5 h-5" />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                            onClick={(e: React.MouseEvent) => handleDeleteGroup(e, group.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="font-bold text-[#1e293b]">{group.name}</h3>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{group.description || 'No description'}</p>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-black uppercase tracking-tight text-gray-400">
                                                        <span>{group.subscribers_count} MEMBERS</span>
                                                        <span className="text-blue-600">Select Group →</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setRecipientTab('individual')}
                                                className="p-5 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all gap-2 min-h-[160px]"
                                            >
                                                <Plus className="w-6 h-6" />
                                                <span className="text-sm font-bold">New Group from Selection</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* Step 3: Review */}
                {currentStep === 'review' && (
                    <div className="p-10 flex flex-col items-center max-w-2xl mx-auto w-full text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-8">
                            <Send className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-black text-[#1e293b] mb-2 tracking-tight uppercase">Ready to Broadcast?</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                            You are about to send a newsletter to your subscribers. Please verify the selection below before proceeding.
                        </p>

                        <div className="w-full space-y-4 mb-10">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-600">Selected Articles</span>
                                </div>
                                <span className="text-lg font-black text-blue-600">{selectedArticles.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-600">Target Recipients</span>
                                </div>
                                <span className="text-lg font-black text-blue-600">
                                    {selectedSubscriberIds.length > 0 ? selectedSubscriberIds.length : "Algorithm Choice"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep('recipients')}
                                className="w-full sm:flex-1 h-12 font-bold text-gray-500 rounded-xl order-2 sm:order-1"
                            >
                                BACK
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={isSending}
                                className="w-full sm:flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isSending ? "DISPATCHING..." : "DISPATCH NOW"}
                            </Button>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-[#64748b]">
                            <AlertCircle className="w-4 h-4" />
                            <p className="text-[11px] font-bold uppercase tracking-widest">Broadcasts are queued and sent in bulk.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Broadcast History */}
            <div className="mt-12 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-[#1e293b]">Broadcast History</h2>
                        <p className="text-sm text-gray-500">Recently dispatched mailing list campaigns.</p>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date Sent</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Articles</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Audience</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoadingStats ? (
                                Array(3).fill(0).map((_, i: number) => (
                                    <tr key={i}>
                                        <td colSpan={4} className="px-6 py-4"><Skeleton className="h-6 w-full" /></td>
                                    </tr>
                                ))
                            ) : mailingStats?.recent_broadcasts && mailingStats.recent_broadcasts.length > 0 ? (
                                mailingStats.recent_broadcasts.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-[#1e293b]">
                                            {new Date(log.sent_at).toLocaleDateString()}
                                            <span className="block text-[10px] text-gray-400 font-medium">
                                                {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                            {log.article_count} {log.article_count === 1 ? 'Article' : 'Articles'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-blue-600">
                                            {log.recipient_count.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-green-50 text-green-600 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter">
                                                {log.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                        No broadcast history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
