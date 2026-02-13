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
    // Map dimensions
    const width = 800;
    const height = 400;

    // Convert lat/lng to SVG coordinates (simplified projection)
    const projectPoint = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        return { x, y };
    };

    return (
        <div className="relative w-full h-[300px] bg-[#f9fafb] rounded-lg overflow-hidden border border-gray-100">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                {/* World map background (simplified continents outline) */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width={width} height={height} fill="url(#grid)" />

                {/* Simplified world map paths */}
                <path
                    d="M 200 100 Q 250 80 300 100 L 350 120 L 320 180 L 250 170 Z"
                    fill="#e5e7eb"
                    stroke="#d1d5db"
                    strokeWidth="1"
                />
                <path
                    d="M 100 180 L 180 160 L 200 200 L 160 240 L 100 220 Z"
                    fill="#e5e7eb"
                    stroke="#d1d5db"
                    strokeWidth="1"
                />
                <path
                    d="M 400 150 Q 450 140 500 160 L 520 200 L 480 220 L 420 200 Z"
                    fill="#e5e7eb"
                    stroke="#d1d5db"
                    strokeWidth="1"
                />
                <path
                    d="M 600 180 L 650 170 L 680 200 L 660 240 L 620 230 Z"
                    fill="#e5e7eb"
                    stroke="#d1d5db"
                    strokeWidth="1"
                />
                <path
                    d="M 250 250 L 300 240 L 320 280 L 290 300 L 250 290 Z"
                    fill="#e5e7eb"
                    stroke="#d1d5db"
                    strokeWidth="1"
                />

                {/* Data points */}
                {data.filter(point => point.lat !== 0 && point.lng !== 0).map((point, index) => {
                    const { x, y } = projectPoint(point.lat, point.lng);
                    const radius = Math.max(Math.min(point.size, 20), 4); // Clamp size

                    return (
                        <g key={index}>
                            <circle
                                cx={x}
                                cy={y}
                                r={radius}
                                fill="#C10007"
                                fillOpacity="0.3"
                                className="animate-pulse"
                            />
                            <circle
                                cx={x}
                                cy={y}
                                r={radius * 0.6}
                                fill="#C10007"
                                fillOpacity="0.6"
                            />
                            <circle
                                cx={x}
                                cy={y}
                                r={radius * 0.3}
                                fill="#990000"
                            />
                            <title>{point.country}</title>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
