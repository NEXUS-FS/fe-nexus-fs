import { axiosInstance } from "@/lib/axiosInstance";
import type { User, UpdateUserData, ErrorResponse, PaginatedResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { useState } from "react";

export function useUser() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getAllUsers = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
        setIsLoading(true)
        setError(null)

        try {
            const { data } = await axiosInstance.get<PaginatedResponse<User>>(
            '/api/Users',
                {
                    params: { page, limit }
                }
            );
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'Error while fetching the users'
                setError(errorMessage)
            } else {
                setError('An unexpected error occured while fetching users.')
            }
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const getUserById = async (id: string): Promise<User> => {
        setIsLoading(true)
        setError(null)

        try {
            const { data } = await axiosInstance.get<User>(`/api/Users/${id}`)
            return data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'User not found'
                setError(errorMessage)
            } else {
                setError('User not found')
            }
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
        setIsLoading(true)
        setError(null)

        try {
            const { data: updatedUser } = await axiosInstance.put<User>(
                `/api/Users/${id}`,
                data
            );
            return updatedUser
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'An unexpected error occured while updating user.'
                setError(errorMessage)
            } else {
                setError('An unexpected error occured while updating user.')
            }
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deleteUser = async (id: string): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await axiosInstance.delete(`/api/Users/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'An unexpected error occured while deleting user.'
                setError(errorMessage)
            } else {
                setError('An unexpected error occured while deleting user.')
            } 
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const changeUserRole = async (id: string, role: string): Promise<User> => {
        setIsLoading(true)
        setError(null)

        try {
            const { data } = await axiosInstance.patch<User>(
                `/api/Users/${id}/role`,
                { role }
            );
            return data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>
                const errorMessage = 
                    axiosError.response?.data?.message || 
                    axiosError.response?.status === 404
                    ? `User with ID ${id} not found.`
                    : axiosError.response?.status === 400
                    ? 'Invalid role. Please provide a valid role.'
                    : axiosError.response?.status === 403
                    ? 'You do not have permission to change user roles.'
                    : 'Failed to change user role. Please try again later.';
                setError(errorMessage)
            } else {
                setError('An unexpected error occured while changing the role')
            }
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { isLoading, error, getAllUsers, getUserById, updateUser, deleteUser, changeUserRole }
}