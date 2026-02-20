'use client';

import { AdMetricFilters } from "@/lib/api-v2/types/AdMetric";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdMetricsFiltersProps {
  filters: AdMetricFilters;
  onFilterChange: (filters: Partial<AdMetricFilters>) => void;
}

export default function AdMetricsFilters({ filters, onFilterChange }: AdMetricsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white border border-[#e5e7eb] rounded-2xl mb-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="from-date" className="text-xs font-medium text-gray-500 uppercase tracking-wider">From</Label>
        <Input
          id="from-date"
          type="date"
          value={filters.from}
          onChange={(e) => onFilterChange({ from: e.target.value })}
          className="w-40 bg-[#f9fafb]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="to-date" className="text-xs font-medium text-gray-500 uppercase tracking-wider">To</Label>
        <Input
          id="to-date"
          type="date"
          value={filters.to}
          onChange={(e) => onFilterChange({ to: e.target.value })}
          className="w-40 bg-[#f9fafb]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Period</Label>
        <Select
          value={filters.period}
          onValueChange={(val: any) => onFilterChange({ period: val })}
        >
          <SelectTrigger className="w-40 bg-[#f9fafb]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
