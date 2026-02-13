interface SiteDistributionProps {
    data: {
        site: string;
        articles: number;
        views: number;
        percentage: number;
    }[];
}

export default function SiteDistributionChart({ data }: SiteDistributionProps) {
    return (
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827] mb-1">Content Distribution by Site</h3>
                <p className="text-sm text-gray-500">Where your blogs are published</p>
            </div>
            <div className="space-y-4">
                {data.map((site) => (
                    <div key={site.site} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="font-semibold text-gray-900 mb-1">{site.site}</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-[#C10007]">{site.articles}</span>
                                    <span className="text-xs text-gray-500">blogs</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">{site.views.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">total views</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-[#C10007] h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${site.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-700 w-8 text-right">{site.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
