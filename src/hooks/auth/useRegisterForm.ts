import type { FormEvent } from 'react';
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export function useRegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await register({
        username,
        email,
        password,
        provider: 'Basic',
        providerId: null,
        role: 'user',
      });

      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    resetForm,
    isLoading,
    error,
  };
}
