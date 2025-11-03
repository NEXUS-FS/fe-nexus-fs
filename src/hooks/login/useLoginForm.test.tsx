import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from './useLoginForm'
import { useLogin } from './useLogin'
import type { LoginResponse } from '@/types'
import * as AuthContext from '@/context/AuthContext' 

vi.mock('./useLogin', () => ({
  useLogin: vi.fn(),
}))

describe('useLoginForm hook', () => {
  const mockLogin = vi.fn()
  const mockContextLogin = vi.fn()
  const mockResponse: LoginResponse = { token: 'mock-token' }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useLogin hook
    ;(useLogin as unknown as Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    })

    // Mock useAuth context
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      login: mockContextLogin,
      logout: vi.fn(),
    } as any)
  })

  it('should initialize with empty username and password', () => {
    const { result } = renderHook(() => useLoginForm())
    expect(result.current.username).toBe('')
    expect(result.current.password).toBe('')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should update username and password correctly', () => {
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.setUsername('admin')
      result.current.setPassword('admin123')
    })
    expect(result.current.username).toBe('admin')
    expect(result.current.password).toBe('admin123')
  })

  it('should call login and contextLogin on submit', async () => {
    mockLogin.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.setUsername('admin')
      result.current.setPassword('admin123')
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

    await act(async () => {
      const res = await result.current.handleSubmit(fakeEvent)
      expect(res).toEqual(mockResponse)
    })

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin123',
    })
    expect(mockContextLogin).toHaveBeenCalledWith('mock-token')
    expect(fakeEvent.preventDefault).toHaveBeenCalled()
  })

  it('should handle login failure correctly', async () => {
    const mockError = new Error('Login failed')
    mockLogin.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.setUsername('admin')
      result.current.setPassword('WrongPassword')
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

    await act(async () => {
      await expect(result.current.handleSubmit(fakeEvent)).rejects.toThrow(
        'Login failed'
      )
    })

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'admin',
      password: 'WrongPassword',
    })
    expect(mockContextLogin).not.toHaveBeenCalled()
    expect(fakeEvent.preventDefault).toHaveBeenCalled()
  })

  it('should reset username and password', () => {
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.setUsername('admin')
      result.current.setPassword('admin123')
    })

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.username).toBe('')
    expect(result.current.password).toBe('')
  })
})
