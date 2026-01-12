import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { ErrorResponse, LoginResponse } from '@/types';
import { axiosInstance } from '@/lib/axiosInstance';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  provider: 'Basic';
  providerId: null;
  role: 'user';
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post<LoginResponse>(
        `/api/Users/login`,
        { loginRequest: credentials },
      );

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.message || 'Invalid username or password';
        setError(errorMessage);
      } else {
        setError('An unexpected error occured');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post<RegisterCredentials>(
        `/api/Users`,
        credentials,
      );

      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.message ||
          'An error occured while creating an account';
        setError(errorMessage);
      } else {
        setError('An unexpected error occured');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading, error };
}
