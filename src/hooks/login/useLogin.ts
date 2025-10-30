import { useState } from "react";
import axios, { AxiosError } from 'axios';
import type { ErrorResponse, LoginResponse } from "@/types";

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
            const { data } = await axios.post<LoginResponse>(
                '/api/auth/login',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            localStorage.setItem('token', data.token)
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