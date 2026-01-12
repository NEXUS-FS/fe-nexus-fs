import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { useAuth } from './useAuth';
import { renderHook, act } from '@testing-library/react';
import type { ErrorResponse, LoginResponse } from '@/types';
import { axiosInstance } from '@/lib/axiosInstance';

vi.mock('@/lib/axiosInstance', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('useAuth hook', () => {
  const mockPost = vi.fn();
  const mockAccessToken = 'test-access-token';
  const mockRefreshToken = 'test-refresh-token';

  beforeEach(() => {
    vi.clearAllMocks();
    (axiosInstance.post as Mock) = mockPost;
    localStorage.clear();
  });

  it('should perform a successful login', async () => {
    const mockResponse: { data: LoginResponse } = {
      data: {
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
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
      },
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      const data = await result.current.login({
        username: 'testuser',
        password: 'password',
      });
      expect(data).toEqual(mockResponse.data);
    });

    expect(mockPost).toHaveBeenCalledWith('/api/Users/login', {
      loginRequest: { username: 'testuser', password: 'password' },
    });

    expect(localStorage.getItem('accessToken')).toBe(mockAccessToken);
    expect(localStorage.getItem('refreshToken')).toBe(mockRefreshToken);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle Axios error with ErrorResponse message', async () => {
    const mockErrorResponse: ErrorResponse = {
      message: 'Invalid username or password',
      statusCode: 401,
    };

    const mockAxiosError = {
      isAxiosError: true,
      response: { data: mockErrorResponse },
    };

    mockPost.mockRejectedValueOnce(mockAxiosError);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(
        result.current.login({ username: 'wrong', password: 'wrong' }),
      ).rejects.toEqual(mockAxiosError);
    });

    expect(result.current.error).toBe(mockErrorResponse.message);
    expect(result.current.isLoading).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('should handle unexpected error', async () => {
    const mockError = new Error('Network crash');
    mockPost.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(
        result.current.login({ username: 'x', password: 'y' }),
      ).rejects.toThrow('Network crash');
    });

    expect(result.current.error).toBe('An unexpected error occured');
    expect(result.current.isLoading).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
