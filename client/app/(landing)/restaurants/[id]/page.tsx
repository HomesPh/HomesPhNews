import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getRestaurantById, getArticleById } from "@/lib/api-v2";
import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import RestaurantDetails from "@/components/features/article/RestaurantDetails";
import ArticleShareBox from "@/components/features/article/ArticleShareBox";
import RelatedArticlesSidebar from "@/components/features/article/RelatedArticlesSidebar";
import ArticleBreadcrumbContainer from "@/components/features/article/ArticleBreadcrumbContainer";
import {
    ArticleHeaderSkeleton,
    ArticleContentSkeleton,
    SidebarSkeleton,
    BreadcrumbSkeleton
} from "@/components/features/article/ArticleSkeletons";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        let restaurant: any;
        try {
            restaurant = await getRestaurantById(id);
        } catch {
            restaurant = await getArticleById(id);
        }

        if (!restaurant) {
            return { title: "Restaurant Not Found" };
        }

        const name = restaurant.name || restaurant.title;
        const description = (restaurant.description || restaurant.summary)?.substring(0, 160) + "...";

        return {
            title: name,
            description: description,
            openGraph: {
                title: name,
                description: description,
                images: (restaurant.image_url || restaurant.image) ? [restaurant.image_url || restaurant.image] : [],
                type: "website",
            }
        };
    } catch (error) {
        return { title: "Error" };
    }
}

async function RestaurantContent({ id }: { id: string }) {
    let restaurant: any;
    try {
        // Try getting from dedicated restaurant endpoint
        restaurant = await getRestaurantById(id);
    } catch (error) {
        try {
            // Fallback to article endpoint (unified model)
            restaurant = await getArticleById(id);
        } catch (innerError) {
            console.error("Error loading restaurant/article:", innerError);
            notFound();
        }
    }

    if (!restaurant) {
        notFound();
    }

    return (
        <div className="flex-1 min-w-0 space-y-8">
            <Suspense fallback={<BreadcrumbSkeleton />}>
                <ArticleBreadcrumbContainer id={id} />
            </Suspense>

            <section>
                <ArticleHeader
                    category={restaurant.cuisine_type || restaurant.category || "Restaurant"}
                    categoryId="Restaurant"
                    location={restaurant.city || restaurant.location || restaurant.country || "Philippines"}
                    countryId={restaurant.country}
                    title={restaurant.name || restaurant.title}
                    subtitle={restaurant.clickbait_hook || (restaurant.description || restaurant.summary)?.substring(0, 160) + "..."}
                    author={{ name: "HomesPh News" }}
                    date={new Date((restaurant.timestamp ? restaurant.timestamp * 1000 : null) || restaurant.created_at || Date.now()).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                    views={restaurant.views_count}
                />

                {(restaurant.image_url || restaurant.image) && (
                    <ArticleFeaturedImage
                        src={restaurant.image_url || restaurant.image}
                        alt={restaurant.name || restaurant.title}
                        caption=""
                        unoptimized={true}
                    />
                )}

                {/* RestaurantDetails expects ArticleResource shape */}
                <RestaurantDetails restaurant={{ ...restaurant, category: "Restaurant" } as any} />

                <ArticleShareBox />
            </section>
        </div>
    );
}

export default async function RestaurantPage({ params }: Props) {
    const { id } = await params;

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-12">
                <Suspense fallback={
                    <div className="flex-1 min-w-0 space-y-8">
                        <BreadcrumbSkeleton />
                        <ArticleHeaderSkeleton />
                        <ArticleContentSkeleton />
                    </div>
                }>
                    <RestaurantContent id={id} />
                </Suspense>

                {/* Sidebar Area */}
                <div className="w-full lg:w-[350px] flex-shrink-0">
                    <Suspense fallback={<SidebarSkeleton />}>
                        <RelatedArticlesSidebar id={id} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
