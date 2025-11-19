import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminUsers from './AdminUsers'
import { useUsers } from '@/hooks/admin/useUsers'
import { UserRole, UserStatus, AuthProvider } from '@/types'

vi.mock('@/hooks/admin/useUsers')
vi.mock('@/hooks/admin/useUserActions', () => ({
  useUserActions: () => ({
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    changeUserRole: vi.fn(),
    toggleUserStatus: vi.fn(),
    isLoading: false,
    error: null,
  }),
}))

describe('AdminUsers', () => {
  const mockUsers = [
    {
      id: '1',
      username: 'testuser1',
      email: 'test1@example.com',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      provider: AuthProvider.LOCAL,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      username: 'testuser2',
      email: 'test2@example.com',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      provider: AuthProvider.GOOGLE,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ]

  const mockPagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 2,
    itemsPerPage: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state', () => {
    vi.mocked(useUsers).mockReturnValue({
      users: [],
      pagination: mockPagination,
      filters: {},
      isLoading: true,
      error: null,
      updateFilters: vi.fn(),
      goToPage: vi.fn(),
      setSearchQuery: vi.fn(),
      refetch: vi.fn(),
    })

    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    )

    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })

  it('should render users table with data', () => {
    vi.mocked(useUsers).mockReturnValue({
      users: mockUsers,
      pagination: mockPagination,
      filters: {},
      isLoading: false,
      error: null,
      updateFilters: vi.fn(),
      goToPage: vi.fn(),
      setSearchQuery: vi.fn(),
      refetch: vi.fn(),
    })

    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    )

    expect(screen.getByText('testuser1')).toBeInTheDocument()
    expect(screen.getByText('testuser2')).toBeInTheDocument()
    expect(screen.getByText('test1@example.com')).toBeInTheDocument()
    expect(screen.getByText('test2@example.com')).toBeInTheDocument()
  })

  it('should render empty state when no users', () => {
    vi.mocked(useUsers).mockReturnValue({
      users: [],
      pagination: mockPagination,
      filters: {},
      isLoading: false,
      error: null,
      updateFilters: vi.fn(),
      goToPage: vi.fn(),
      setSearchQuery: vi.fn(),
      refetch: vi.fn(),
    })

    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    )

    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  it('should render error message', () => {
    vi.mocked(useUsers).mockReturnValue({
      users: [],
      pagination: mockPagination,
      filters: {},
      isLoading: false,
      error: 'Failed to fetch users',
      updateFilters: vi.fn(),
      goToPage: vi.fn(),
      setSearchQuery: vi.fn(),
      refetch: vi.fn(),
    })

    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    )

    expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument()
  })

  it('should render pagination when users exist', () => {
    vi.mocked(useUsers).mockReturnValue({
      users: mockUsers,
      pagination: { ...mockPagination, totalPages: 3 },
      filters: {},
      isLoading: false,
      error: null,
      updateFilters: vi.fn(),
      goToPage: vi.fn(),
      setSearchQuery: vi.fn(),
      refetch: vi.fn(),
    })

    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    )

    expect(screen.getByText(/showing 2 of 2 users/i)).toBeInTheDocument()
  })
})
