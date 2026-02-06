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
import EditUserModal from "@/components/features/admin/users/EditUserModal";
import ChangePasswordModal from "@/components/features/admin/users/ChangePasswordModal";
import { AdminUser } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';
import { useUserManagement } from '@/hooks/useUserManagement';

export default function UsersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<UserTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');

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
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
            const matchesTab = activeTab === 'all' || user.status === activeTab;
            return matchesSearch && matchesRole && matchesTab;
        });
    }, [users, activeTab, searchQuery, roleFilter]);

    const counts = useMemo(() => ({
        all: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        banned: users.filter(u => u.status === 'banned').length,
    }), [users]);

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

    const handleAddUser = (userData: any) => {
        const newUser = addUser(userData);
        alert(`User ${newUser.name} added successfully! Email invitation sent.`);
        setIsAddModalOpen(false);
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
