import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProvidersSettings } from './ProvidersSettings';
import * as useProvidersModule from '@/hooks/settings/useProviders';

// Mock the hooks
vi.mock('@/hooks/settings/useProviders', () => ({
  useConnectedProviders: vi.fn(),
  useAvailableProviders: vi.fn(),
  useAccessRequests: vi.fn(),
  useProviderConfig: vi.fn(),
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
  ];

  const mockConfigureProvider = vi.fn();
  const mockDisconnectProvider = vi.fn();
  const mockTestConnection = vi.fn().mockResolvedValue({ success: true, message: 'Success' });
  const mockAddProvider = vi.fn();
  const mockSetAvailableProviders = vi.fn();
  const mockSubmitRequest = vi.fn();
  const mockSetRequests = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>).mockReturnValue({
      providers: mockConnectedProviders,
      isLoading: false,
      configureProvider: mockConfigureProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
      addProvider: mockAddProvider,
    });

    (useProvidersModule.useAvailableProviders as ReturnType<typeof vi.fn>).mockReturnValue({
      providers: mockAvailableProviders,
      setProviders: mockSetAvailableProviders,
      isLoading: false,
    });

    (useProvidersModule.useAccessRequests as ReturnType<typeof vi.fn>).mockReturnValue({
      requests: [],
      setRequests: mockSetRequests,
      isLoading: false,
      submitRequest: mockSubmitRequest,
    });

    (useProvidersModule.useProviderConfig as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  it('renders Connected Providers section', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('Connected Providers')).toBeInTheDocument();
    expect(screen.getByText('Manage your connected storage providers')).toBeInTheDocument();
  });

  it('renders Request Access section', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('Request Access')).toBeInTheDocument();
    expect(screen.getByText('Request access to additional storage providers')).toBeInTheDocument();
  });

  it('renders My Access Requests section', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('My Access Requests')).toBeInTheDocument();
    expect(screen.getByText('Track your access request status')).toBeInTheDocument();
  });

  it('displays connected providers', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('Local Storage')).toBeInTheDocument();
    expect(screen.getByText('Google Drive')).toBeInTheDocument();
  });

  it('displays available providers for request', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('AWS S3')).toBeInTheDocument();
  });

  it('shows empty state when no providers are connected', () => {
    (useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>).mockReturnValue({
      providers: [],
      isLoading: false,
      configureProvider: mockConfigureProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
      addProvider: mockAddProvider,
    });

    render(<ProvidersSettings />);

    expect(screen.getByText('No providers configured yet')).toBeInTheDocument();
  });

  it('shows empty state when no access requests exist', () => {
    render(<ProvidersSettings />);

    expect(screen.getByText('No requests were made yet.')).toBeInTheDocument();
  });

  it('shows loading skeletons when data is loading', () => {
    (useProvidersModule.useConnectedProviders as ReturnType<typeof vi.fn>).mockReturnValue({
      providers: [],
      isLoading: true,
      configureProvider: mockConfigureProvider,
      disconnectProvider: mockDisconnectProvider,
      testConnection: mockTestConnection,
      addProvider: mockAddProvider,
    });

    render(<ProvidersSettings />);

    // Check for skeleton elements
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('opens request modal when Request button is clicked', async () => {
    render(<ProvidersSettings />);

    const requestButton = screen.getByRole('button', { name: /Request/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(screen.getByText('Request Provider Access')).toBeInTheDocument();
    });
  });

  it('displays access requests with correct status badges', () => {
    (useProvidersModule.useAccessRequests as ReturnType<typeof vi.fn>).mockReturnValue({
      requests: [
        {
          id: 'req-1',
          providerName: 'AWS S3',
          providerType: 'aws-s3' as const,
          reason: 'Need for project',
          status: 'pending' as const,
          requestedAt: '2024-03-01T10:00:00Z',
        },
      ],
      setRequests: mockSetRequests,
      isLoading: false,
      submitRequest: mockSubmitRequest,
    });

    render(<ProvidersSettings />);

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows message when all providers are requested', () => {
    (useProvidersModule.useAvailableProviders as ReturnType<typeof vi.fn>).mockReturnValue({
      providers: [],
      setProviders: mockSetAvailableProviders,
      isLoading: false,
    });

    render(<ProvidersSettings />);

    expect(screen.getByText('You have requested access to all available providers')).toBeInTheDocument();
  });
});

