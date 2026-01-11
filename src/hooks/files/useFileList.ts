import { useState, useEffect, useCallback } from "react";
import { fileOperationsApi } from "@/services";
import { useAuthContext } from "@/context/AuthContext";
import type { ListFilesResponse, FileItem } from "@/types";

/**
 * Hook for fetching and managing file listings
 */
export function useFileList(providerId: string, directoryPath: string = "/") {
  const { user } = useAuthContext();
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
        const result = await fileOperationsApi.list({
          providerId,
          directoryPath,
          recursive,
          userId: user.id,
        });

        setFiles(result.files || []);
        setResponse(result);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || err.message || "Failed to load files";
        setError(errorMsg);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    },
    [providerId, directoryPath, user?.id]
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

