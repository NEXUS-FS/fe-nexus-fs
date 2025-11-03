import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function AuthConsumerComponent() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </p>
      <button onClick={() => login('mock-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  const renderWithProvider = () =>
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumerComponent />
        </AuthProvider>
      </MemoryRouter>,
    );
  it('shows Not Authenticated by default', () => {
    renderWithProvider();
    expect(screen.getByTestId('status')).toHaveTextContent('Not Authenticated');
  });
  it('changes to "Authenticated" after login and navigates to /dashboard', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Login'));

    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(screen.getByTestId('status')).toHaveTextContent('Authenticated');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  it('changes to "Not Authenticated" after logout and navigates to /', () => {
    localStorage.setItem('token', 'mock-token');
    renderWithProvider();

    fireEvent.click(screen.getByText('Logout'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('status')).toHaveTextContent('Not Authenticated');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
