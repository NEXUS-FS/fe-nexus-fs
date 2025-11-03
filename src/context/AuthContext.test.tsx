import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { vi, beforeEach, describe, it } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('throws error if useAuth is used outside of AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider',
    );
  });

  it('initializes as authenticated when token exists in localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores token, updates state, and navigate to /dashboard', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
        result.current.login('mock-token')
    })

    expect(localStorage.getItem('token')).toBe('mock-token')
    expect(result.current.isAuthenticated).toBe(true)
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  });

  it('logout removes token, updates state, and navigates to /', () => {
    localStorage.setItem('token', 'mock-token')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('token')).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
});
