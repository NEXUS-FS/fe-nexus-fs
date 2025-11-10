import { axiosInstance } from '@/lib/axiosInstance';
import type { 
  User, 
  PaginatedResponse, 
  UpdateUserData, 
  ErrorResponse 
} from '@/types';
import { AxiosError } from 'axios';

/**
 * User Service for Admin User Management Operations
 * All methods include Authorization header via axiosInstance interceptor
 */

/**
 * Get all users with pagination
 * @param page - Page number (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Paginated list of users
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<User>> => {
  try {
    const { data } = await axiosInstance.get<PaginatedResponse<User>>(
      '/api/users',
      {
        params: { page, limit }
      }
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        'Failed to fetch users. Please try again later.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while fetching users.');
  }
};

/**
 * Get a single user by ID
 * @param id - User ID
 * @returns User object
 */
export const getUserById = async (id: string): Promise<User> => {
  try {
    const { data } = await axiosInstance.get<User>(`/api/users/${id}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.status === 404
          ? `User with ID ${id} not found.`
          : 'Failed to fetch user details. Please try again later.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while fetching user details.');
  }
};

/**
 * Update a user's information
 * @param id - User ID
 * @param data - Updated user data
 * @returns Updated user object
 */
export const updateUser = async (
  id: string,
  data: UpdateUserData
): Promise<User> => {
  try {
    const { data: updatedUser } = await axiosInstance.put<User>(
      `/api/users/${id}`,
      data
    );
    return updatedUser;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.status === 404
          ? `User with ID ${id} not found.`
          : axiosError.response?.status === 400
          ? 'Invalid user data. Please check your input.'
          : 'Failed to update user. Please try again later.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while updating user.');
  }
};

/**
 * Delete a user
 * @param id - User ID
 * @returns Success message or void
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/users/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.status === 404
          ? `User with ID ${id} not found.`
          : axiosError.response?.status === 403
          ? 'You do not have permission to delete this user.'
          : 'Failed to delete user. Please try again later.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while deleting user.');
  }
};

/**
 * Change a user's role
 * @param id - User ID
 * @param role - New role to assign
 * @returns Updated user object
 */
export const changeUserRole = async (
  id: string,
  role: string
): Promise<User> => {
  try {
    const { data } = await axiosInstance.patch<User>(
      `/api/users/${id}/role`,
      { role }
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.status === 404
          ? `User with ID ${id} not found.`
          : axiosError.response?.status === 400
          ? 'Invalid role. Please provide a valid role.'
          : axiosError.response?.status === 403
          ? 'You do not have permission to change user roles.'
          : 'Failed to change user role. Please try again later.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while changing user role.');
  }
};

/**
 * Toggle a user's status (active/inactive)
 * @param id - User ID
 * @returns Updated user object with toggled status
 */
export const toggleUserStatus = async (id: string): Promise<User> => {
  try {
    const { data } = await axiosInstance.patch<User>(
      `/api/users/${id}/status`
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.status === 404
          ? `User with ID ${id} not found.`
          : axiosError.response?.status === 403
          ? 'You do not have permission to change user status.'
          : 'Failed to toggle user status. Please try again later.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while toggling user status.');
  }
};
