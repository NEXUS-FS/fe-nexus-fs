import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { LoginForm } from './LoginForm';
import * as useLoginFormModule from '@/hooks/auth/useLoginForm';

vi.mock('@/hooks/auth/useLoginForm', () => ({
  useLoginForm: vi.fn(),
}));

vi.mock('@/components/ui/button', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/components/ui/button')>();
  return {
    ...actual,
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  };
});

vi.mock('@/components/auth/UsernameField', () => ({
  UsernameField: vi.fn(({ value, onChange }: any) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  )),
}));

vi.mock('@/components/auth/PasswordField', () => ({
  PasswordField: vi.fn(({ value, onChange }: any) => (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )),
}));

vi.mock('@/components/auth/SocialLoginButton', () => ({
  SocialLoginButton: vi.fn(() => (
    <div data-testid="social-login">SocialLoginButton</div>
  )),
}));

vi.mock('@/components/auth/FormHeader', () => ({
  default: vi.fn(() => <div data-testid="form-header">FormHeader</div>),
}));

vi.mock('@/components/auth/SignUpPrompt', () => ({
  SignUpPrompt: vi.fn(() => (
    <div data-testid="signup-prompt">SignUpPrompt</div>
  )),
}));

describe('LoginForm', () => {
  const mockHandleSubmit = vi.fn();
  const setUsername = vi.fn();
  const setPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoginFormModule.useLoginForm as Mock).mockReturnValue({
      username: 'testuser',
      setUsername,
      password: 'password',
      setPassword,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });
  });

  it('renders all child components correctly', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('form-header')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByTestId('social-login')).toBeInTheDocument();
    expect(screen.getByTestId('signup-prompt')).toBeInTheDocument();
  });

  it('calls handleSubmit on form submit', () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    const form = submitButton.closest('form');
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('shows error message if error exists', () => {
    (useLoginFormModule.useLoginForm as Mock).mockReturnValueOnce({
      username: '',
      setUsername,
      password: '',
      setPassword,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: 'Invalid credentials',
    });

    render(<LoginForm />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
