"use client";

import React, { useCallback, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { MapPin, ExternalLink } from "lucide-react";

const containerStyle = { width: "100%", height: "100%", minHeight: "320px" };

const defaultCenter = { lat: 14.5995, lng: 120.9842 }; // Manila fallback

interface RestaurantLocationMapProps {
    name: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    google_maps_url?: string | null;
    city?: string;
    country?: string;
}

export default function RestaurantLocationMap({
    name,
    address,
    latitude,
    longitude,
    google_maps_url,
    city,
    country,
}: RestaurantLocationMapProps) {
    const [infoOpen, setInfoOpen] = useState(true); // show place by default when we have a marker

    const hasCoords = typeof latitude === "number" && typeof longitude === "number" && !Number.isNaN(latitude) && !Number.isNaN(longitude);
    const center = useMemo(
        () => (hasCoords ? { lat: latitude!, lng: longitude! } : defaultCenter),
        [hasCoords, latitude, longitude]
    );

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-restaurant",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const onMapClick = useCallback(() => {
        setInfoOpen(true);
    }, []);

    const embedQuery = address || [city, country].filter(Boolean).join(", ") || name;
    const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(embedQuery)}&zoom=16`
        : null;

    // No API key: show clickable link only
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-4 p-6">
                <MapPin className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 text-sm">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show the map.</p>
                {google_maps_url && (
                    <a
                        href={google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100"
                    >
                        <ExternalLink className="w-4 h-4" /> Open in Google Maps
                    </a>
                )}
            </div>
        );
    }

    // Has coords: interactive map with marker; click map or marker to show place
    if (isLoaded && hasCoords) {
        return (
            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={16}
                    onClick={onMapClick}
                    options={{
                        zoomControl: true,
                        mapTypeControl: true,
                        streetViewControl: false,
                        fullscreenControl: true,
                    }}
                >
                    <MarkerF
                        position={{ lat: latitude!, lng: longitude! }}
                        onClick={() => setInfoOpen(true)}
                        title={name}
                    />
                    {infoOpen && (
                        <InfoWindowF
                            position={{ lat: latitude!, lng: longitude! }}
                            onCloseClick={() => setInfoOpen(false)}
                        >
                            <div className="p-2 min-w-[200px]">
                                <h4 className="font-bold text-gray-900 mb-1">{name}</h4>
                                {address && <p className="text-xs text-gray-600 mb-2">{address}</p>}
                                {google_maps_url && (
                                    <a
                                        href={google_maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Open in Google Maps
                                    </a>
                                )}
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            </div>
        );
    }

    // Fallback: embed iframe; make it clickable to open place in new tab
    if (loadError) {
        return (
            <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-4 p-6">
                <MapPin className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 text-sm">Map could not be loaded.</p>
                {google_maps_url && (
                    <a
                        href={google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100"
                    >
                        <ExternalLink className="w-4 h-4" /> Open in Google Maps
                    </a>
                )}
            </div>
        );
    }

    // Loading or no coords: show embed iframe (clickable overlay to open place)
    return (
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
            {embedUrl ? (
                <>
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        src={embedUrl}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Restaurant location"
                    />
                    {google_maps_url && (
                        <a
                            href={google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 z-10"
                        >
                            <ExternalLink className="w-4 h-4" /> Click to open place in Google Maps
                        </a>
                    )}
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
                    <MapPin className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500 text-sm">No address or coordinates.</p>
                    {google_maps_url && (
                        <a
                            href={google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100"
                        >
                            <ExternalLink className="w-4 h-4" /> Open in Google Maps
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
