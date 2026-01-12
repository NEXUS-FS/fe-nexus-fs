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
  SettingsSidebar: () => (
    <nav data-testid="settings-sidebar">Settings Sidebar</nav>
  ),
}));

// Mock all settings components
vi.mock('@/features/settings/ProvidersSettings', () => ({
  ProvidersSettings: () => (
    <div data-testid="providers-settings">Providers Settings</div>
  ),
}));

vi.mock('@/features/settings/ProfileSettings', () => ({
  ProfileSettings: () => (
    <div data-testid="profile-settings">Profile Settings</div>
  ),
}));

vi.mock('@/features/settings/GeneralSettings', () => ({
  GeneralSettings: () => (
    <div data-testid="general-settings">General Settings</div>
  ),
}));

vi.mock('@/features/settings/SecuritySettings', () => ({
  SecuritySettings: () => (
    <div data-testid="security-settings">Security Settings</div>
  ),
}));

vi.mock('@/features/settings/NotificationsSettings', () => ({
  NotificationsSettings: () => (
    <div data-testid="notifications-settings">Notifications Settings</div>
  ),
}));

vi.mock('@/features/settings/ApiSettings', () => ({
  ApiSettings: () => <div data-testid="api-settings">API Settings</div>,
}));

vi.mock('@/features/settings/SupportSettings', () => ({
  SupportSettings: () => (
    <div data-testid="support-settings">Support Settings</div>
  ),
}));

const renderWithRouter = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/:tab" element={<Settings />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title and description', () => {
    renderWithRouter('/settings/providers');

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your account and application preferences'),
    ).toBeInTheDocument();
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

  it('renders ProfileSettings for /settings/profile route', () => {
    renderWithRouter('/settings/profile');

    expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
  });

  it('renders GeneralSettings for /settings/general route', () => {
    renderWithRouter('/settings/general');

    expect(screen.getByTestId('general-settings')).toBeInTheDocument();
  });

  it('renders SecuritySettings for /settings/security route', () => {
    renderWithRouter('/settings/security');

    expect(screen.getByTestId('security-settings')).toBeInTheDocument();
  });

  it('renders NotificationsSettings for /settings/notifications route', () => {
    renderWithRouter('/settings/notifications');

    expect(screen.getByTestId('notifications-settings')).toBeInTheDocument();
  });

  it('renders ApiSettings for /settings/api route', () => {
    renderWithRouter('/settings/api');

    expect(screen.getByTestId('api-settings')).toBeInTheDocument();
  });

  it('renders SupportSettings for /settings/support route', () => {
    renderWithRouter('/settings/support');

    expect(screen.getByTestId('support-settings')).toBeInTheDocument();
  });

  it('redirects to /settings/providers for base /settings route', () => {
    renderWithRouter('/settings');

    // The Navigate component redirects to /settings/providers, which renders ProvidersSettings
    expect(screen.getByTestId('providers-settings')).toBeInTheDocument();
  });

  it('redirects to /settings/providers for invalid tab', () => {
    renderWithRouter('/settings/invalid-tab');

    // Invalid tabs should redirect to providers
    expect(screen.getByTestId('providers-settings')).toBeInTheDocument();
  });

  it('has correct background color class', () => {
    const { container } = renderWithRouter('/settings/providers');

    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('bg-[#FDFDFD]');
  });
});
