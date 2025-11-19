import { axiosInstance } from './axiosInstance'
import type { 
  UsersListResponse, 
  User, 
  UpdateUserRequest, 
  UserFilters,
  UserRoleType,
  UserStatusType 
} from '../types'

export const userService = {
  /**
   * Fetch paginated list of users with optional filters
   */
  async getUsers(filters: UserFilters = {}): Promise<UsersListResponse> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    const response = await axiosInstance.get<UsersListResponse>(
      `/admin/users?${params.toString()}`
    )
    return response.data
  },

  /**
   * Get a single user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await axiosInstance.get<User>(`/admin/users/${userId}`)
    return response.data
  },

  /**
   * Update user details
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    const response = await axiosInstance.patch<User>(
      `/admin/users/${userId}`,
      data
    )
    return response.data
  },

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    await axiosInstance.delete(`/admin/users/${userId}`)
  },

  /**
   * Change user role
   */
  async changeUserRole(userId: string, role: UserRoleType): Promise<User> {
    const response = await axiosInstance.patch<User>(
      `/admin/users/${userId}/role`,
      { role }
    )
    return response.data
  },

  /**
   * Toggle user status (activate/deactivate)
   */
  async toggleUserStatus(userId: string, status: UserStatusType): Promise<User> {
    const response = await axiosInstance.patch<User>(
      `/admin/users/${userId}/status`,
      { status }
    )
    return response.data
  },
}
