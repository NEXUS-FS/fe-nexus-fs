import { useState } from 'react';
import { streamingApi } from '@/services';

/**
 * Hook for handling file downloads
 */
export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (
    providerId: string,
    filePath: string,
    fileName?: string,
  ) => {
    setIsDownloading(true);
    setError(null);

    try {
      const blob = await streamingApi.download({ providerId, filePath });

      // Extract filename from path if not provided
      const name = fileName || filePath.split('/').pop() || 'download';

      streamingApi.triggerDownload(blob, name);

      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Download failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadFile,
    isDownloading,
    error,
  };
}
