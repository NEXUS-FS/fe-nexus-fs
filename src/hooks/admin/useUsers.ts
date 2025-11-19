import { useState, useEffect, useCallback } from 'react'
import { userService } from '@/lib/userService'
import type { User, UsersListResponse, UserFilters } from '@/types'

export function useUsers(initialFilters: UserFilters = { page: 1, limit: 10 }) {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })
  const [filters, setFilters] = useState<UserFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response: UsersListResponse = await userService.getUsers(filters)
      setUsers(response.users)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const setSearchQuery = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const refetch = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    goToPage,
    setSearchQuery,
    refetch,
  }
}
