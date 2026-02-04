"use client";

import { RestaurantSummary } from '@/lib/api-v2/types/RestaurantResource';
import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";

interface RestaurantListItemProps {
    restaurant: RestaurantSummary;
    onClick?: () => void;
}

/**
 * RestaurantListItem component using BaseArticleCard for consistent styling
 */
export default function RestaurantListItem({ restaurant, onClick }: RestaurantListItemProps) {
    // Map RestaurantSummary to the shape expected by BaseArticleCard
    const mappedProps = {
        id: restaurant.id,
        image_url: restaurant.image_url,
        title: restaurant.name,
        // We treat 'cuisine_type' as category to maintain visual consistency
        category: restaurant.cuisine_type || 'Restaurant',
        location: restaurant.city || restaurant.country || 'Unknown',
        // Creating a summary from available fields
        // Shows "₱₱₱ • 1500 PHP • 4.5 ★"
        summary: [
            restaurant.price_range,
            restaurant.avg_meal_cost,
            restaurant.rating ? `${restaurant.rating} ★` : null
        ].filter(Boolean).join(' • '),
        // Using timestamp as created_at
        created_at: restaurant.timestamp ? new Date(restaurant.timestamp * 1000).toISOString() : null,
        // Views fallback
        views: '0 views',
    };

    return (
        <BaseArticleCard
            article={{
                ...mappedProps,
                // Status mapping: ensure it exists or default to 'draft' if missing for safety
                // We use 'draft' as fallback instead of 'published' to avoid misleading UI
                status: restaurant.status || 'draft',
            }}
            variant="list"
            onClick={onClick}
        />
    );
}
