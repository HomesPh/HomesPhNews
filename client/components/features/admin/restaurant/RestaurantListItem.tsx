"use client";

import { RestaurantSummary } from '@/lib/api-v2/types/RestaurantResource';
import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

interface RestaurantListItemProps {
    restaurant: RestaurantSummary;
    onClick?: () => void;
    selection?: {
        isSelected: boolean;
        onSelect: (checked: boolean) => void;
    };
}

/**
 * RestaurantListItem component using BaseArticleCard for consistent styling
 */
export default function RestaurantListItem({ restaurant, onClick, selection }: RestaurantListItemProps) {
    const mappedProps = {
        id: restaurant.id,
        image_url: restaurant.image_url,
        title: restaurant.name,
        category: restaurant.cuisine_type || 'Restaurant',
        location: restaurant.city || restaurant.country || 'Unknown',
        summary: [
            restaurant.price_range,
            restaurant.avg_meal_cost,
            restaurant.rating ? `${restaurant.rating} ★` : null
        ].filter(Boolean).join(' • '),
        created_at: restaurant.timestamp ? new Date(restaurant.timestamp * 1000).toISOString() : null,
        views: '0 views',
        status: restaurant.status || 'draft',
        is_redis: restaurant.is_redis,
    };

    return (
        <BaseArticleCard
            article={mappedProps}
            variant="list"
            onClick={onClick}
            selection={selection}
        />
    );
}
