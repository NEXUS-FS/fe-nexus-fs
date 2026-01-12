import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '@/services';
import type { User } from '@/types';

/**
 * Hook for admin user management operations
 */
export function useAdminUsers(page: number = 1, pageSize: number = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await usersApi.getAll(page, pageSize);
      setUsers(response.data);
      setTotalCount(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (userId: string) => {
    try {
      await usersApi.delete(userId);
      fetchUsers(); // Refresh list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete user' };
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    try {
      await usersApi.update(userId, updates);
      fetchUsers(); // Refresh list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update user' };
    }
  };

  return {
    users,
    totalCount,
    totalPages,
    isLoading,
    error,
    deleteUser,
    updateUser,
    refresh: fetchUsers,
  };
}
