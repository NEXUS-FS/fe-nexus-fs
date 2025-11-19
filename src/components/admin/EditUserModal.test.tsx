import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditUserModal } from './EditUserModal'
import { UserRole, UserStatus, AuthProvider } from '@/types'
import type { User } from '@/types'

describe('EditUserModal', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    provider: AuthProvider.LOCAL,
    createdAt: '2024-01-01T00:00:00Z',
  }

  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with user data', () => {
    render(
      <EditUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        user={mockUser}
      />
    )

    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    render(
      <EditUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        user={mockUser}
      />
    )

    const usernameInput = screen.getByLabelText(/username/i)
    fireEvent.change(usernameInput, { target: { value: '' } })

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should validate email format', async () => {
    render(
      <EditUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        user={mockUser}
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should call onSave with valid data', async () => {
    mockOnSave.mockResolvedValue(undefined)

    render(
      <EditUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        user={mockUser}
      />
    )

    const usernameInput = screen.getByLabelText(/username/i)
    fireEvent.change(usernameInput, { target: { value: 'newusername' } })

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        username: 'newusername',
        email: 'test@example.com',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      })
    })
  })

  it('should disable form when loading', () => {
    render(
      <EditUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        user={mockUser}
        isLoading={true}
      />
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const saveButton = screen.getByRole('button', { name: /saving/i })

    expect(usernameInput).toBeDisabled()
    expect(saveButton).toBeDisabled()
  })
})
