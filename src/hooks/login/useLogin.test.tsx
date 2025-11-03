import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { useLogin } from "./useLogin";
import { renderHook, act } from "@testing-library/react";
import type { ErrorResponse } from "@/types";
import { axiosInstance } from "@/lib/axiosInstance";

vi.mock('@/lib/axiosInstance', () => ({
    axiosInstance: {
        post: vi.fn()
    }
}))

describe('useLogin hook', () => {
    const mockPost = vi.fn()
    const mockToken = 'test-token'

    beforeEach(() => {
        vi.clearAllMocks()
        ;(axiosInstance.post as Mock) = mockPost 
        localStorage.clear()
    })

    it('should perform a successfull login', async () => {
        const mockResponse = { data: { token: mockToken } }
        mockPost.mockResolvedValueOnce(mockResponse)

        const { result } = renderHook(() => useLogin())

        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()

        await act(async () => {
            const data = await result.current.login({
                username: 'testuser',
                password: 'password'
            })
            expect(data).toEqual(mockResponse.data)
        })

        expect(localStorage.getItem('token')).toBe(mockToken)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('should handle Axios error with ErrorResponse message', async () => {
        const mockErrorResponse: ErrorResponse = {
            message: 'Invalid username or password',
            statusCode: 401
        }

        const mockAxiosError = {
            isAxiosError: true, 
            response: { data: mockErrorResponse }
        }

        mockPost.mockRejectedValueOnce(mockAxiosError)
        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await expect(
                result.current.login({ username: 'wrong', password: 'wrong' })
            ).rejects.toEqual(mockAxiosError)
        })

        expect(result.current.error).toBe(mockErrorResponse.message)
        expect(result.current.isLoading).toBe(false)
    })
    it('should handle unexpected error', async () => {
        const mockError = new Error('Network crash')
        mockPost.mockRejectedValueOnce(mockError)

        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await expect(
                result.current.login({ username: 'x', password: 'y' })
            ).rejects.toThrow('Network crash')
        })

        expect(result.current.error).toBe('An unexpected error occured')
        expect(result.current.isLoading).toBe(false)
    })
})

