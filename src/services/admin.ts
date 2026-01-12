import type {
  AdminMetrics,
  AuditLogEntry,
  SystemLog,
  ProviderMetrics,
} from '@/types';

/**
 * Admin API Service
 * NOTE: Most admin endpoints not yet implemented in backend
 * Using mock data structure ready for real API integration
 */

export const adminApi = {
  /**
   * Get system-wide metrics
   * TODO: Replace with real API call when backend endpoint is ready
   */
  getMetrics: async (): Promise<AdminMetrics> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/admin/metrics');
    return {
      totalUsers: 42,
      activeUsers: 28,
      totalFiles: 1547,
      totalStorage: 52428800000, // 52 GB in bytes
      totalProviders: 5,
      activeProviders: 4,
      requestsToday: 3241,
      errorsToday: 12,
      avgResponseTime: 145, // milliseconds
    };
  },

  /**
   * Get audit logs with filtering
   */
  getAuditLogs: async (params?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    operation?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    logs: AuditLogEntry[];
    total: number;
    page: number;
    pageSize: number;
  }> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/admin/audit', { params });
    const mockLogs: AuditLogEntry[] = [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'user-1',
        username: 'john.doe',
        operation: 'file.read',
        resource: '/documents/report.pdf',
        providerId: 'local-1',
        success: true,
        errorMessage: null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        userId: 'user-2',
        username: 'jane.smith',
        operation: 'file.delete',
        resource: '/temp/old-file.txt',
        providerId: 's3-1',
        success: false,
        errorMessage: 'File not found',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0...',
      },
    ];

    return {
      logs: mockLogs,
      total: mockLogs.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20,
    };
  },

  /**
   * Get system logs with filtering
   */
  getSystemLogs: async (params?: {
    level?: 'info' | 'warning' | 'error' | 'debug';
    source?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    logs: SystemLog[];
    total: number;
    page: number;
    pageSize: number;
  }> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/admin/logs', { params });
    const mockLogs: SystemLog[] = [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: 'File operation completed successfully',
        source: 'FileOperationService',
        metadata: { duration: 142, providerId: 'local-1' },
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'error',
        message: 'Provider connection failed',
        source: 'S3Provider',
        metadata: { providerId: 's3-1', error: 'Timeout' },
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        level: 'warning',
        message: 'Cache miss for frequently accessed file',
        source: 'CacheManager',
        metadata: { filePath: '/shared/document.pdf' },
      },
    ];

    return {
      logs: mockLogs,
      total: mockLogs.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20,
    };
  },

  /**
   * Get provider-specific metrics
   */
  getProviderMetrics: async (): Promise<ProviderMetrics[]> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/admin/providers/metrics');
    return [
      {
        providerId: 'local-1',
        providerName: 'Local Storage',
        providerType: 'local',
        requestCount: 1524,
        errorCount: 3,
        avgLatency: 45,
        uptime: 99.8,
        lastChecked: new Date(Date.now() - 300000).toISOString(),
      },
      {
        providerId: 's3-1',
        providerName: 'AWS S3',
        providerType: 'aws-s3',
        requestCount: 987,
        errorCount: 12,
        avgLatency: 180,
        uptime: 98.5,
        lastChecked: new Date(Date.now() - 300000).toISOString(),
      },
      {
        providerId: 'gdrive-1',
        providerName: 'Google Drive',
        providerType: 'google-drive',
        requestCount: 432,
        errorCount: 5,
        avgLatency: 320,
        uptime: 97.2,
        lastChecked: new Date(Date.now() - 300000).toISOString(),
      },
    ];
  },

  /**
   * Export audit logs
   */
  exportAuditLogs: async (_params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'json';
  }): Promise<Blob> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/admin/audit/export', { params, responseType: 'blob' });
    const mockCsv = 'timestamp,user,operation,resource,success\n';
    return new Blob([mockCsv], { type: 'text/csv' });
  },

  /**
   * Get system health status
   */
  getHealth: async (): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, { status: string; message?: string }>;
  }> => {
    // Mock implementation
    // Note: Backend has /health endpoint, this wraps it
    // TODO: Use actual health endpoint
    return {
      status: 'healthy',
      checks: {
        database: { status: 'healthy' },
        redis: { status: 'healthy' },
        providers: { status: 'healthy' },
        disk: { status: 'healthy' },
      },
    };
  },
};
