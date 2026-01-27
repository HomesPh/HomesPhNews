"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Plus } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import UsersTabs, { UserTab } from "@/components/features/admin/users/UsersTabs";
import UsersTable from "@/components/features/admin/users/UsersTable";
import UserDetailsModal from "@/components/features/admin/users/UserDetailsModal";
import AddUserModal from "@/components/features/admin/users/AddUserModal";
import { mockUsers, AdminUser } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';

export default function UsersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<UserTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const pagination = usePagination();

    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
            const matchesTab = activeTab === 'all' || user.status === activeTab;
            return matchesSearch && matchesRole && matchesTab;
        });
    }, [activeTab, searchQuery, roleFilter]);

    const counts = useMemo(() => ({
        all: mockUsers.length,
        verified: mockUsers.filter(u => u.status === 'verified').length,
        pending: mockUsers.filter(u => u.status === 'pending').length,
        suspended: mockUsers.filter(u => u.status === 'suspended').length,
    }), []);

    const handleVerifyUser = (user: AdminUser) => {
        alert(`User ${user.name} verified!`);
    };

    const handleSuspendUser = (user: AdminUser) => {
        if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
            alert(`${user.name} suspended!`);
        }
    };

    const handleUnsuspendUser = (user: AdminUser) => {
        alert(`${user.name} unsuspended!`);
    };

    const handleViewBlogs = (userName: string) => {
        router.push(`/admin/blogs?author=${encodeURIComponent(userName)}`);
    };

    const handleAddUser = (userData: any) => {
        alert(`User ${userData.name} added successfully!`);
        setIsAddModalOpen(false);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="User Management"
                description="Manage bloggers and verify user accounts"
                actionLabel="Add User"
                onAction={() => setIsAddModalOpen(true)}
                actionIcon={Plus}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <UsersTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    counts={counts}
                />

                {/* Search and Filters */}
                <div className="flex items-center gap-4 p-5 border-b border-[#e5e7eb]">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name or email..."
                            className="w-full h-[50px] pl-12 pr-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                        />
                    </div>
                    <div className="relative min-w-[159px]">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer shadow-sm"
                        >
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Blogger</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>
                </div>

                <UsersTable
                    users={filteredUsers.slice((pagination.currentPage - 1) * 10, pagination.currentPage * 10)}
                    onViewDetails={setSelectedUser}
                    onVerify={handleVerifyUser}
                    onSuspend={handleSuspendUser}
                    onUnsuspend={handleUnsuspendUser}
                    onViewBlogs={handleViewBlogs}
                />
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(filteredUsers.length / 10) || 1}
                    onPageChange={pagination.handlePageChange}
                />
            </div>

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onApprove={handleVerifyUser}
                />
            )}

            {isAddModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddUser}
                />
            )}
        </div>
    );
}
