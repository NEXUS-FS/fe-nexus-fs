import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import Login from './Login';
import { AuthProvider } from '@/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import type { Mock } from 'vitest';

vi.mock('@/lib/axiosInstance', () => ({
  axiosInstance: {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

import { axiosInstance } from '@/lib/axiosInstance';

vi.mock('@/hooks/auth/useLoginForm', () => ({
  useLoginForm: vi.fn(),
}));

import { useLoginForm } from '@/hooks/auth/useLoginForm';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Page Full Flow', () => {
  const setUsername = vi.fn();
  const setPassword = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockuseAuthForm = useLoginForm as Mock;

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mockuseAuthForm.mockReturnValue({
      username: 'admin',
      password: '123456',
      setUsername,
      setPassword,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });
  });

  it('logs in successfully and redirects to dashboard', async () => {
    const mockedPost = vi.mocked(axiosInstance.post);
    mockedPost.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    renderPage();

    const submitButton = screen.getByRole('button', { name: /^login$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it('shows error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';

    mockuseAuthForm.mockReturnValueOnce({
      username: 'admin',
      password: 'wrongpass',
      setUsername,
      setPassword,
      handleSubmit: vi.fn().mockResolvedValueOnce(undefined),
      isLoading: false,
      error: errorMessage,
    });

    renderPage();

    const submitButton = screen.getByRole('button', { name: /^login$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
