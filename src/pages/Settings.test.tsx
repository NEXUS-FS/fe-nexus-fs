import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Settings from './Settings';

// Mock the AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuthContext: () => ({
    user: { username: 'testuser', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}));

// Mock the AppHeader
vi.mock('@/components/layout/AppHeader', () => ({
  AppHeader: () => <header data-testid="app-header">App Header</header>,
}));

// Mock the SettingsSidebar
vi.mock('@/components/layout/SettingsSidebar', () => ({
  SettingsSidebar: () => <nav data-testid="settings-sidebar">Settings Sidebar</nav>,
}));

// Mock the ProvidersSettings
vi.mock('@/features/settings/ProvidersSettings', () => ({
  ProvidersSettings: () => <div data-testid="providers-settings">Providers Settings</div>,
}));

const renderWithRouter = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/:tab" element={<Settings />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title and description', () => {
    renderWithRouter('/settings/providers');

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account and application preferences')).toBeInTheDocument();
  });

  it('renders AppHeader', () => {
    renderWithRouter('/settings/providers');

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
  });

  it('renders SettingsSidebar', () => {
    renderWithRouter('/settings/providers');

    expect(screen.getByTestId('settings-sidebar')).toBeInTheDocument();
  });

  it('renders ProvidersSettings for /settings/providers route', () => {
    renderWithRouter('/settings/providers');

    expect(screen.getByTestId('providers-settings')).toBeInTheDocument();
  });

  it('shows coming soon message for profile tab', () => {
    renderWithRouter('/settings/profile');

    expect(screen.getByText('Profile settings coming soon...')).toBeInTheDocument();
  });

  it('shows coming soon message for general tab', () => {
    renderWithRouter('/settings/general');

    expect(screen.getByText('General settings coming soon...')).toBeInTheDocument();
  });

  it('shows coming soon message for security tab', () => {
    renderWithRouter('/settings/security');

    expect(screen.getByText('Security settings coming soon...')).toBeInTheDocument();
  });

  it('shows coming soon message for notifications tab', () => {
    renderWithRouter('/settings/notifications');

    expect(screen.getByText('Notification settings coming soon...')).toBeInTheDocument();
  });

  it('shows coming soon message for api tab', () => {
    renderWithRouter('/settings/api');

    expect(screen.getByText('API settings coming soon...')).toBeInTheDocument();
  });

  it('shows coming soon message for support tab', () => {
    renderWithRouter('/settings/support');

    expect(screen.getByText('Support options coming soon...')).toBeInTheDocument();
  });

  it('redirects to /settings/providers for base /settings route', () => {
    renderWithRouter('/settings');

    // The Navigate component redirects to /settings/providers, which renders ProvidersSettings
    // After redirect, the providers-settings should be visible
    expect(screen.getByTestId('providers-settings')).toBeInTheDocument();
  });

  it('has correct background color class', () => {
    const { container } = renderWithRouter('/settings/providers');

    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('bg-[#FDFDFD]');
  });
});

