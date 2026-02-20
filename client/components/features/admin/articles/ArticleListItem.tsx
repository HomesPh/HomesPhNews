"use client";

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";
import { sendNewsletter } from "@/lib/api-v2";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import SendNewsletterModal from './SendNewsletterModal';

interface ArticleListItemProps {
    article: ArticleResource;
    onClick?: () => void;
    selection?: {
        isSelected: boolean;
        onSelect: (checked: boolean) => void;
    };
}

/**
 * ArticleListItem component for displaying a single article in the management list
 * Includes administrative actions like manual newsletter distribution
 */
export default function ArticleListItem({ article, onClick, selection }: ArticleListItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation
        setIsModalOpen(true);
    };

    // Only show send action for published articles
    const actions = article.status === 'published' ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleOpenModal}
                        className="h-8 w-8 rounded-full text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Send to Subscribers</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : null;

    return (
        <>
            <BaseArticleCard
                article={article}
                variant="list"
                onClick={onClick}
                actions={actions || undefined}
                selection={selection}
            />
            <SendNewsletterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                articles={[{
                    id: article.id,
                    title: article.title,
                    category: article.category,
                    country: article.country
                }]}
            />
        </>
    );
}
