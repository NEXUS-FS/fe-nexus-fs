import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUserActions } from './useUserActions'
import { userService } from '@/lib/userService'
import { UserRole, UserStatus, AuthProvider } from '@/types'
import type { User } from '@/types'

vi.mock('@/lib/userService')

describe('useUserActions', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    provider: AuthProvider.LOCAL,
    createdAt: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      vi.mocked(userService.updateUser).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useUserActions())

      const updatedUser = await result.current.updateUser('1', {
        username: 'newusername',
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(updatedUser).toEqual(mockUser)
      expect(userService.updateUser).toHaveBeenCalledWith('1', {
        username: 'newusername',
      })
    })

    it('should handle update errors', async () => {
      const errorMessage = 'Failed to update user'
      vi.mocked(userService.updateUser).mockRejectedValue(
        new Error(errorMessage)
      )

      const { result } = renderHook(() => useUserActions())

      await expect(
        result.current.updateUser('1', { username: 'newusername' })
      ).rejects.toThrow(errorMessage)

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage)
      })
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      vi.mocked(userService.deleteUser).mockResolvedValue()

      const { result } = renderHook(() => useUserActions())

      await result.current.deleteUser('1')

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(userService.deleteUser).toHaveBeenCalledWith('1')
    })
  })

  describe('changeUserRole', () => {
    it('should change user role successfully', async () => {
      const updatedUser = { ...mockUser, role: UserRole.ADMIN }
      vi.mocked(userService.changeUserRole).mockResolvedValue(updatedUser)

      const { result } = renderHook(() => useUserActions())

      const resultUser = await result.current.changeUserRole(
        '1',
        UserRole.ADMIN
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(resultUser).toEqual(updatedUser)
      expect(userService.changeUserRole).toHaveBeenCalledWith('1', UserRole.ADMIN)
    })
  })

  describe('toggleUserStatus', () => {
    it('should toggle user status successfully', async () => {
      const updatedUser = { ...mockUser, status: UserStatus.INACTIVE }
      vi.mocked(userService.toggleUserStatus).mockResolvedValue(updatedUser)

      const { result } = renderHook(() => useUserActions())

      const resultUser = await result.current.toggleUserStatus(
        '1',
        UserStatus.INACTIVE
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(resultUser).toEqual(updatedUser)
      expect(userService.toggleUserStatus).toHaveBeenCalledWith(
        '1',
        UserStatus.INACTIVE
      )
    })
  })
})
