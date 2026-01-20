import { Calendar } from 'lucide-react';
import Image from 'next/image';
import StatusBadge, { StatusType } from '@/components/features/admin/shared/StatusBadge';

import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

interface ArticleCardProps {
    id: number;
    image: string;
    category: string;
    location: string;
    title: string;
    date: string;
    views: string;
    status: StatusType;
}

/**
 * ArticleCard component for displaying individual articles in the dashboard
 */
export default function ArticleCard(props: ArticleCardProps) {
    return (
        <BaseArticleCard
            article={props}
            variant="compact"
        />
    );
}
