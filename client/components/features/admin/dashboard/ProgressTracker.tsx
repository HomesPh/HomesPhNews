import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
    label: string;
    value: number;
    max: number;
    suffix?: string;
    color?: string;
}

/**
 * ProgressTracker component for displaying progress bars with labels
 */
export default function ProgressTracker({
    label,
    value,
    max,
    suffix = "articles",
    color = "bg-[#C10007]",
}: ProgressTrackerProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div>
            {/* Label and Value */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-[#111827] tracking-[-0.5px]">{label}</span>
                <span className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">
                    {value} {suffix}
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                {/* Active Progress */}
                <div
                    className={cn("h-full rounded-full transition-all duration-500", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
