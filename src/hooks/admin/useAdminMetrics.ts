import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/services';
import type { AdminMetrics, ProviderMetrics } from '@/types';

/**
 * Hook for fetching admin metrics and system statistics
 */
export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [providerMetrics, setProviderMetrics] = useState<ProviderMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [systemMetrics, providers] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getProviderMetrics(),
      ]);

      setMetrics(systemMetrics);
      setProviderMetrics(providers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    providerMetrics,
    isLoading,
    error,
    refresh: fetchMetrics,
  };
}
