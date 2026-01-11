import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProviderCard } from './ProviderCard';
import type { ConnectedProvider } from '@/types';

describe('ProviderCard', () => {
  const mockOnConfigure = vi.fn();
  const mockOnTestConnection = vi.fn();
  const mockOnDisconnect = vi.fn();

  const configuredProvider: ConnectedProvider = {
    id: 'local-1',
    name: 'Local Storage',
    type: 'local',
    status: 'active',
    healthStatus: 'Active',
    storageUsed: 12,
    storageTotal: 50,
    filesCount: 234,
    connectedAt: '2024-01-15T10:30:00Z',
    isConfigured: true,
  };

  const unconfiguredProvider: ConnectedProvider = {
    id: 'aws-1',
    name: 'AWS S3 Production',
    type: 'aws-s3',
    status: 'inactive',
    healthStatus: 'Inactive',
    storageUsed: 0,
    storageTotal: 100,
    filesCount: 0,
    connectedAt: '2024-03-01T10:00:00Z',
    isConfigured: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders provider name and file count', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.getByText('Local Storage')).toBeInTheDocument();
    expect(screen.getByText('234 files')).toBeInTheDocument();
  });

  it('renders health status badge for configured provider', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Inactive badge for unconfigured provider', () => {
    render(
      <ProviderCard
        provider={unconfiguredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('shows storage progress bar for configured provider', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('12 / 50 GB')).toBeInTheDocument();
  });

  it('hides storage progress bar for unconfigured provider', () => {
    render(
      <ProviderCard
        provider={unconfiguredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.queryByText('Storage')).not.toBeInTheDocument();
  });

  it('renders all action buttons', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.getByText('Configure')).toBeInTheDocument();
    expect(screen.getByText('Test Connection')).toBeInTheDocument();
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('calls onConfigure when Configure button is clicked', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    fireEvent.click(screen.getByText('Configure'));
    expect(mockOnConfigure).toHaveBeenCalledWith(configuredProvider);
  });

  it('calls onTestConnection when Test Connection button is clicked', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    fireEvent.click(screen.getByText('Test Connection'));
    expect(mockOnTestConnection).toHaveBeenCalledWith(configuredProvider);
  });

  it('calls onDisconnect when Disconnect button is clicked', () => {
    render(
      <ProviderCard
        provider={configuredProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    fireEvent.click(screen.getByText('Disconnect'));
    expect(mockOnDisconnect).toHaveBeenCalledWith(configuredProvider);
  });

  it('renders correct icon for Google Drive provider', () => {
    const googleProvider: ConnectedProvider = {
      ...configuredProvider,
      id: 'google-1',
      name: 'Google Drive',
      type: 'google-drive',
      healthStatus: 'Stable',
    };

    render(
      <ProviderCard
        provider={googleProvider}
        onConfigure={mockOnConfigure}
        onTestConnection={mockOnTestConnection}
        onDisconnect={mockOnDisconnect}
      />
    );

    expect(screen.getByText('Google Drive')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });
});


