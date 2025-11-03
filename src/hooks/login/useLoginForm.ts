import type { FormEvent } from 'react';
import { useState } from 'react';
import { useLogin } from './useLogin';
import type { LoginResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function useLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useLogin()
  const { login: contextLogin } = useAuth()

  const handleSubmit = async (
    e: FormEvent,
  ): Promise<LoginResponse | undefined> => {
    e.preventDefault()
    const response = await login({ username, password })
    if (response?.token) contextLogin(response.token)

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
