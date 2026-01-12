import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import Login from './Login';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import type { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: vi.fn(() => <div data-testid="login-form">LoginForm</div>),
}));

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>();

  const MockAuthProvider = ({ children }: PropsWithChildren) => <>{children}</>;
  MockAuthProvider.displayName = 'MockAuthProvider';

  return {
    ...actual,
    useAuthContext: vi.fn(),
    AuthProvider: MockAuthProvider,
  };
});

const createWrapper = () => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
  Wrapper.displayName = 'AuthWrapper';
  return Wrapper;
};

describe('Login Page', () => {
  beforeEach(() => {
    (useAuthContext as Mock).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    vi.clearAllMocks();
  });

  it('renders LoginForm component', () => {
    render(<Login />, { wrapper: createWrapper() });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
