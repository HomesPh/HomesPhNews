"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Users, Loader2, Send } from "lucide-react";
import { getSubscribersList, type Subscriber, sendNewsletter, bulkSendNewsletter } from "@/lib/api-v2";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ArticleInfo {
    id: string;
    title: string;
    category: string;
    country: string;
}

interface SendNewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
    articles: ArticleInfo[];
}

export default function SendNewsletterModal({
    isOpen,
    onClose,
    articles
}: SendNewsletterModalProps) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSubscribers();
            setSearchQuery("");
            setSelectedIds([]);
        }
    }, [isOpen]);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const response = await getSubscribersList();
            setSubscribers(response.data.data);
        } catch (error) {
            console.error("Failed to fetch subscribers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSubscribers = useMemo(() => {
        if (!searchQuery) return subscribers;
        const lowQuery = searchQuery.toLowerCase();
        return subscribers.filter(sub =>
            sub.email.toLowerCase().includes(lowQuery)
        );
    }, [subscribers, searchQuery]);

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredSubscribers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSubscribers.map(s => s.sub_Id));
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleSend = async (useSelection: boolean) => {
        const targetSubscriberIds = useSelection ? selectedIds : undefined;
        const articleIds = articles.map(a => a.id);

        const isBulk = articles.length > 1;

        const confirmMsg = useSelection
            ? `Send ${articles.length} article(s) to ${selectedIds.length} selected subscribers?`
            : `Send ${articles.length} article(s) to all matching subscribers?`;

        if (!confirm(confirmMsg)) return;

        setIsSending(true);
        try {
            let response;
            if (isBulk) {
                response = await bulkSendNewsletter(articleIds, targetSubscriberIds);
            } else {
                response = await sendNewsletter(articleIds[0], targetSubscriberIds);
            }
            alert(response.data.message || "Newsletter distribution started!");
            onClose();
        } catch (error: any) {
            console.error("Failed to send newsletter:", error);
            alert(error.response?.data?.message || "Failed to trigger distribution.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-[#e5e7eb] shadow-2xl">
                <DialogHeader className="p-6 pb-2 border-b border-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Send className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-[#111827]">
                                Broadcast Article
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 font-medium">
                                Choose specific recipients or send based on user preferences.
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="mt-4 max-h-[120px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-lg flex gap-3 items-start">
                                <div className="w-8 h-8 rounded bg-white border border-[#e2e8f0] flex-shrink-0 flex items-center justify-center font-bold text-xs text-blue-600">
                                    ID
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-[#1e293b] truncate">
                                        {article.title}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="secondary" className="px-1.5 py-0 rounded text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 border-none">
                                            {article.category}
                                        </Badge>
                                        <Badge variant="secondary" className="px-1.5 py-0 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700 border-none">
                                            {article.country}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogHeader>

                <div className="px-6 py-4 flex flex-col flex-1 overflow-hidden">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Find subscriber by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 border-[#e2e8f0] focus:ring-blue-500 rounded-lg text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="select-all"
                                checked={selectedIds.length > 0 && selectedIds.length === filteredSubscribers.length}
                                onCheckedChange={toggleSelectAll}
                                className="transition-all"
                            />
                            <label htmlFor="select-all" className="text-xs font-bold text-[#64748b] cursor-pointer hover:text-[#0f172a] transition-colors">
                                SELECT ALL {filteredSubscribers.length > 0 && `(${filteredSubscribers.length})`}
                            </label>
                        </div>
                        <div className="text-[10px] font-black text-blue-600 tracking-widest uppercase">
                            {selectedIds.length} RECIPIENTS SELECTED
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[250px] border border-[#f1f5f9] rounded-xl bg-[#fafbfc]">
                        {isLoading ? (
                            <div className="h-full flex flex-center items-center justify-center flex-col gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <span className="text-xs font-semibold text-gray-400">Loading subscriber list...</span>
                            </div>
                        ) : filteredSubscribers.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {filteredSubscribers.map((sub) => (
                                    <div
                                        key={sub.sub_Id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 hover:bg-white transition-all cursor-pointer group",
                                            selectedIds.includes(sub.sub_Id) && "bg-blue-50/30"
                                        )}
                                        onClick={() => toggleSelectOne(sub.sub_Id)}
                                    >
                                        <Checkbox
                                            checked={selectedIds.includes(sub.sub_Id)}
                                            onCheckedChange={() => toggleSelectOne(sub.sub_Id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-[#1e293b] truncate">
                                                {sub.email}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {Array.isArray(sub.category)
                                                    ? sub.category.slice(0, 2).map((c, i) => (
                                                        <span key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">#{c}</span>
                                                    ))
                                                    : sub.category && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">#{sub.category}</span>
                                                }
                                                {Array.isArray(sub.country)
                                                    ? sub.country.slice(0, 2).map((c, i) => (
                                                        <span key={i} className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">@{c}</span>
                                                    ))
                                                    : sub.country && <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">@{sub.country}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-center items-center justify-center flex-col gap-2 p-10 text-center">
                                <Users className="w-12 h-12 text-gray-200" />
                                <p className="text-sm font-semibold text-gray-400">No subscribers found</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="font-bold text-xs text-gray-500 hover:text-gray-900 border-none"
                    >
                        CANCEL
                    </Button>
                    <div className="flex-1" />
                    <Button
                        variant="outline"
                        onClick={() => handleSend(false)}
                        disabled={isSending}
                        className="bg-white hover:bg-gray-50 text-[#1e293b] font-bold text-xs border-[#e2e8f0] h-11 px-6 rounded-lg shadow-sm"
                    >
                        {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Users className="w-3.5 h-3.5 mr-2" />}
                        SKIP & SEND TO MATCHING
                    </Button>
                    <Button
                        onClick={() => handleSend(true)}
                        disabled={isSending || selectedIds.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 px-6 rounded-lg shadow-md transition-all active:scale-95"
                    >
                        {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Send className="w-3.5 h-3.5 mr-2" />}
                        SEND TO SELECTED ({selectedIds.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
