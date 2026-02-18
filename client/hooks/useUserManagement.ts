"use client";

import { useState, useCallback, useMemo } from 'react';
import { AdminUser, mockUsers } from '@/app/admin/users/data';
import { createUser } from '@/lib/api-v2';

export function useUserManagement() {
    // Initialize state with mock data
    const [users, setUsers] = useState<AdminUser[]>(mockUsers);

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

            const newUser: AdminUser = {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: (firstRole?.toLowerCase() === 'admin' ? 'Admin' : 'Blogger') as 'Admin' | 'Blogger',
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
        addUser,
        updateUser,
        deleteUser,
        changePassword,
        suspendUser,
        banUser,
        unsuspendUser
    };
}
