import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DeleteUserDialog } from './DeleteUserDialog'

describe('DeleteUserDialog', () => {
  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()

  it('should render with user name', () => {
    render(
      <DeleteUserDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        userName="testuser"
      />
    )

    expect(screen.getByText(/testuser/i)).toBeInTheDocument()
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('should call onConfirm when delete button is clicked', async () => {
    render(
      <DeleteUserDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        userName="testuser"
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete user/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })
  })

  it('should call onClose when cancel button is clicked', async () => {
    render(
      <DeleteUserDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        userName="testuser"
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  it('should disable buttons when loading', () => {
    render(
      <DeleteUserDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        userName="testuser"
        isLoading={true}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /deleting/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    expect(deleteButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })
})
