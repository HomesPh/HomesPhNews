"use client";

import { useState, useCallback, useMemo } from 'react';
import { AdminUser, mockUsers } from '@/app/admin/users/data';

export function useUserManagement() {
    // Initialize state with mock data
    const [users, setUsers] = useState<AdminUser[]>(mockUsers);

    const addUser = useCallback((userData: Omit<AdminUser, 'id' | 'joinedDate' | 'status' | 'lastActive' | 'blogsPublished'>) => {
        const newUser: AdminUser = {
            id: (users.length + 1).toString(),
            ...userData,
            status: 'active',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            lastActive: 'Just now',
            blogsPublished: 0,
        };
        setUsers(prev => [newUser, ...prev]);
        return newUser;
    }, [users.length]);

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
