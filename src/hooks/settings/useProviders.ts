import { useState, useEffect } from 'react';
import { providersApi, fileOperationsApi } from '@/services';
import { useAuthContext } from '@/context/AuthContext';
import type {
  ConnectedProvider,
  AvailableProvider,
  ProviderConfig,
  ProviderType,
  ProviderRegistrationRequest,
} from '@/types';

// Available providers that users can connect to
const availableProviders: AvailableProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    type: 'google-drive',
    description: 'Connect to Google Drive',
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    type: 'aws-s3',
    description: 'Connect to Amazon S3 buckets',
  },
  {
    id: 'local',
    name: 'Local File System',
    type: 'local',
    description: 'Connect to local file system',
  },
  {
    id: 'ftp',
    name: 'FTP Server',
    type: 'ftp',
    description: 'Connect to FTP server',
  },
  {
    id: 'memory',
    name: 'In-Memory Storage',
    type: 'memory',
    description: 'Use in-memory storage (testing only)',
  },
];

// Provider configuration fields
const providerConfigs: Record<string, ProviderConfig> = {
  'google-drive': {
    providerType: 'google-drive',
    fields: [
      {
        id: 'clientId',
        label: 'Client ID',
        type: 'text',
        placeholder: 'Enter your Google Client ID',
        required: true,
      },
      {
        id: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'Enter your Google Client Secret',
        required: true,
      },
      {
        id: 'refreshToken',
        label: 'Refresh Token',
        type: 'password',
        placeholder: 'Enter your Google Refresh Token',
        required: true,
      },
    ],
  },
  'aws-s3': {
    providerType: 'aws-s3',
    fields: [
      {
        id: 'accessKey',
        label: 'Access Key ID',
        type: 'text',
        placeholder: 'Enter your AWS Access Key ID',
        required: true,
      },
      {
        id: 'secretKey',
        label: 'Secret Access Key',
        type: 'password',
        placeholder: 'Enter your AWS Secret Access Key',
        required: true,
      },
      {
        id: 'bucketName',
        label: 'Bucket Name',
        type: 'text',
        placeholder: 'my-bucket-name',
        required: true,
      },
      {
        id: 'region',
        label: 'Region',
        type: 'select',
        required: true,
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'us-east-2', label: 'US East (Ohio)' },
          { value: 'us-west-1', label: 'US West (N. California)' },
          { value: 'us-west-2', label: 'US West (Oregon)' },
          { value: 'eu-north-1', label: 'EU (Stockholm)' },
          { value: 'eu-west-1', label: 'EU (Ireland)' },
          { value: 'eu-west-2', label: 'EU (London)' },
          { value: 'eu-west-3', label: 'EU (Paris)' },
          { value: 'eu-central-1', label: 'EU (Frankfurt)' },
          { value: 'eu-south-1', label: 'EU (Milan)' },
          { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
          { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
          { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
          { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka)' },
          { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
          { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
          { value: 'ca-central-1', label: 'Canada (Central)' },
          { value: 'sa-east-1', label: 'South America (São Paulo)' },
        ],
      },
    ],
  },
  local: {
    providerType: 'local',
    fields: [
      {
        id: 'basePath',
        label: 'Base Path',
        type: 'text',
        placeholder: '/Users/yourusername/storage',
        required: true,
      },
    ],
  },
  ftp: {
    providerType: 'ftp',
    fields: [
      {
        id: 'Host',
        label: 'FTP Host',
        type: 'text',
        placeholder: 'ftp.example.com',
        required: true,
      },
      {
        id: 'Username',
        label: 'Username',
        type: 'text',
        placeholder: 'Enter FTP username',
        required: true,
      },
      {
        id: 'Password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter FTP password',
        required: true,
      },
    ],
  },
  memory: {
    providerType: 'memory',
    fields: [
      {
        id: 'maxSize',
        label: 'Max Size (MB)',
        type: 'text',
        placeholder: '100',
        required: false,
      },
    ],
  },
};

/**
 * Hook for managing connected providers
 */
export function useConnectedProviders() {
  const { user } = useAuthContext();
  const [providers, setProviders] = useState<ConnectedProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now, we'll track connected providers in localStorage
  // In a real app, this would come from the backend
  useEffect(() => {
    const loadProviders = () => {
      const stored = localStorage.getItem('connectedProviders');
      if (stored) {
        try {
          setProviders(JSON.parse(stored));
        } catch (err) {
          console.error('Failed to parse stored providers:', err);
        }
      }
    };

    loadProviders();
  }, []);

  // Fetch file counts for all providers (only on initial load)
  useEffect(() => {
    const fetchFileCounts = async () => {
      if (!user?.id || providers.length === 0) return;

      // Skip if all providers already have file counts
      const needsUpdate = providers.some(
        (p) => p.filesCount === undefined || p.filesCount === 0,
      );
      if (!needsUpdate) return;

      const updatedProviders = await Promise.all(
        providers.map(async (provider) => {
          // Skip if already has count
          if (provider.filesCount && provider.filesCount > 0) {
            return provider;
          }

          try {
            // Use correct root path based on provider type
            const rootPath = provider.type === 'local' ? '.' : '/';

            const result = await fileOperationsApi.list({
              providerId: provider.id,
              directoryPath: rootPath,
              recursive: true, // Count all files recursively
              userId: user.id,
            });

            return {
              ...provider,
              filesCount: result.files?.length || 0,
            };
          } catch (err) {
            console.error(
              `Failed to fetch file count for ${provider.name}:`,
              err,
            );
            // Keep existing count on error
            return provider;
          }
        }),
      );

      // Only update if counts changed
      const hasChanges = updatedProviders.some(
        (updated, idx) => updated.filesCount !== providers[idx].filesCount,
      );

      if (hasChanges) {
        setProviders(updatedProviders);
        localStorage.setItem(
          'connectedProviders',
          JSON.stringify(updatedProviders),
        );
      }
    };

    fetchFileCounts();
  }, [providers.length, user?.id]); // Only re-run when provider count or user changes

  const saveProviders = (updated: ConnectedProvider[]) => {
    setProviders(updated);
    localStorage.setItem('connectedProviders', JSON.stringify(updated));
  };

  const connectProvider = async (
    providerType: string,
    providerId: string,
    config: Record<string, string>,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const request: ProviderRegistrationRequest = {
        providerId,
        providerType,
        configuration: config,
      };

      const result = await providersApi.connect(providerType, request);

      if (result.success) {
        // Fetch initial file count
        let filesCount = 0;
        try {
          if (user?.id) {
            const rootPath = providerType === 'local' ? '.' : '/';
            const listResult = await fileOperationsApi.list({
              providerId,
              directoryPath: rootPath,
              recursive: true,
              userId: user.id,
            });
            filesCount = listResult.files?.length || 0;
          }
        } catch (err) {
          console.error('Failed to fetch initial file count:', err);
          // Continue with 0 count
        }

        const newProvider: ConnectedProvider = {
          id: providerId,
          name:
            availableProviders.find((p) => p.type === providerType)?.name ||
            providerType,
          type: providerType as ProviderType,
          status: 'active',
          healthStatus: 'Healthy',
          storageUsed: 0,
          storageTotal: 100,
          filesCount,
          connectedAt: new Date().toISOString(),
          isConfigured: true,
        };

        const updated = [...providers, newProvider];
        saveProviders(updated);
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to connect provider');
        return {
          success: false,
          message: result.message || 'Failed to connect provider',
        };
      }
    } catch (err: any) {
      const message = err.message || 'Failed to connect provider';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectProvider = async (providerId: string) => {
    const updated = providers.filter((p) => p.id !== providerId);
    saveProviders(updated);
  };

  const testConnection = async (_providerId: string) => {
    // This would call the actual test endpoint in a real implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Connection successful' };
  };

  const refreshFileCount = async (providerId: string) => {
    if (!user?.id) return;

    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;

    try {
      const rootPath = provider.type === 'local' ? '.' : '/';
      const result = await fileOperationsApi.list({
        providerId,
        directoryPath: rootPath,
        recursive: true,
        userId: user.id,
      });

      const updatedProviders = providers.map((p) =>
        p.id === providerId
          ? { ...p, filesCount: result.files?.length || 0 }
          : p,
      );

      saveProviders(updatedProviders);
    } catch (err) {
      console.error('Failed to refresh file count:', err);
    }
  };

  return {
    providers,
    isLoading,
    error,
    connectProvider,
    disconnectProvider,
    testConnection,
    refreshFileCount,
  };
}

/**
 * Hook for getting available providers
 */
export function useAvailableProviders() {
  const { providers: connectedProviders } = useConnectedProviders();

  // Filter out already connected providers
  const connectedTypes = connectedProviders.map((p) => p.type);
  const available = availableProviders.filter(
    (p) => !connectedTypes.includes(p.type as ProviderType),
  );

  return {
    providers: available,
    isLoading: false,
  };
}

/**
 * Hook for getting provider configuration
 */
export function useProviderConfig(providerType: string | null) {
  if (!providerType) return null;
  return providerConfigs[providerType] || null;
}
