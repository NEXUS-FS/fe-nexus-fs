import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProvidersSettings } from './ProvidersSettings';
import * as useProvidersModule from '@/hooks/settings/useProviders';

// Mock the hooks
vi.mock('@/hooks/settings/useProviders', () => ({
  useConnectedProviders: vi.fn(),
  useAvailableProviders: vi.fn(),
  useProviderConfig: vi.fn(),
}));

// Mock the components
vi.mock('@/components/settings/ConfigureProviderModal', () => ({
  ConfigureProviderModal: ({ open }: any) =>
    open ? <div data-testid="configure-modal">Configure Modal</div> : null,
}));

vi.mock('@/components/settings/ProviderCard', () => ({
  ProviderCard: ({ provider, onDisconnect, onTestConnection }: any) => (
    <div data-testid={`provider-card-${provider.id}`}>
      <span>{provider.name}</span>
      <button onClick={() => onDisconnect(provider)}>Disconnect</button>
      <button onClick={() => onTestConnection(provider)}>Test</button>
    </div>
  ),
}));

describe('ProvidersSettings', () => {
  const mockConnectedProviders = [
    {
      id: 'local-1',
      name: 'Local Storage',
      type: 'local' as const,
      status: 'active' as const,
      healthStatus: 'Active' as const,
      storageUsed: 12,
      storageTotal: 50,
      filesCount: 234,
      connectedAt: '2024-01-15T10:30:00Z',
      isConfigured: true,
    },
    {
      id: 'google-1',
      name: 'Google Drive',
      type: 'google-drive' as const,
      status: 'active' as const,
      healthStatus: 'Stable' as const,
      storageUsed: 8,
      storageTotal: 15,
      filesCount: 110,
      connectedAt: '2024-02-20T14:45:00Z',
      isConfigured: true,
    },
  ];

  const mockAvailableProviders = [
    {
      id: 'aws-s3',
      name: 'AWS S3',
      type: 'aws-s3' as const,
      description: 'Connect to Amazon S3 buckets',
    },
    {
      id: 'ftp',
      name: 'FTP Server',
      type: 'ftp' as const,
      description: 'Connect to FTP server',
    },
  ];

  const mockConnectProvider = vi
    .fn()
    .mockResolvedValue({ success: true, message: 'Connected' });
  const mockDisconnectProvider = vi.fn();
  const mockTestConnection = vi
    .fn()
    .mockResolvedValue({ success: true, message: 'Success' });

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
    global.alert = vi.fn();

    (
      useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      providers: mockConnectedProviders,
      isLoading: false,
      error: null,
      connectProvider: mockConnectProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
    });

    (
      useProvidersModule.useAvailableProviders as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      providers: mockAvailableProviders,
      isLoading: false,
    });

    (
      useProvidersModule.useProviderConfig as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);
  });

  it('should render connected providers section', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('Connected Providers')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your connected storage providers'),
    ).toBeInTheDocument();
  });

  it('should display connected providers', () => {
    render(<ProvidersSettings />);

    expect(screen.getByTestId('provider-card-local-1')).toBeInTheDocument();
    expect(screen.getByTestId('provider-card-google-1')).toBeInTheDocument();
    expect(screen.getByText('Local Storage')).toBeInTheDocument();
    expect(screen.getByText('Google Drive')).toBeInTheDocument();
  });

  it('should display available providers section', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('Available Providers')).toBeInTheDocument();
    expect(
      screen.getByText('Connect to a new storage provider'),
    ).toBeInTheDocument();
  });

  it('should display available providers with connect buttons', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('AWS S3')).toBeInTheDocument();
    expect(screen.getByText('FTP Server')).toBeInTheDocument();
    expect(
      screen.getByText('Connect to Amazon S3 buckets'),
    ).toBeInTheDocument();

    const connectButtons = screen.getAllByText('Connect');
    expect(connectButtons.length).toBeGreaterThan(0);
  });

  it('should show empty state when no providers are connected', () => {
    (
      useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      providers: [],
      isLoading: false,
      error: null,
      connectProvider: mockConnectProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
    });

    render(<ProvidersSettings />);

    expect(screen.getByText('No providers connected yet')).toBeInTheDocument();
    expect(
      screen.getByText('Connect a provider below to get started'),
    ).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (
      useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      providers: [],
      isLoading: true,
      error: null,
      connectProvider: mockConnectProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
    });

    render(<ProvidersSettings />);

    // Skeleton loaders should be present
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should handle disconnect provider', async () => {
    render(<ProvidersSettings />);

    const disconnectButtons = screen.getAllByText('Disconnect');
    fireEvent.click(disconnectButtons[0]);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(mockDisconnectProvider).toHaveBeenCalledWith('local-1');
    });
  });

  it('should handle test connection', async () => {
    render(<ProvidersSettings />);

    const testButtons = screen.getAllByText('Test');
    fireEvent.click(testButtons[0]);

    await waitFor(() => {
      expect(mockTestConnection).toHaveBeenCalledWith('local-1');
      expect(global.alert).toHaveBeenCalledWith('Success');
    });
  });

  it('should display error message when present', () => {
    (
      useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      providers: mockConnectedProviders,
      isLoading: false,
      error: 'Failed to load providers',
      connectProvider: mockConnectProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
    });

    render(<ProvidersSettings />);

    expect(screen.getByText('Failed to load providers')).toBeInTheDocument();
  });

  it('should show empty state when all providers are connected', () => {
    (
      useProvidersModule.useAvailableProviders as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      providers: [],
      isLoading: false,
    });

    render(<ProvidersSettings />);

    expect(
      screen.getByText('All available providers are already connected'),
    ).toBeInTheDocument();
  });
});
