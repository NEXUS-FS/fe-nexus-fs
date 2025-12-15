import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './AuthContext';
import { vi, beforeEach, describe, it, expect } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUserData = {
  id: "17dc09a2-52b4-421e-a8ee-f9f1301c4815",
  username: "admin",
  email: "admin@nexus.com",
  role: "admin",
  provider: "",
  isActive: true,
  createdAt: "0001-01-01T00:00:00",
  updatedAt: undefined,
  lastLogin: undefined
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('throws error if useAuth is used outside of AuthProvider', () => {
    expect(() => renderHook(() => useAuthContext())).toThrow(
      'useAuth must be used within AuthProvider',
    );
  });

  it('initializes as authenticated when token exists in localStorage', () => {
    localStorage.setItem('accessToken', 'fake-token');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores token and user, updates state, and navigate to /dashboard', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper })
    act(() => {
        result.current.login('mock-token', mockUserData)
    })

    expect(localStorage.getItem('accessToken')).toBe('mock-token')
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUserData)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUserData)
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  });

  it('logout removes token and user, updates state, and navigates to /', () => {
    localStorage.setItem('accessToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUserData))

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    )

    const { result } = renderHook(() => useAuthContext(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
});
