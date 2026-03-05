"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Plus } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import UsersTabs, { UserTab } from "@/components/features/admin/users/UsersTabs";
import UsersFilters from "@/components/features/admin/users/UsersFilters";
import UsersTable from "@/components/features/admin/users/UsersTable";
import UserDetailsModal from "@/components/features/admin/users/UserDetailsModal";
import AddUserModal from "@/components/features/admin/users/AddUserModal";
import EditUserModal from "@/components/features/admin/users/EditUserModal";
import ChangePasswordModal from "@/components/features/admin/users/ChangePasswordModal";
import { AdminUser } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';
import { useUserManagement } from '@/hooks/useUserManagement';
import useUrlFilters from '@/hooks/useUrlFilters';

const URL_FILTERS_CONFIG = {
    status: { default: 'all' as const, resetValues: ['all'] },
    role: { default: '' as const, resetValues: [''] },
    search: { default: '' as const, resetValues: [''] },
};

export default function UsersPage() {
    const router = useRouter();
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Sync search query with URL
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, setFilter]);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUserForView, setSelectedUserForView] = useState<AdminUser | null>(null);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null);
    const [selectedUserForPassword, setSelectedUserForPassword] = useState<AdminUser | null>(null);

    // Use the custom hook for user state management
    const {
        users,
        addUser,
        updateUser,
        deleteUser,
        changePassword,
        suspendUser,
        banUser,
        unsuspendUser
    } = useUserManagement();

    const pagination = usePagination();

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query);
            const matchesRole = !filters.role || user.role === filters.role;
            const matchesTab = filters.status === 'all' || user.status === filters.status;
            return matchesSearch && matchesRole && matchesTab;
        });
    }, [users, filters, searchQuery]);

    const handleTabChange = (tab: UserTab) => {
        setFilter('status', tab);
        if (pagination.currentPage !== 1) pagination.handlePageChange(1);
    };

    const counts = useMemo(() => {
        const statusCounts = {
            all: users.length,
            active: users.filter(u => u.status === 'active').length,
            suspended: users.filter(u => u.status === 'suspended').length,
            banned: users.filter(u => u.status === 'banned').length,
        };

        const roleCounts = users.reduce((acc, user) => {
            // Respect Search and Status Tab for Role counts
            const query = searchQuery.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
            const matchesTab = filters.status === 'all' || user.status === filters.status;

            if (matchesSearch && matchesTab) {
                acc[user.role] = (acc[user.role] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return { ...statusCounts, roles: roleCounts };
    }, [users]);

    // Handlers
    const handleSuspendUser = (user: AdminUser) => {
        if (confirm(`Are you sure you want to suspend ${user.name}? They will not be able to log in.`)) {
            suspendUser(user.id);
        }
    };

    const handleUnsuspendUser = (user: AdminUser) => {
        if (confirm(`Restore access for ${user.name}?`)) {
            unsuspendUser(user.id);
        }
    };

    const handleBanUser = (user: AdminUser) => {
        if (confirm(`DANGER: Are you sure you want to BAN ${user.name}? This is a severe action.`)) {
            banUser(user.id);
        }
    };

    const handleUnbanUser = (user: AdminUser) => {
        if (confirm(`Unban ${user.name}?`)) {
            unsuspendUser(user.id); // Reusing unsuspend logic which sets status to active
        }
    };

    const handleViewBlogs = (userName: string) => {
        router.push(`/admin/blogs?author=${encodeURIComponent(userName)}`);
    };

    const handleAddUser = async (userData: any) => {
        try {
            const newUser = await addUser(userData);
            alert(`User ${newUser.name} added successfully! Credential email has been sent.`);
            setIsAddModalOpen(false);
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || 'Failed to add user. Please check if the email is already in use.');
        }
    };

    const handleEditUser = (id: string, updates: Partial<AdminUser>) => {
        updateUser(id, updates);
        alert('User updated successfully!');
    };

    const handleDeleteUser = (user: AdminUser) => {
        if (confirm(`PERMANENTLY DELETE ${user.name}? This cannot be undone.`)) {
            deleteUser(user.id);
        }
    };

    const handleChangePassword = (id: string, password: string) => {
        changePassword(id, password);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="User Management"
                description="Manage bloggers and user accounts"
                actionLabel="Add User"
                onAction={() => setIsAddModalOpen(true)}
                actionIcon={Plus}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-visible shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <UsersTabs
                    activeTab={filters.status as UserTab}
                    setActiveTab={handleTabChange}
                    counts={counts}
                />

                <UsersFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    roleFilter={filters.role}
                    setRoleFilter={(role) => setFilter('role', role)}
                    roleCounts={counts.roles}
                />

                <UsersTable
                    users={filteredUsers.slice((pagination.currentPage - 1) * 10, pagination.currentPage * 10)}
                    onViewDetails={setSelectedUserForView}
                    onSuspend={handleSuspendUser}
                    onUnsuspend={handleUnsuspendUser}
                    onBan={handleBanUser}
                    onUnban={handleUnbanUser}
                    onViewBlogs={handleViewBlogs}
                    onEdit={setSelectedUserForEdit}
                    onDelete={handleDeleteUser}
                    onChangePassword={setSelectedUserForPassword}
                />
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(filteredUsers.length / 10) || 1}
                    onPageChange={pagination.handlePageChange}
                />
            </div>

            {/* Modals */}
            {selectedUserForView && (
                <UserDetailsModal
                    user={selectedUserForView}
                    onClose={() => setSelectedUserForView(null)}
                />
            )}

            {isAddModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddUser}
                />
            )}

            {selectedUserForEdit && (
                <EditUserModal
                    user={selectedUserForEdit}
                    onClose={() => setSelectedUserForEdit(null)}
                    onSave={handleEditUser}
                />
            )}

            {selectedUserForPassword && (
                <ChangePasswordModal
                    user={selectedUserForPassword}
                    onClose={() => setSelectedUserForPassword(null)}
                    onChangePassword={handleChangePassword}
                />
            )}
        </div>
    );
}
