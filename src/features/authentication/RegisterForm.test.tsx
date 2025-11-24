import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { RegisterForm } from './RegisterForm';
import * as useRegisterFormModule from '@/hooks/auth/useRegisterForm';

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

vi.mock('../../components/auth/UsernameField', () => ({
  UsernameField: vi.fn(({ value, onChange, disabled }: any) => (
    <input
      data-testid="username-field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )),
}));

vi.mock('../../components/auth/PasswordField', () => ({
  PasswordField: vi.fn(({ value, onChange, disabled }: any) => (
    <input
      data-testid="password-field"
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )),
}));

vi.mock('../../components/auth/SocialLoginButton', () => ({
  SocialLoginButton: vi.fn(() => (
    <div data-testid="social-login">SocialLoginButton</div>
  )),
}));

vi.mock('../../components/auth/LoginPrompt', () => ({
  LoginPrompt: vi.fn(() => (
    <div data-testid="login-prompt">LoginPrompt</div>
  )),
}));

vi.mock('@/hooks/auth/useRegisterForm', () => ({
  useRegisterForm: vi.fn(),
}));

describe('RegisterForm', () => {
  const mockHandleSubmit = vi.fn();
  const setUsername = vi.fn();
  const setEmail = vi.fn();
  const setPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRegisterFormModule.useRegisterForm as Mock).mockReturnValue({
      username: 'testuser',
      setUsername,
      email: 'test@example.com',
      setEmail,
      password: 'password123',
      setPassword,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });
  });

  it('renders all required fields & components', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByTestId('social-login')).toBeInTheDocument();
    expect(screen.getByTestId('login-prompt')).toBeInTheDocument();
  });

  it('submits form when Sign Up button clicked', () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('updates email when typing', () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'new@mail.com' } });

    expect(setEmail).toHaveBeenCalledWith('new@mail.com');
  });

  it('displays error if error exists', () => {
    (useRegisterFormModule.useRegisterForm as Mock).mockReturnValueOnce({
      username: '',
      setUsername,
      email: '',
      setEmail,
      password: '',
      setPassword,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: 'Email already exists',
    });

    render(<RegisterForm />);
    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  it('disables input fields & button while loading', () => {
    (useRegisterFormModule.useRegisterForm as Mock).mockReturnValueOnce({
      username: 'u',
      setUsername,
      email: 'e',
      setEmail,
      password: 'p',
      setPassword,
      handleSubmit: mockHandleSubmit,
      isLoading: true,
      error: null,
    });

    render(<RegisterForm />);

    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    expect(screen.getByDisplayValue('u')).toBeDisabled();
    expect(screen.getByDisplayValue('e')).toBeDisabled();
    expect(screen.getByDisplayValue('p')).toBeDisabled();
  });
});
