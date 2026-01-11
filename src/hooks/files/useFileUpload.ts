import { useState } from "react";
import { streamingApi } from "@/services";

interface UploadProgress {
  fileName: string;
  progress: number;
  total: number;
  loaded: number;
}

/**
 * Hook for handling file uploads with progress tracking
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    providerId: string,
    filePath: string,
    file: File
  ) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress({
      fileName: file.name,
      progress: 0,
      total: file.size,
      loaded: 0,
    });

    try {
      await streamingApi.upload(
        { providerId, filePath, file },
        (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({
            fileName: file.name,
            progress,
            total: progressEvent.total,
            loaded: progressEvent.loaded,
          });
        }
      );

      setUploadProgress(null);
      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Upload failed";
      setError(errorMsg);
      setUploadProgress(null);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleFiles = async (
    providerId: string,
    baseDirectory: string,
    files: File[]
  ) => {
    const results = [];

    for (const file of files) {
      const filePath = `${baseDirectory}/${file.name}`;
      const result = await uploadFile(providerId, filePath, file);
      results.push({ file: file.name, ...result });

      // Stop on first error
      if (!result.success) {
        break;
      }
    }

    return results;
  };

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(null);
    setError(null);
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
}

