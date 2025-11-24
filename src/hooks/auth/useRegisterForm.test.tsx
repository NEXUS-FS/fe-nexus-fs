import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegisterForm } from './useRegisterForm';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('useRegisterForm hook', () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as unknown as Mock).mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
    });

    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
  });

  it('initializes with empty form fields', () => {
    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.username).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('updates form fields correctly', () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.setUsername('JohnDoe');
      result.current.setEmail('john@example.com');
      result.current.setPassword('secret123');
    });

    expect(result.current.username).toBe('JohnDoe');
    expect(result.current.email).toBe('john@example.com');
    expect(result.current.password).toBe('secret123');
  });

  it('calls register with correct payload & navigates after success', async () => {
    mockRegister.mockResolvedValueOnce({});

    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.setUsername('JohnDoe');
      result.current.setEmail('john@example.com');
      result.current.setPassword('secret123');
    });

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalled();

    expect(mockRegister).toHaveBeenCalledWith({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: 'secret123',
      provider: 'Basic',
      providerId: null,
      role: 'user',
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('logs error when registration fails but does not navigate', async () => {
    const mockError = new Error('Registration failed');
    mockRegister.mockRejectedValueOnce(mockError);

    console.error = vi.fn();

    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.setUsername('JohnDoe');
      result.current.setEmail('john@example.com');
      result.current.setPassword('wrongpass');
    });

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(mockRegister).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('resets form values when resetForm is called', () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.setUsername('User123');
      result.current.setEmail('user@mail.com');
      result.current.setPassword('pass123');
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.username).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
  });
});
