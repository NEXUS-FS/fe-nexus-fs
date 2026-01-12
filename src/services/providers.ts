import { axiosInstance } from '@/lib/axiosInstance';
import type { ProviderRegistrationRequest } from '@/types';

export interface ConnectProviderResponse {
  success: boolean;
  message?: string;
  providerId?: string;
}

/**
 * Provider-specific API services for connecting to different storage providers
 */
export const providersApi = {
  /**
   * Connect to Google Drive
   */
  connectGoogle: async (
    data: ProviderRegistrationRequest,
  ): Promise<ConnectProviderResponse> => {
    try {
      await axiosInstance.post('/api/providers/google', data);
      return {
        success: true,
        message: 'Google Drive connected successfully',
        providerId: data.providerId,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          'Failed to connect to Google Drive',
      };
    }
  },

  /**
   * Connect to AWS S3
   */
  connectS3: async (
    data: ProviderRegistrationRequest,
  ): Promise<ConnectProviderResponse> => {
    try {
      await axiosInstance.post('/api/providers/s3', data);
      return {
        success: true,
        message: 'AWS S3 connected successfully',
        providerId: data.providerId,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          'Failed to connect to AWS S3',
      };
    }
  },

  /**
   * Connect to Local File System
   */
  connectLocal: async (
    data: ProviderRegistrationRequest,
  ): Promise<ConnectProviderResponse> => {
    try {
      await axiosInstance.post('/api/providers/local', data);
      return {
        success: true,
        message: 'Local file system connected successfully',
        providerId: data.providerId,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          'Failed to connect to local file system',
      };
    }
  },

  /**
   * Connect to FTP Server
   */
  connectFtp: async (
    data: ProviderRegistrationRequest,
  ): Promise<ConnectProviderResponse> => {
    try {
      await axiosInstance.post('/api/providers/ftp', data);
      return {
        success: true,
        message: 'FTP server connected successfully',
        providerId: data.providerId,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          'Failed to connect to FTP server',
      };
    }
  },

  /**
   * Connect to In-Memory Provider (for testing)
   */
  connectMemory: async (
    data: ProviderRegistrationRequest,
  ): Promise<ConnectProviderResponse> => {
    try {
      await axiosInstance.post('/api/providers/memory', data);
      return {
        success: true,
        message: 'Memory provider connected successfully',
        providerId: data.providerId,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          'Failed to connect to memory provider',
      };
    }
  },

  /**
   * Generic connect method that routes to the appropriate provider
   * Maps frontend provider types to backend provider types
   */
  connect: async (
    providerType: string,
    data: ProviderRegistrationRequest,
  ): Promise<ConnectProviderResponse> => {
    // Normalize the provider type to match backend expectations
    let normalizedType = providerType.toLowerCase();
    let endpoint = '';

    switch (normalizedType) {
      case 'google-drive':
      case 'google':
      case 'googledrive':
        normalizedType = 'google'; // Backend expects "google"
        endpoint = '/api/providers/google';
        break;
      case 'aws-s3':
      case 's3':
      case 'aws':
        normalizedType = 's3'; // Backend expects "s3" or "aws"
        endpoint = '/api/providers/s3';
        break;
      case 'local':
      case 'filesystem':
        normalizedType = 'local';
        endpoint = '/api/providers/local';
        break;
      case 'ftp':
      case 'ftps':
      case 'sftp':
        normalizedType = 'ftp';
        endpoint = '/api/providers/ftp';
        break;
      case 'memory':
        normalizedType = 'memory';
        endpoint = '/api/providers/memory';
        break;
      default:
        return {
          success: false,
          message: `Unknown provider type: ${providerType}`,
        };
    }

    // Update the request with the normalized provider type
    const requestData: ProviderRegistrationRequest = {
      ...data,
      providerType: normalizedType,
    };

    try {
      console.log('🔐 Attempting to connect provider:', {
        endpoint,
        providerType: normalizedType,
        providerId: data.providerId,
        hasToken: !!localStorage.getItem('accessToken'),
      });

      await axiosInstance.post(endpoint, requestData);

      console.log('✅ Provider connected successfully');
      return {
        success: true,
        message: `Provider connected successfully`,
        providerId: data.providerId,
      };
    } catch (error: any) {
      console.error('❌ Provider connection failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = error.message || 'Failed to connect provider';

      if (error.response?.status === 401) {
        errorMessage =
          '🔒 Unauthorized: You need to be logged in or your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage =
          '🚫 Forbidden: You do not have permission to connect providers. Admin access may be required.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  },
};
