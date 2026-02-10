import { getRestaurant } from "@/lib/api-v2/public/services/restaurant/getRestaurant";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';
import { MapPin, Phone, Globe, Facebook, Instagram, Clock, DollarSign, Star, ChefHat } from "lucide-react";
import ShareButtons from "@/components/shared/ShareButtons";
import ArticleContent from "@/components/features/article/ArticleContent";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const { data: restaurant } = await getRestaurant(id);
        const images = Array.isArray(restaurant.image_url) ? restaurant.image_url : (restaurant.image_url ? [restaurant.image_url] : []);

        return {
            title: `${restaurant.name} - HomesPh Restaurants`,
            description: restaurant.description || restaurant.brand_story || `Discover dining at ${restaurant.name} in ${restaurant.city}, ${restaurant.country}.`,
            openGraph: {
                title: restaurant.name,
                description: restaurant.description,
                images: images,
                type: 'website',
            }
        };
    } catch (error) {
        return {
            title: 'Restaurant Not Found - HomesPh',
        };
    }
}

export default async function RestaurantDetailPage({ params }: Props) {
    const { id } = await params;
    let restaurant;

    try {
        const { data } = await getRestaurant(id);
        restaurant = data;
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        notFound();
    }

    const parseJsonField = (field: any): any[] => {
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
            try {
                const parsed = JSON.parse(field);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                // Not JSON, return as single item array if not empty
                return field ? [field] : [];
            }
        }
        return [];
    };

    const images = parseJsonField(restaurant.image_url);
    const mainImage = images[0];
    const galleryImages = images.slice(1);
    const cuisines = parseJsonField(restaurant.cuisine_type);

    // Safe checks for object/array fields if backend sends strings
    const features = Array.isArray(restaurant.features) ? restaurant.features : [];
    const openingHours = restaurant.opening_hours || "Contact for hours";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1d] pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900">
                <Image
                    src={mainImage || 'https://placehold.co/1920x1080?text=No+Image'}
                    alt={restaurant.name}
                    fill
                    className="object-cover opacity-60"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {cuisines.map((cuisine, idx) => (
                                <span key={idx} className="bg-[#cc0000] text-white text-xs font-bold uppercase px-3 py-1 tracking-wider">
                                    {cuisine}
                                </span>
                            ))}
                            {restaurant.status === 'published' && (
                                <span className="bg-green-600 text-white text-xs font-bold uppercase px-3 py-1 tracking-wider">
                                    Verified
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight uppercase">
                            {restaurant.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm font-medium">
                            {restaurant.city && restaurant.country && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#cc0000]" />
                                    <span>{restaurant.city}, {restaurant.country}</span>
                                </div>
                            )}
                            {restaurant.price_range && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-[#cc0000]" />
                                    <span>{restaurant.price_range}</span>
                                </div>
                            )}
                            {restaurant.rating > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span>{restaurant.rating} / 5.0</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section replaced with ArticleContent for better rendering */}
                        <div className="bg-white dark:bg-[#111827] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <ChefHat className="w-6 h-6 text-[#cc0000]" />
                                About {restaurant.name}
                            </h2>

                            <ArticleContent
                                content={restaurant.description || restaurant.brand_story || ""}
                                topics={restaurant.tags || []}
                                originalUrl={restaurant.original_url}
                            />

                            {restaurant.why_filipinos_love_it && (
                                <div className="mt-8 bg-red-50 dark:bg-red-900/10 p-6 rounded-lg border-l-4 border-[#cc0000]">
                                    <h3 className="text-lg font-bold text-[#cc0000] mb-2 uppercase">Why We Love It</h3>
                                    <p className="text-gray-700 dark:text-gray-300 italic">{restaurant.why_filipinos_love_it}</p>
                                </div>
                            )}
                        </div>

                        {/* Menu Highlights */}
                        {(restaurant.specialty_dish || restaurant.menu_highlights) && (
                            <div className="bg-white dark:bg-[#111827] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white mb-6">
                                    Menu Highlights
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {restaurant.specialty_dish && (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg">
                                            <span className="text-xs font-black text-[#cc0000] uppercase tracking-wider block mb-2">Signature Dish</span>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{restaurant.specialty_dish}</p>
                                        </div>
                                    )}
                                    {restaurant.menu_highlights && (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg">
                                            <span className="text-xs font-black text-[#cc0000] uppercase tracking-wider block mb-2">Must Try</span>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{restaurant.menu_highlights}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {galleryImages.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white">Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                            <Image
                                                src={img}
                                                alt={`${restaurant.name} gallery ${idx + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Contact & Location Card */}
                        <div className="bg-white dark:bg-[#111827] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="text-lg font-bold uppercase text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Information
                            </h3>

                            <div className="space-y-4">
                                {restaurant.address && (
                                    <div className="flex gap-3 items-start">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400 mb-1">Address</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{restaurant.address}</p>
                                            {restaurant.google_maps_url && (
                                                <a
                                                    href={restaurant.google_maps_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-[#cc0000] font-bold hover:underline mt-1 inline-block"
                                                >
                                                    Get Directions →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {restaurant.opening_hours && (
                                    <div className="flex gap-3 items-start">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400 mb-1">Opening Hours</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 whitespace-pre-line">{restaurant.opening_hours}</p>
                                        </div>
                                    </div>
                                )}

                                {restaurant.contact_info && (
                                    <div className="flex gap-3 items-start">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400 mb-1">Contact</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{restaurant.contact_info}</p>
                                        </div>
                                    </div>
                                )}

                                {(restaurant.website || restaurant.social_media) && (
                                    <div className="flex gap-3 items-start">
                                        <Globe className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400 mb-1">Online</span>
                                            <div className="flex flex-col gap-1">
                                                {restaurant.website && (
                                                    <a href={restaurant.website} target="_blank" rel="noopener" className="text-sm text-[#cc0000] hover:underline truncate max-w-[200px]">
                                                        Official Website
                                                    </a>
                                                )}
                                                {/* Assuming social_media might be a string URL or JSON string if structured */}
                                                {typeof restaurant.social_media === 'string' && restaurant.social_media.includes('http') && (
                                                    <a href={restaurant.social_media} target="_blank" rel="noopener" className="text-sm text-blue-600 hover:underline">
                                                        Social Media
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <span className="block text-xs uppercase font-bold text-gray-400 mb-3">Share this place</span>
                                <ShareButtons
                                    url={`/restaurants/${restaurant.id}`}
                                    title={`Check out ${restaurant.name} on HomesPh`}
                                    size="sm"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
