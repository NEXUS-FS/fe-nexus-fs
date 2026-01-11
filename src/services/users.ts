import { axiosInstance } from "@/lib/axiosInstance";
import type { User, PaginatedResponse } from "@/types";

/**
 * User Management API Service
 * Handles user CRUD operations (admin functionality)
 */

interface CreateUserRequest {
  username: string;
  email: string;
  password?: string | null;
  provider: string;
  providerId?: string | null;
  role: string;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  newPassword?: string | null;
}

export const usersApi = {
  /**
   * Get paginated list of users
   */
  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get<PaginatedResponse<User>>(
      "/api/Users",
      {
        params: { pageNumber, pageSize },
      }
    );
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/api/Users/${id}`);
    return response.data;
  },

  /**
   * Get user by username
   */
  getByUsername: async (username: string): Promise<User> => {
    const response = await axiosInstance.get<User>(
      `/api/Users/by-username/${username}`
    );
    return response.data;
  },

  /**
   * Get user by email
   */
  getByEmail: async (email: string): Promise<User> => {
    const response = await axiosInstance.get<User>(
      `/api/Users/by-email/${email}`
    );
    return response.data;
  },

  /**
   * Create new user
   */
  create: async (user: CreateUserRequest): Promise<User> => {
    const response = await axiosInstance.post<User>("/api/Users", user);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: string, updates: UpdateUserRequest): Promise<void> => {
    await axiosInstance.put(`/api/Users/${id}`, updates);
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/Users/${id}`);
  },
};

