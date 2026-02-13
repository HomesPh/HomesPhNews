"use client";

import { useState } from 'react';
import { GeographicMap } from './GeographicMap';

interface CountryData {
    country: string;
    totalViews: number;
}

interface InteractiveGeographicMapProps {
    data: CountryData[];
}

export default function InteractiveGeographicMap({ data }: InteractiveGeographicMapProps) {
    // Transform data for the map component
    // Note: In a real app we'd need a utility to map country names to lat/lng
    // For now we'll use a mocked mapping for common countries

    const mapData = data.map(item => {
        const coords = getCountryCoordinates(item.country);
        return {
            country: item.country,
            percentage: 0, // We can calculate this if needed
            lat: coords.lat,
            lng: coords.lng,
            size: Math.sqrt(item.totalViews) * 2 // Scale bubble size
        };
    });

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] h-full">
            <div className="mb-4">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Geographical Distribution</h3>
                <p className="text-sm text-gray-600">Global audience reach</p>
            </div>
            <GeographicMap data={mapData} />
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {data.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700 truncate">{item.country}</span>
                        <span className="font-medium text-gray-900">{item.totalViews.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Simple utility for demo purposes
function getCountryCoordinates(country: string) {
    const mapping: Record<string, { lat: number; lng: number }> = {
        'Philippines': { lat: 12.8797, lng: 121.7740 },
        'United States': { lat: 37.0902, lng: -95.7129 },
        'Canada': { lat: 56.1304, lng: -106.3468 },
        'Singapore': { lat: 1.3521, lng: 103.8198 },
        'Hong Kong': { lat: 22.3193, lng: 114.1694 },
        'South Korea': { lat: 35.9078, lng: 127.7669 },
        'India': { lat: 20.5937, lng: 78.9629 },
        'United Kingdom': { lat: 55.3781, lng: -3.4360 },
        'Australia': { lat: -25.2744, lng: 133.7751 },
        'Japan': { lat: 36.2048, lng: 138.2529 },
        'United Arab Emirates': { lat: 23.4241, lng: 53.8478 },
        'Italy': { lat: 41.8719, lng: 12.5674 },
    };

    return mapping[country] || { lat: 0, lng: 0 };
}
