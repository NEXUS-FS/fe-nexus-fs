import { axiosInstance } from "@/lib/axiosInstance";
import type {
  RotateCredentialsRequest,
  RotateCredentialsResponse,
  TestCredentialsRequest,
  TestCredentialsResponse,
  CredentialHistoryResponse,
} from "@/types";

/**
 * Credential Management API Service
 * Handles provider credential rotation and testing
 */

export const credentialsApi = {
  /**
   * Rotate provider credentials
   */
  rotate: async (
    providerId: string,
    request: RotateCredentialsRequest
  ): Promise<RotateCredentialsResponse> => {
    const response = await axiosInstance.post<RotateCredentialsResponse>(
      `/api/credentials/${providerId}/rotate`,
      request
    );
    return response.data;
  },

  /**
   * Test provider credentials before applying
   */
  test: async (
    providerId: string,
    request: TestCredentialsRequest
  ): Promise<TestCredentialsResponse> => {
    const response = await axiosInstance.post<TestCredentialsResponse>(
      `/api/credentials/${providerId}/test`,
      request
    );
    return response.data;
  },

  /**
   * Get credential rotation history
   */
  getHistory: async (
    providerId: string
  ): Promise<CredentialHistoryResponse> => {
    const response = await axiosInstance.get<CredentialHistoryResponse>(
      `/api/credentials/${providerId}/history`
    );
    return response.data;
  },
};

