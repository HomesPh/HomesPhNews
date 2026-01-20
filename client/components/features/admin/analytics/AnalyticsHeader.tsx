import { ChevronDown, Download } from 'lucide-react';

interface AnalyticsHeaderProps {
    dateRange: string;
    setDateRange: (range: string) => void;
    exportFormat: string;
    setExportFormat: (format: string) => void;
    onExport: () => void;
}

/**
 * AnalyticsHeader component with controls for filtering and exporting data
 */
export default function AnalyticsHeader({
    dateRange,
    setDateRange,
    exportFormat,
    setExportFormat,
    onExport
}: AnalyticsHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">
                    Analytics Dashboard
                </h1>
                <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
                    Track performance metrics and insights across all platforms
                </p>
            </div>

            {/* Filter and Export Controls */}
            <div className="flex items-center gap-4">
                {/* Date Range Filter */}
                <div className="relative">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                        <option>Custom Range</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                </div>

                {/* Export Format Filter */}
                <div className="relative">
                    <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                    >
                        <option>CSV</option>
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>JSON</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                </div>

                {/* Export Data Button */}
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-5 h-[50px] bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span className="text-[16px] font-medium tracking-[-0.5px]">Export Data</span>
                </button>
            </div>
        </div>
    );
}
