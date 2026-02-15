import { Calendar } from 'lucide-react';
import Image from 'next/image';
import StatusBadge, { StatusType } from '@/components/features/admin/shared/StatusBadge';

import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

interface ArticleCardProps {
    id: number | string;
    image: string;
    category: string;
    location: string;
    title: string;
    date: string;
    views: string;
    image_position?: number;
    image_position_x?: number;
    content?: string;
    status: StatusType;
    onClick?: () => void;
}

/**
 * ArticleCard component for displaying individual articles in the dashboard
 */
export default function ArticleCard(props: ArticleCardProps) {
    return (
        <BaseArticleCard
            article={{
                id: String(props.id),
                image: props.image,
                category: props.category,
                location: props.location,
                title: props.title,
                date: props.date,
                views: props.views,
                status: props.status,
                image_position: props.image_position,
                image_position_x: props.image_position_x,
                content: props.content
            }}
            variant="compact"
            onClick={props.onClick}
        />
    );
}
