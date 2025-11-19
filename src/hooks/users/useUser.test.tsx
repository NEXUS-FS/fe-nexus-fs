import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUser } from './useUser';
import { axiosInstance } from '@/lib/axiosInstance';
import type {
  User,
  UpdateUserData,
  PaginatedResponse,
  ErrorResponse,
} from '@/types';

vi.mock('@/lib/axiosInstance', () => ({
  axiosInstance: {
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useUser hook', () => {
  const mockGet = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();
  const mockPatch = vi.fn();

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockPaginatedResponse: PaginatedResponse<User> = {
    data: [mockUser],
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (axiosInstance.get as Mock) = mockGet;
    (axiosInstance.put as Mock) = mockPut;
    (axiosInstance.patch as Mock) = mockPatch;
    (axiosInstance.delete as Mock) = mockDelete;
  });

  describe('getAllUsers', () => {
    it('should fetch all users successfully', async () => {
      mockGet.mockResolvedValueOnce({ data: mockPaginatedResponse });
      const { result } = renderHook(() => useUser());
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      let response: PaginatedResponse<User> | undefined;
      await act(async () => {
        response = await result.current.getAllUsers(1, 10);
      });

      expect(response).toEqual(mockPaginatedResponse);
      expect(mockGet).toHaveBeenCalledWith('/api/Users', {
        params: { page: 1, limit: 10 },
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should use default pagination parameters', async () => {
      mockGet.mockResolvedValueOnce({ data: mockPaginatedResponse });
      const { result } = renderHook(() => useUser());
      await act(async () => {
        await result.current.getAllUsers();
      });

      expect(mockGet).toHaveBeenCalledWith('/api/Users', {
        params: { page: 1, limit: 10 },
      });
    });

    it('should handle axios error with ErrorResponse', async () => {
      const mockErrorResponse: ErrorResponse = {
        message: 'Error while fetching the users',
        statusCode: 500,
      };
      const axiosError = {
        isAxiosError: true,
        response: { data: mockErrorResponse },
      };
      mockGet.mockRejectedValueOnce(axiosError);
      const { result } = renderHook(() => useUser());
      await act(async () => {
        await expect(result.current.getAllUsers()).rejects.toEqual(axiosError);
      });

      expect(result.current.error).toBe(mockErrorResponse.message);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unexpected error', async () => {
      const mockError = new Error('Network error');
      mockGet.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser());
      await act(async () => {
        await expect(result.current.getAllUsers()).rejects.toThrow(
          'Network error',
        );
      });
      expect(result.current.error).toBe(
        'An unexpected error occured while fetching users.',
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id successfully', async () => {
      mockGet.mockResolvedValueOnce({ data: mockUser });

      const { result } = renderHook(() => useUser());

      let response: User | undefined;

      await act(async () => {
        response = await result.current.getUserById('1');
      });

      expect(response).toEqual(mockUser);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/Users/1');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle user not found error', async () => {
      const mockErrorResponse: ErrorResponse = {
        message: 'User not found',
        statusCode: 404,
      };

      const axiosError = {
        isAxiosError: true,
        response: { data: mockErrorResponse },
      };

      mockGet.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(result.current.getUserById('999')).rejects.toEqual(
          axiosError,
        );
      });

      expect(result.current.error).toBe('User not found');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unexpected error', async () => {
      const mockError = new Error('Network error');

      mockGet.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(result.current.getUserById('1')).rejects.toThrow(
          'Network error',
        );
      });

      expect(result.current.error).toBe('User not found');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    const updateData: UpdateUserData = {
      username: 'updateduser',
      email: 'updated@example.com',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateData };

      mockPut.mockResolvedValueOnce({ data: updatedUser });

      const { result } = renderHook(() => useUser());

      let response: User | undefined;

      await act(async () => {
        response = await result.current.updateUser('1', updateData);
      });

      expect(response).toEqual(updatedUser);
      expect(axiosInstance.put).toHaveBeenCalledWith(
        '/api/Users/1',
        updateData,
      );
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle update error', async () => {
      const mockErrorResponse: ErrorResponse = {
        message: 'Validation error',
        statusCode: 400,
      };

      const axiosError = {
        isAxiosError: true,
        response: { data: mockErrorResponse },
      };

      mockPut.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.updateUser('1', updateData),
        ).rejects.toEqual(axiosError);
      });

      expect(result.current.error).toBe('Validation error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unexpected error', async () => {
      const mockError = new Error('Network error');

      mockPut.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.updateUser('1', updateData),
        ).rejects.toThrow('Network error');
      });

      expect(result.current.error).toBe(
        'An unexpected error occured while updating user.',
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockDelete.mockResolvedValueOnce({});

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await result.current.deleteUser('1');
      });

      expect(axiosInstance.delete).toHaveBeenCalledWith('/api/Users/1');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle delete error', async () => {
      const mockErrorResponse: ErrorResponse = {
        message: 'Cannot delete user',
        statusCode: 403,
      };

      const axiosError = {
        isAxiosError: true,
        response: { data: mockErrorResponse },
      };

      mockDelete.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(result.current.deleteUser('1')).rejects.toEqual(
          axiosError,
        );
      });

      expect(result.current.error).toBe('Cannot delete user');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unexpected error', async () => {
      const mockError = new Error('Network error');

      mockDelete.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(result.current.deleteUser('1')).rejects.toThrow(
          'Network error',
        );
      });

      expect(result.current.error).toBe(
        'An unexpected error occured while deleting user.',
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('changeUserRole', () => {
    it('should change user role successfully', async () => {
      const updatedUser = { ...mockUser, role: 'admin' };

      mockPatch.mockResolvedValueOnce({ data: updatedUser });

      const { result } = renderHook(() => useUser());

      let response: User | undefined;

      await act(async () => {
        response = await result.current.changeUserRole('1', 'admin');
      });

      expect(response).toEqual(updatedUser);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/Users/1/role', {
        role: 'admin',
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle 404 error when user not found', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {} as ErrorResponse,
        },
      };

      mockPatch.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.changeUserRole('999', 'admin'),
        ).rejects.toEqual(axiosError);
      });

      expect(result.current.error).toBe('User with ID 999 not found.');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle 400 error for invalid role', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {} as ErrorResponse,
        },
      };

      mockPatch.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.changeUserRole('1', 'invalidrole'),
        ).rejects.toEqual(axiosError);
      });

      expect(result.current.error).toBe(
        'Invalid role. Please provide a valid role.',
      );
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle 403 error for permission denied', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {} as ErrorResponse,
        },
      };

      mockPatch.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.changeUserRole('1', 'admin'),
        ).rejects.toEqual(axiosError);
      });

      expect(result.current.error).toBe(
        'You do not have permission to change user roles.',
      );
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle generic error with custom message', async () => {
      const mockErrorResponse: ErrorResponse = {
        message: 'Custom error message',
        statusCode: 500,
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: mockErrorResponse,
        },
      };

      mockPatch.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.changeUserRole('1', 'admin'),
        ).rejects.toEqual(axiosError);
      });

      expect(result.current.error).toBe(`User with ID 1 not found.`);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unexpected error', async () => {
      const mockError = new Error('Network error');

      mockPatch.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser());

      await act(async () => {
        await expect(
          result.current.changeUserRole('1', 'admin'),
        ).rejects.toThrow('Network error');
      });

      expect(result.current.error).toBe(
        'An unexpected error occured while changing the role',
      );
      expect(result.current.isLoading).toBe(false);
    });
  });
});
