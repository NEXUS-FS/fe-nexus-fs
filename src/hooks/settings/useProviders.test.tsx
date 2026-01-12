import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import {
  useConnectedProviders,
  useAvailableProviders,
  useProviderConfig,
} from './useProviders';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuthContext: vi.fn(() => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  })),
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

// Mock the file operations API
vi.mock('@/services', () => ({
  providersApi: {
    connect: vi.fn().mockResolvedValue({
      success: true,
      message: 'Provider connected successfully',
    }),
  },
  fileOperationsApi: {
    list: vi.fn().mockResolvedValue({
      files: ['file1.txt', 'file2.txt', 'file3.txt'],
      success: true,
    }),
  },
}));

describe('useConnectedProviders hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useConnectedProviders());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.providers).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should load providers from localStorage', () => {
    const mockProviders = [
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
    ];

    localStorageMock.setItem(
      'connectedProviders',
      JSON.stringify(mockProviders),
    );

    const { result } = renderHook(() => useConnectedProviders());

    expect(result.current.providers).toHaveLength(1);
    expect(result.current.providers[0].name).toBe('Local Storage');
  });

  it('should test connection', async () => {
    const { result } = renderHook(() => useConnectedProviders());

    const testResult = await result.current.testConnection('test-provider');

    expect(testResult.success).toBe(true);
    expect(testResult.message).toBe('Connection successful');
  });
});

describe('useAvailableProviders hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return all available providers when none are connected', () => {
    const { result } = renderHook(() => useAvailableProviders());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.providers.length).toBeGreaterThan(0);
    expect(
      result.current.providers.some((p) => p.type === 'google-drive'),
    ).toBe(true);
    expect(result.current.providers.some((p) => p.type === 'aws-s3')).toBe(
      true,
    );
  });

  it('should filter out connected providers', () => {
    const mockProviders = [
      {
        id: 'google-1',
        name: 'Google Drive',
        type: 'google-drive' as const,
        status: 'active' as const,
        healthStatus: 'Healthy' as const,
        storageUsed: 8,
        storageTotal: 15,
        filesCount: 110,
        connectedAt: '2024-02-20T14:45:00Z',
        isConfigured: true,
      },
    ];

    localStorageMock.setItem(
      'connectedProviders',
      JSON.stringify(mockProviders),
    );

    const { result } = renderHook(() => useAvailableProviders());

    expect(
      result.current.providers.every((p) => p.type !== 'google-drive'),
    ).toBe(true);
  });
});

describe('useProviderConfig hook', () => {
  it('should return null for null provider type', () => {
    const { result } = renderHook(() => useProviderConfig(null));
    expect(result.current).toBeNull();
  });

  it('should return config for aws-s3', () => {
    const { result } = renderHook(() => useProviderConfig('aws-s3'));

    expect(result.current).not.toBeNull();
    expect(result.current?.providerType).toBe('aws-s3');
    expect(result.current?.fields.length).toBeGreaterThan(0);
    expect(result.current?.fields.some((f) => f.id === 'accessKey')).toBe(true);
  });

  it('should return config for google-drive', () => {
    const { result } = renderHook(() => useProviderConfig('google-drive'));

    expect(result.current).not.toBeNull();
    expect(result.current?.providerType).toBe('google-drive');
    expect(result.current?.fields.some((f) => f.id === 'clientId')).toBe(true);
  });

  it('should return config for local', () => {
    const { result } = renderHook(() => useProviderConfig('local'));

    expect(result.current).not.toBeNull();
    expect(result.current?.providerType).toBe('local');
    expect(result.current?.fields.some((f) => f.id === 'basePath')).toBe(true);
  });

  it('should return null for unknown provider type', () => {
    const { result } = renderHook(() => useProviderConfig('unknown-provider'));
    expect(result.current).toBeNull();
  });
});
