"use client";

import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

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
 */
export default function ArticleListItem({ article, onClick, selection }: ArticleListItemProps) {
    return (
        <BaseArticleCard
            article={article}
            variant="list"
            onClick={onClick}
            selection={selection}
        />
    );
}
