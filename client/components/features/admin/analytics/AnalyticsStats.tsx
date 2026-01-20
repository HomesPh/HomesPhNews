import StatCard from "@/components/features/admin/dashboard/StatCard";
import { AnalyticsStat } from "@/app/admin/analytics/data";

interface AnalyticsStatsProps {
    stats: AnalyticsStat[];
}

/**
 * AnalyticsStats component for displaying the top-row numeric metrics
 */
export default function AnalyticsStats({ stats }: AnalyticsStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    {...stat}
                />
            ))}
        </div>
    );
}
