import { useState } from 'react'
import { userService } from '@/lib/userService'
import type { User, UpdateUserRequest, UserRoleType, UserStatusType } from '@/types'

export function useUserActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUser = async (
    userId: string,
    data: UpdateUserRequest
  ): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await userService.updateUser(userId, data)
      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (userId: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await userService.deleteUser(userId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const changeUserRole = async (
    userId: string,
    role: UserRoleType
  ): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await userService.changeUserRole(userId, role)
      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change user role'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUserStatus = async (
    userId: string,
    status: UserStatusType
  ): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await userService.toggleUserStatus(userId, status)
      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle user status'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUser,
    deleteUser,
    changeUserRole,
    toggleUserStatus,
    isLoading,
    error,
  }
}
