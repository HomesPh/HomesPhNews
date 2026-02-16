"use client";

import React, { useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 20,
    lng: 10
};

// Clean "Silver" theme style for Google Maps to match GA4 aesthetics
const mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#e9e9e9" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    }
];

interface GeographicMapProps {
    data: Array<{
        country: string;
        percentage: number;
        lat: number;
        lng: number;
        size: number;
    }>;
}

export function GeographicMap({ data }: GeographicMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    });

    const [selectedMarker, setSelectedMarker] = React.useState<any>(null);

    const validMarkers = useMemo(() =>
        data.filter(d => d.lat !== 0 || d.lng !== 0),
        [data]);

    if (!isLoaded) return <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>;

    return (
        <div className="relative w-full h-[400px] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 mt-2">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={2}
                options={{
                    styles: mapStyles,
                    disableDefaultUI: true,
                    zoomControl: true,
                    backgroundColor: '#f5f5f5'
                }}
            >
                {validMarkers.map((marker, index) => (
                    <MarkerF
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => setSelectedMarker(marker)}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#C10007',
                            fillOpacity: 0.6,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                            scale: Math.max(Math.min(Math.sqrt(marker.size) * 1.5, 30), 8)
                        }}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindowF
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-1">
                            <h4 className="font-bold text-slate-800">{selectedMarker.country}</h4>
                            <p className="text-sm text-slate-600 font-medium">{Math.round(selectedMarker.size).toLocaleString()} views</p>
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>

            {/* Subtle Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm pointer-events-none">
                <div className="flex -space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C10007]" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active Traffic</span>
            </div>
        </div>
    );
}
