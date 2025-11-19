import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUsers } from './useUsers'
import { userService } from '@/lib/userService'
import { UserRole, UserStatus, AuthProvider } from '@/types'
import type { UsersListResponse } from '@/types'

vi.mock('@/lib/userService')

describe('useUsers', () => {
  const mockUsersResponse: UsersListResponse = {
    users: [
      {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        provider: AuthProvider.LOCAL,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 10,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch users on mount', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.users).toEqual(mockUsersResponse.users)
    expect(result.current.pagination).toEqual(mockUsersResponse.pagination)
    expect(userService.getUsers).toHaveBeenCalledWith({ page: 1, limit: 10 })
  })

  it('should handle errors when fetching users', async () => {
    const errorMessage = 'Failed to fetch users'
    vi.mocked(userService.getUsers).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
  })

  it('should update search query and reset to page 1', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    result.current.setSearchQuery('test')

    await waitFor(() => {
      expect(userService.getUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'test',
      })
    })
  })

  it('should navigate to specified page', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    result.current.goToPage(2)

    await waitFor(() => {
      expect(userService.getUsers).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
      })
    })
  })
})
