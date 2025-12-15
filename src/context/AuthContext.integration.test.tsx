import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './AuthContext';
import { vi } from 'vitest';

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

function AuthConsumerComponent() {
  const { isAuthenticated, user, login, logout } = useAuthContext();
  return (
    <div>
      <p data-testid="status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </p>
      <p data-testid="username">{user?.username || 'No user'}</p>
      <button onClick={() => login('mock-token', mockUserData)}>Login</button>
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
    expect(screen.getByTestId('username')).toHaveTextContent('No user');
  });
  it('changes to "Authenticated" after login and navigates to /dashboard', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Login'));

    expect(localStorage.getItem('accessToken')).toBe('mock-token');
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUserData);
    expect(screen.getByTestId('status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('username')).toHaveTextContent('admin');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  it('changes to "Not Authenticated" after logout and navigates to /', () => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUserData));
    renderWithProvider();

    fireEvent.click(screen.getByText('Logout'));

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByTestId('status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('username')).toHaveTextContent('No user');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
