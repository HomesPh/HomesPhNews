"use client";

import { useState, useCallback, useEffect } from 'react';
import { AdminUser } from '@/app/admin/users/data';
import { createUser } from '@/lib/api-v2';
import { getUsers } from '@/lib/api-v2/admin/service/users/getUsers';

export function useUserManagement() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ----------------------
    // Fetch users from DB on mount
    // ----------------------
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch all pages - start with per_page=100 to get most users
            const response = await getUsers({ per_page: 100, page: 1 });
            const responseData = response.data as any;

            // Handle both paginated and non-paginated responses
            const rawUsers = responseData?.data || responseData || [];

            const mapped: AdminUser[] = (Array.isArray(rawUsers) ? rawUsers : []).map((user: any) => {
                const firstRole = Array.isArray(user.roles) && user.roles.length > 0
                    ? (typeof user.roles[0] === 'string' ? user.roles[0] : (user.roles[0] as any)?.name || '')
                    : 'blogger';

                const roleMap: Record<string, AdminUser['role']> = {
                    admin: 'Admin', ceo: 'CEO', editor: 'Editor', blogger: 'Blogger', subscriber: 'Subscriber'
                };
                const mappedRole: AdminUser['role'] = roleMap[firstRole.toLowerCase()] ?? 'Blogger';

                return {
                    id: user.id?.toString() || '',
                    name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                    email: user.email || '',
                    role: mappedRole,
                    status: (user.status === 'suspended' || user.status === 'banned') ? user.status : 'active' as const,
                    joinedDate: user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—',
                    lastActive: user.updated_at
                        ? new Date(user.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—',
                    blogsPublished: user.blogs_count ?? 0,
                };
            });

            setUsers(mapped);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = useCallback(async (userData: { firstName: string, lastName: string, email: string, role: string }) => {
        try {
            const response = await createUser({
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                role: userData.role
            });

            const responseData = response.data as any;
            const user = responseData.data || responseData;

            if (!user || user.id === undefined) {
                console.error('Invalid user data received:', user);
                throw new Error('Invalid user data received from server');
            }

            // Safe role checking
            const firstRole = Array.isArray(user.roles) && user.roles.length > 0
                ? (typeof user.roles[0] === 'string' ? user.roles[0] : (user.roles[0] as any).name)
                : '';

            const roleMap: Record<string, AdminUser['role']> = {
                admin: 'Admin', ceo: 'CEO', editor: 'Editor', blogger: 'Blogger', subscriber: 'Subscriber'
            };
            const mappedRole: AdminUser['role'] = roleMap[firstRole?.toLowerCase()] ?? 'Blogger';

            const newUser: AdminUser = {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: mappedRole,
                status: 'active',
                joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastActive: 'Just now',
                blogsPublished: 0,
            };

            setUsers(prev => [newUser, ...prev]);
            return newUser;
        } catch (error) {
            console.error('Failed to add user:', error);
            throw error;
        }
    }, []);

    const updateUser = useCallback((id: string, updates: Partial<AdminUser>) => {
        setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, ...updates } : user
        ));
    }, []);

    const deleteUser = useCallback((id: string) => {
        setUsers(prev => prev.filter(user => user.id !== id));
    }, []);

    const changePassword = useCallback((id: string, newPassword: string) => {
        // In a real app, this would make an API call
        console.log(`Password changed for user ${id} to ${newPassword}`);
        alert('Password changed successfully (Mock)');
    }, []);

    // Helper functions for common status updates
    const suspendUser = useCallback((id: string) => {
        updateUser(id, { status: 'suspended' });
    }, [updateUser]);

    const banUser = useCallback((id: string) => {
        updateUser(id, { status: 'banned' });
    }, [updateUser]);

    const unsuspendUser = useCallback((id: string) => {
        updateUser(id, { status: 'active' });
    }, [updateUser]);

    return {
        users,
        isLoading,
        addUser,
        updateUser,
        deleteUser,
        changePassword,
        suspendUser,
        banUser,
        unsuspendUser,
        refetch: fetchUsers,
    };
}

