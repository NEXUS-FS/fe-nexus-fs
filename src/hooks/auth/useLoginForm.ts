import type { FormEvent } from 'react';
import { useState } from 'react';
import { useAuth } from './useAuth';
import type { LoginResponse } from '@/types';
import { useAuthContext } from '@/context/AuthContext';

export function useLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuth()
  const { login: contextLogin } = useAuthContext()

  const handleSubmit = async (
    e: FormEvent,
  ): Promise<LoginResponse | undefined> => {
    e.preventDefault()
    const response = await login({ username, password })
    if (response?.accessToken && response?.user) {
      contextLogin(response.accessToken, response.user)
    }

    return response
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleSubmit,
    resetForm,
    isLoading,
    error,
  };
}