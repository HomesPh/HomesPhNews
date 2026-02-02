import { Calendar, Eye, MapPin } from 'lucide-react';
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";

interface ArticleListItemProps {
    article: ArticleResource;
    onClick?: () => void;
}

import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

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
