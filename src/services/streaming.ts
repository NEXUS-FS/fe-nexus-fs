import { axiosInstance } from "@/lib/axiosInstance";
import type { StreamDownloadParams, StreamUploadParams } from "@/types";

/**
 * Streaming API Service
 * Handles large file uploads and downloads
 */

export const streamingApi = {
  /**
   * Download file as stream
   * Returns blob for file download
   */
  download: async (params: StreamDownloadParams): Promise<Blob> => {
    const response = await axiosInstance.get("/api/files/stream/download", {
      params: {
        providerId: params.providerId,
        filePath: params.filePath,
      },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Upload file as stream with progress tracking
   */
  upload: async (
    params: StreamUploadParams,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("file", params.file);

    await axiosInstance.post("/api/files/stream/upload", formData, {
      params: {
        providerId: params.providerId,
        filePath: params.filePath,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  /**
   * Helper to trigger browser download
   */
  triggerDownload: (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

