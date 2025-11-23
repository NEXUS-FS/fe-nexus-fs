import { useState } from "react";
import axios, { AxiosError } from 'axios';
import type { ErrorResponse, LoginResponse } from "@/types";
import { axiosInstance } from "@/lib/axiosInstance";

interface LoginCredentials {
    username: string
    password: string
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true)
        setError(null)

        try {
            const { data } = await axiosInstance.post<LoginResponse>(
                `/api/Users/login`,
                { loginRequest: credentials } 
            )
            
            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken) 
            
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'Invalid username or password'
                setError(errorMessage)
            } else {
                setError('An unexpected error occured')
            }
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}