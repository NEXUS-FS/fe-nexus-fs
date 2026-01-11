import { axiosInstance } from "@/lib/axiosInstance";
import type {
  ReadFileRequest,
  ReadFileResponse,
  WriteFileRequest,
  WriteFileResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  ListFilesRequest,
  ListFilesResponse,
  StatFileRequest,
  StatFileResponse,
  MkdirRequest,
  MkdirResponse,
  CopyFileRequest,
  CopyFileResponse,
  MoveFileRequest,
  MoveFileResponse,
  ExistsRequest,
  ExistsResponse,
} from "@/types";

/**
 * File Operations API Service
 * Handles all file CRUD operations across providers
 */

export const fileOperationsApi = {
  /**
   * Read file content
   */
  read: async (request: ReadFileRequest): Promise<ReadFileResponse> => {
    const response = await axiosInstance.post<ReadFileResponse>(
      "/api/files/read",
      request
    );
    return response.data;
  },

  /**
   * Write content to file
   */
  write: async (request: WriteFileRequest): Promise<WriteFileResponse> => {
    const response = await axiosInstance.post<WriteFileResponse>(
      "/api/files/write",
      request
    );
    return response.data;
  },

  /**
   * Delete a file
   */
  delete: async (request: DeleteFileRequest): Promise<DeleteFileResponse> => {
    const response = await axiosInstance.delete<DeleteFileResponse>(
      "/api/files",
      { data: request }
    );
    return response.data;
  },

  /**
   * List files in a directory
   */
  list: async (request: ListFilesRequest): Promise<ListFilesResponse> => {
    const response = await axiosInstance.get<ListFilesResponse>(
      "/api/files/list",
      {
        params: {
          providerId: request.providerId,
          directoryPath: request.directoryPath,
          recursive: request.recursive || false,
          userId: request.userId || null,
        },
      }
    );
    return response.data;
  },

  /**
   * Get file/directory metadata
   */
  stat: async (request: StatFileRequest): Promise<StatFileResponse> => {
    const response = await axiosInstance.post<StatFileResponse>(
      "/api/files/stat",
      request
    );
    return response.data;
  },

  /**
   * Create directory
   */
  mkdir: async (request: MkdirRequest): Promise<MkdirResponse> => {
    const response = await axiosInstance.post<MkdirResponse>(
      "/api/files/mkdir",
      request
    );
    return response.data;
  },

  /**
   * Copy file
   */
  copy: async (request: CopyFileRequest): Promise<CopyFileResponse> => {
    const response = await axiosInstance.post<CopyFileResponse>(
      "/api/files/copy",
      request
    );
    return response.data;
  },

  /**
   * Move/rename file
   */
  move: async (request: MoveFileRequest): Promise<MoveFileResponse> => {
    const response = await axiosInstance.post<MoveFileResponse>(
      "/api/files/move",
      request
    );
    return response.data;
  },

  /**
   * Check if file exists
   */
  exists: async (request: ExistsRequest): Promise<ExistsResponse> => {
    const response = await axiosInstance.get<ExistsResponse>(
      "/api/files/exists",
      {
        params: {
          providerId: request.providerId,
          path: request.path,
          userId: request.userId || null,
        },
      }
    );
    return response.data;
  },
};

