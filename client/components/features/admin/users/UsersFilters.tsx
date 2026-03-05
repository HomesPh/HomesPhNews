import { Search, ChevronDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UsersFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    roleFilter: string;
    setRoleFilter: (role: string) => void;
    roleCounts?: Record<string, number>;
}

/**
 * Premium UsersFilters component with single-line layout
 */
export default function UsersFilters({
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    roleCounts = {}
}: UsersFiltersProps) {
    const roles = ['Admin', 'CEO', 'Editor', 'Blogger', 'Subscriber'];
    return (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb] bg-white">
            {/* Search Input - Expands to fill available space */}
            <div className="flex-1 min-w-[200px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af] group-focus-within:text-[#C10007] transition-colors" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full h-[48px] pl-12 pr-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007]/10 focus:border-[#C10007] focus:bg-white transition-all duration-200"
                />
            </div>

            {/* Role Filter - Fixed width */}
            <div className="w-[180px] flex-none">
                <Select value={roleFilter || "all"} onValueChange={(val) => setRoleFilter(val === "all" ? "" : val)}>
                    <SelectTrigger className="w-full h-[48px] !h-[48px] px-4 bg-[#f9fafb] border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] focus:ring-[#C10007]/10 focus:border-[#C10007] transition-all">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map(role => (
                            <SelectItem key={role} value={role}>
                                {role} <span className="text-[#C10007] ml-1">({roleCounts[role] || 0})</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
