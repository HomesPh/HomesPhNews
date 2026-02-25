"use client";

import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

interface ArticleListItemProps {
    article: ArticleResource;
    onClick?: () => void;
}

/**
 * ArticleListItem component for displaying a single article in the management list
 */
export default function ArticleListItem({ article, onClick }: ArticleListItemProps) {
    return (
        <BaseArticleCard
            article={article}
            variant="list"
            onClick={onClick}
        />
    );
}
