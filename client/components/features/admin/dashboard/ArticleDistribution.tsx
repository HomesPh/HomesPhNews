import ProgressTracker from "./ProgressTracker";

interface SiteDistribution {
    name: string;
    count: number;
}

interface ArticleDistributionProps {
    sites: SiteDistribution[];
    totalArticles: number;
}

/**
 * ArticleDistribution component showing article counts across different sites
 */
export default function ArticleDistribution({ sites, totalArticles }: ArticleDistributionProps) {
    return (
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            {/* Component Title */}
            <h2 className="text-[18px] font-bold text-[#111827] mb-6 tracking-[-0.5px]">Article Distribution</h2>

            {/* Distribution List */}
            <div className="space-y-4">
                {sites.map((site, index) => (
                    <ProgressTracker
                        key={index}
                        label={site.name}
                        value={site.count}
                        max={totalArticles}
                    />
                ))}
            </div>
        </div>
    );
}
