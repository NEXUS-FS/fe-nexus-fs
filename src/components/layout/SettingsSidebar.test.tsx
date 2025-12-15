import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar';

// Wrapper component to provide router context
const renderWithRouter = (initialRoute = '/settings/providers') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <SettingsSidebar />
    </MemoryRouter>
  );
};

describe('SettingsSidebar', () => {
  it('renders all navigation items', () => {
    renderWithRouter();

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Providers')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    renderWithRouter();

    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/settings/profile');
    expect(screen.getByText('General').closest('a')).toHaveAttribute('href', '/settings/general');
    expect(screen.getByText('Providers').closest('a')).toHaveAttribute('href', '/settings/providers');
    expect(screen.getByText('Security').closest('a')).toHaveAttribute('href', '/settings/security');
    expect(screen.getByText('Notifications').closest('a')).toHaveAttribute('href', '/settings/notifications');
    expect(screen.getByText('API').closest('a')).toHaveAttribute('href', '/settings/api');
    expect(screen.getByText('Support').closest('a')).toHaveAttribute('href', '/settings/support');
  });

  it('highlights the active tab based on current route', () => {
    renderWithRouter('/settings/providers');

    const providersLink = screen.getByText('Providers').closest('a');
    expect(providersLink).toHaveClass('bg-accent');
  });

  it('renders icons for each navigation item', () => {
    renderWithRouter();

    // Each nav item should have an icon (svg element)
    const navItems = screen.getAllByRole('link');
    expect(navItems).toHaveLength(7);
    
    navItems.forEach((item) => {
      const icon = item.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});

