import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from './useLoginForm';
import { useAuth } from './useAuth';
import type { LoginResponse } from '@/types';
import * as AuthContext from '@/context/AuthContext';

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useAuthForm hook', () => {
  const mockLogin = vi.fn();
  const mockContextLogin = vi.fn();
  const mockResponse: LoginResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: '2025-11-11T21:29:24.3009622Z',
    user: {
      id: '17dc09a2-52b4-421e-a8ee-f9f1301c4815',
      username: 'admin',
      email: 'admin@nexus.com',
      role: 'admin',
      provider: '',
      isActive: true,
      createdAt: '0001-01-01T00:00:00',
      updatedAt: undefined,
      lastLogin: undefined,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAuth hook
    (useAuth as unknown as Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });

    // Mock useAuth context
    vi.spyOn(AuthContext, 'useAuthContext').mockReturnValue({
      isAuthenticated: false,
      login: mockContextLogin,
      logout: vi.fn(),
    } as any);
  });

  it('should initialize with empty username and password', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update username and password correctly', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('admin123');
    });
    expect(result.current.username).toBe('admin');
    expect(result.current.password).toBe('admin123');
  });

  it('should call login and contextLogin on submit', async () => {
    mockLogin.mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('admin123');
    });

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      const res = await result.current.handleSubmit(fakeEvent);
      expect(res).toEqual(mockResponse);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin123',
    });
    expect(mockContextLogin).toHaveBeenCalledWith(
      'mock-access-token',
      mockResponse.user,
    );
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle login failure correctly', async () => {
    const mockError = new Error('Login failed');
    mockLogin.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('WrongPassword');
    });

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await expect(result.current.handleSubmit(fakeEvent)).rejects.toThrow(
        'Login failed',
      );
    });

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'admin',
      password: 'WrongPassword',
    });
    expect(mockContextLogin).not.toHaveBeenCalled();
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not call contextLogin if response is missing accessToken', async () => {
    const incompleteResponse: LoginResponse = {
      accessToken: '',
      refreshToken: 'mock-refresh-token',
      expiresAt: '2025-11-11T21:29:24.3009622Z',
      user: {
        id: '17dc09a2-52b4-421e-a8ee-f9f1301c4815',
        username: 'admin',
        email: 'admin@nexus.com',
        role: 'admin',
        provider: '',
        isActive: true,
        createdAt: '0001-01-01T00:00:00',
        updatedAt: undefined,
        lastLogin: undefined,
      },
    };

    mockLogin.mockResolvedValueOnce(incompleteResponse);
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('admin123');
    });

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockContextLogin).not.toHaveBeenCalled();
  });

  it('should reset username and password', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('admin123');
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
  });
});
