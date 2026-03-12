"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, UserCheck } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import UsersTabs, { UserTab } from "@/components/features/admin/users/UsersTabs";
import { AdminUser } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';
import { useUserManagement } from '@/hooks/useUserManagement';
import useUrlFilters from '@/hooks/useUrlFilters';
import { Skeleton } from "@/components/ui/skeleton";
import UsersTable from "@/components/features/admin/users/UsersTable";
import { useAlert } from '@/hooks/useAlert';

const URL_FILTERS_CONFIG = {
    status: { default: 'all' as const, resetValues: ['all'] },
    search: { default: '' as const, resetValues: [''] },
};

export default function CEOEditorsPage() {
    const router = useRouter();
    const { showAlert, showConfirm } = useAlert();
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Sync search query with URL
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, setFilter]);

    const {
        users,
        isLoading,
        suspendUser,
        unsuspendUser,
        banUser,
        deleteUser,
        refetch
    } = useUserManagement();

    const pagination = usePagination();

    // Filter only Editors
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            if (user.role !== 'Editor') return false;

            const query = searchQuery.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query);
            const matchesTab = filters.status === 'all' || user.status === filters.status;
            return matchesSearch && matchesTab;
        });
    }, [users, filters, searchQuery]);

    const handleTabChange = (tab: UserTab) => {
        setFilter('status', tab);
        if (pagination.currentPage !== 1) pagination.handlePageChange(1);
    };

    const counts = useMemo(() => {
        const editors = users.filter(u => u.role === 'Editor');
        return {
            all: editors.length,
            active: editors.filter(u => u.status === 'active').length,
            suspended: editors.filter(u => u.status === 'suspended').length,
            banned: editors.filter(u => u.status === 'banned').length,
        };
    }, [users]);

    const handleViewLogs = (user: AdminUser) => {
        router.push(`/ceo/editors/${user.id}`);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Editor Management"
                description="View and monitor editor performance and activity logs"
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-visible shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">

                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb] bg-white">
                    <div className="flex-1 min-w-[200px] relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af] group-focus-within:text-[#1428AE] transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search editors by name or email..."
                            className="w-full h-[48px] pl-12 pr-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1428AE]/10 focus:border-[#1428AE] focus:bg-white transition-all duration-200"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-6 space-y-3">
                        {Array(8).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-[72px] rounded-lg bg-gray-50" />
                        ))}
                    </div>
                ) : (
                    <UsersTable
                        users={filteredUsers.slice((pagination.currentPage - 1) * 10, pagination.currentPage * 10)}
                        onViewDetails={handleViewLogs}
                        onViewBlogs={(name) => {
                            const user = filteredUsers.find(u => u.name === name);
                            if (user) handleViewLogs(user);
                        }}
                        // Provide empty handlers for other actions to avoid errors
                        onSuspend={() => { }}
                        onUnsuspend={() => { }}
                        onBan={() => { }}
                        onUnban={() => { }}
                        onEdit={() => { }}
                        onDelete={() => { }}
                        onChangePassword={() => { }}
                        isCEOView={true}
                    />
                )}
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(filteredUsers.length / 10) || 1}
                    onPageChange={pagination.handlePageChange}
                />
            </div>
        </div>
    );
}
