import { useState } from "react";
import { fileOperationsApi } from "@/services";
import { useAuthContext } from "@/context/AuthContext";
import type {
  DeleteFileRequest,
  CopyFileRequest,
  MoveFileRequest,
  MkdirRequest,
} from "@/types";

/**
 * Hook for file CRUD operations
 */
export function useFileOperations() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFile = async (providerId: string, filePath: string) => {
    if (!user?.id) {
      setError("User not authenticated");
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fileOperationsApi.delete({
        providerId,
        filePath,
        userId: user.id,
      });
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to delete file";
      setError(errorMsg);
      return { success: false, message: errorMsg, timestamp: new Date().toISOString() };
    } finally {
      setIsLoading(false);
    }
  };

  const copyFile = async (
    providerId: string,
    sourcePath: string,
    destinationPath: string
  ) => {
    if (!user?.id) {
      setError("User not authenticated");
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fileOperationsApi.copy({
        providerId,
        sourcePath,
        destinationPath,
        userId: user.id,
      });
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to copy file";
      setError(errorMsg);
      return { success: false, message: errorMsg, timestamp: new Date().toISOString(), sourcePath: null, destinationPath: null };
    } finally {
      setIsLoading(false);
    }
  };

  const moveFile = async (
    providerId: string,
    sourcePath: string,
    destinationPath: string
  ) => {
    if (!user?.id) {
      setError("User not authenticated");
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fileOperationsApi.move({
        providerId,
        sourcePath,
        destinationPath,
        userId: user.id,
      });
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to move file";
      setError(errorMsg);
      return { success: false, message: errorMsg, timestamp: new Date().toISOString(), sourcePath: null, destinationPath: null };
    } finally {
      setIsLoading(false);
    }
  };

  const createDirectory = async (
    providerId: string,
    path: string,
    recursive: boolean = true
  ) => {
    if (!user?.id) {
      setError("User not authenticated");
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fileOperationsApi.mkdir({
        providerId,
        path,
        recursive,
        userId: user.id,
      });
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to create directory";
      setError(errorMsg);
      return { success: false, message: errorMsg, timestamp: new Date().toISOString(), path: null };
    } finally {
      setIsLoading(false);
    }
  };

  const checkExists = async (providerId: string, path: string) => {
    if (!user?.id) {
      setError("User not authenticated");
      return { exists: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fileOperationsApi.exists({
        providerId,
        path,
        userId: user.id,
      });
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to check file existence";
      setError(errorMsg);
      return { success: false, message: errorMsg, timestamp: new Date().toISOString(), path: null, exists: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteFile,
    copyFile,
    moveFile,
    createDirectory,
    checkExists,
    isLoading,
    error,
  };
}

