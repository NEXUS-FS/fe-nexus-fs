import { useState, useEffect, useCallback } from 'react';
import { fileOperationsApi } from '@/services';
import { useAuthContext } from '@/context/AuthContext';
import { useConnectedProviders } from '@/hooks/settings/useProviders';
import type { ListFilesResponse } from '@/types';

/**
 * Hook for fetching and managing file listings
 */
export function useFileList(providerId: string, directoryPath: string = '/') {
  const { user } = useAuthContext();
  const { providers } = useConnectedProviders();
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ListFilesResponse | null>(null);

  const fetchFiles = useCallback(
    async (recursive: boolean = false) => {
      if (!providerId || !user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get provider type to determine correct path format
        const provider = providers.find((p) => p.id === providerId);
        const providerType = provider?.type || '';

        // Normalize path based on provider type
        let normalizedPath = directoryPath;

        if (!directoryPath || directoryPath === '/' || directoryPath === '.') {
          // Local provider uses "." for current directory
          if (providerType === 'local') {
            normalizedPath = '.';
          }
          // Cloud providers (S3, Google Drive, FTP, etc.) use "/"
          else if (
            [
              'aws-s3',
              's3',
              'google-drive',
              'google',
              'ftp',
              'memory',
            ].includes(providerType)
          ) {
            normalizedPath = '/';
          }
          // Default to "/" for unknown types
          else {
            normalizedPath = '/';
          }
        }

        console.log('📁 Fetching files:', {
          providerId,
          providerType,
          directoryPath: normalizedPath,
          userId: user.id,
          originalPath: directoryPath,
        });

        const result = await fileOperationsApi.list({
          providerId,
          directoryPath: normalizedPath,
          recursive,
          userId: user.id,
        });

        console.log('✅ Files response:', result);
        console.log('📋 Files array:', result.files);

        setFiles(result.files || []);
        setResponse(result);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || err.message || 'Failed to load files';
        console.error('❌ Error fetching files:', err);
        console.error('Error response:', err.response?.data);
        setError(errorMsg);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    },
    [providerId, directoryPath, user?.id, providers],
  );

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const refresh = () => fetchFiles();

  return {
    files,
    isLoading,
    error,
    response,
    refresh,
  };
}
