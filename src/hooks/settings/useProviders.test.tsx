import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  useConnectedProviders,
  useAvailableProviders,
  useAccessRequests,
  useProviderConfig,
} from './useProviders';

describe('useConnectedProviders hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useConnectedProviders());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.providers).toEqual([]);
  });

  it('should fetch and return connected providers', async () => {
    const { result } = renderHook(() => useConnectedProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.providers).toHaveLength(2);
    expect(result.current.providers[0]).toMatchObject({
      name: 'Local Storage',
      type: 'local',
      status: 'active',
      healthStatus: 'Active',
      isConfigured: true,
    });
    expect(result.current.providers[1]).toMatchObject({
      name: 'Google Drive',
      type: 'google-drive',
      status: 'active',
      healthStatus: 'Stable',
      isConfigured: true,
    });
  });

  it('should add a new provider', async () => {
    const { result } = renderHook(() => useConnectedProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newProvider = {
      id: 'aws-test',
      name: 'AWS S3 Test',
      type: 'aws-s3' as const,
      status: 'inactive' as const,
      healthStatus: 'Inactive' as const,
      storageUsed: 0,
      storageTotal: 100,
      filesCount: 0,
      connectedAt: new Date().toISOString(),
      isConfigured: false,
    };

    act(() => {
      result.current.addProvider(newProvider);
    });

    expect(result.current.providers).toHaveLength(3);
    expect(result.current.providers[2].name).toBe('AWS S3 Test');
  });

  it('should configure a provider', async () => {
    const { result } = renderHook(() => useConnectedProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add an unconfigured provider first
    const newProvider = {
      id: 'aws-config-test',
      name: 'AWS S3 Config Test',
      type: 'aws-s3' as const,
      status: 'inactive' as const,
      healthStatus: 'Inactive' as const,
      storageUsed: 0,
      storageTotal: 100,
      filesCount: 0,
      connectedAt: new Date().toISOString(),
      isConfigured: false,
    };

    act(() => {
      result.current.addProvider(newProvider);
    });

    await act(async () => {
      await result.current.configureProvider('aws-config-test', {
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
      });
    });

    const configuredProvider = result.current.providers.find(
      (p) => p.id === 'aws-config-test'
    );
    expect(configuredProvider?.isConfigured).toBe(true);
    expect(configuredProvider?.status).toBe('active');
    expect(configuredProvider?.healthStatus).toBe('Healthy');
  });

  it('should disconnect a provider', async () => {
    const { result } = renderHook(() => useConnectedProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialLength = result.current.providers.length;

    await act(async () => {
      await result.current.disconnectProvider('local-1');
    });

    expect(result.current.providers).toHaveLength(initialLength - 1);
    expect(result.current.providers.find((p) => p.id === 'local-1')).toBeUndefined();
  });

  it('should test connection successfully', async () => {
    const { result } = renderHook(() => useConnectedProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let connectionResult;
    await act(async () => {
      connectionResult = await result.current.testConnection('local-1');
    });

    expect(connectionResult).toEqual({
      success: true,
      message: 'Connection successful',
    });
  });
});

describe('useAvailableProviders hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useAvailableProviders());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.providers).toEqual([]);
  });

  it('should fetch and return available providers', async () => {
    const { result } = renderHook(() => useAvailableProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.providers).toHaveLength(1);
    expect(result.current.providers[0]).toMatchObject({
      id: 'aws-s3',
      name: 'AWS S3',
      type: 'aws-s3',
    });
  });

  it('should allow updating providers list', async () => {
    const { result } = renderHook(() => useAvailableProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setProviders([]);
    });

    expect(result.current.providers).toHaveLength(0);
  });
});

describe('useAccessRequests hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useAccessRequests());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.requests).toEqual([]);
  });

  it('should fetch and return empty access requests initially', async () => {
    const { result } = renderHook(() => useAccessRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toHaveLength(0);
  });

  it('should submit a new access request', async () => {
    const { result } = renderHook(() => useAccessRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let newRequest;
    await act(async () => {
      newRequest = await result.current.submitRequest(
        'AWS S3',
        'aws-s3',
        'I need access for project files'
      );
    });

    expect(result.current.requests).toHaveLength(1);
    expect(result.current.requests[0]).toMatchObject({
      providerName: 'AWS S3',
      providerType: 'aws-s3',
      reason: 'I need access for project files',
      status: 'pending',
    });
    expect(newRequest).toBeDefined();
  });

  it('should allow updating requests list', async () => {
    const { result } = renderHook(() => useAccessRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockRequest = {
      id: 'test-req',
      providerName: 'Test Provider',
      providerType: 'aws-s3' as const,
      reason: 'Test reason',
      status: 'approved' as const,
      requestedAt: new Date().toISOString(),
    };

    act(() => {
      result.current.setRequests([mockRequest]);
    });

    expect(result.current.requests).toHaveLength(1);
    expect(result.current.requests[0].status).toBe('approved');
  });
});

describe('useProviderConfig hook', () => {
  it('should return null when providerType is null', () => {
    const result = useProviderConfig(null);
    expect(result).toBeNull();
  });

  it('should return AWS S3 configuration fields', () => {
    const config = useProviderConfig('aws-s3');

    expect(config).not.toBeNull();
    expect(config?.providerType).toBe('aws-s3');
    expect(config?.fields).toHaveLength(4);
    expect(config?.fields.map((f) => f.id)).toEqual([
      'accessKeyId',
      'secretAccessKey',
      'bucketName',
      'region',
    ]);
  });

  it('should return Google Drive configuration fields', () => {
    const config = useProviderConfig('google-drive');

    expect(config).not.toBeNull();
    expect(config?.providerType).toBe('google-drive');
    expect(config?.fields).toHaveLength(3);
    expect(config?.fields.map((f) => f.id)).toEqual([
      'clientId',
      'clientSecret',
      'folderId',
    ]);
  });

  it('should return Local Storage configuration fields', () => {
    const config = useProviderConfig('local');

    expect(config).not.toBeNull();
    expect(config?.providerType).toBe('local');
    expect(config?.fields).toHaveLength(2);
    expect(config?.fields.map((f) => f.id)).toEqual(['basePath', 'maxStorage']);
  });

  it('should have correct field types for AWS S3', () => {
    const config = useProviderConfig('aws-s3');

    const accessKeyField = config?.fields.find((f) => f.id === 'accessKeyId');
    expect(accessKeyField?.type).toBe('text');
    expect(accessKeyField?.required).toBe(true);

    const secretKeyField = config?.fields.find((f) => f.id === 'secretAccessKey');
    expect(secretKeyField?.type).toBe('password');
    expect(secretKeyField?.required).toBe(true);

    const regionField = config?.fields.find((f) => f.id === 'region');
    expect(regionField?.type).toBe('select');
    expect(regionField?.options).toBeDefined();
    expect(regionField?.options?.length).toBeGreaterThan(0);
  });

  it('should have optional folderId for Google Drive', () => {
    const config = useProviderConfig('google-drive');

    const folderIdField = config?.fields.find((f) => f.id === 'folderId');
    expect(folderIdField?.required).toBe(false);
  });
});


