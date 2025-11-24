import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useDashboardStats,
  useRecentActivity,
  useProviderHealth,
  useFileTypes,
  useSharedFiles,
  useSuggestions,
  useAutomations,
  useStorageTrend,
} from './useDashboard';
import type { StoragePeriod } from '@/types';

describe('useDashboardStats hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useDashboardStats());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeNull();
  });

  it('should fetch and return dashboard stats', async () => {
    const { result } = renderHook(() => useDashboardStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toEqual({
      totalFiles: 1234,
      filesChange: '+5 from last week',
      storageUsed: 45,
      storageTotal: 100,
      storagePercentage: 45,
      activityToday: 12,
      providersCount: 3,
    });
  });
});

describe('useRecentActivity hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useRecentActivity());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.activities).toEqual([]);
  });

  it('should fetch and return recent activities', async () => {
    const { result } = renderHook(() => useRecentActivity());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.activities).toHaveLength(4);
    expect(result.current.activities[0]).toEqual({
      action: 'uploaded',
      file: 'report.pdf',
      time: '2m ago',
      icon: 'Upload',
    });
  });
});

describe('useProviderHealth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useProviderHealth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.providers).toEqual([]);
  });

  it('should fetch and return provider health data', async () => {
    const { result } = renderHook(() => useProviderHealth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.providers).toHaveLength(3);
    expect(result.current.providers[0]).toEqual({
      name: 'AWS S3',
      status: 'Healthy',
      uptime: '99.98%',
      files: 890,
    });
    expect(result.current.providers[1].name).toBe('Google Drive');
    expect(result.current.providers[2].name).toBe('Local Storage');
  });
});

describe('useFileTypes hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useFileTypes());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.fileTypes).toEqual([]);
  });

  it('should fetch and return file types data', async () => {
    const { result } = renderHook(() => useFileTypes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.fileTypes).toHaveLength(6);
    expect(result.current.fileTypes[0]).toEqual({
      name: 'Documents',
      size: '15.75 GB',
      percentage: 35,
    });
    expect(result.current.fileTypes[2].name).toBe('Images');
  });

  it('should have correct percentage sum', async () => {
    const { result } = renderHook(() => useFileTypes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const totalPercentage = result.current.fileTypes.reduce(
      (sum, type) => sum + type.percentage,
      0,
    );
    expect(totalPercentage).toBe(100);
  });
});

describe('useSharedFiles hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useSharedFiles());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.sharedFiles).toEqual([]);
  });

  it('should fetch and return shared files', async () => {
    const { result } = renderHook(() => useSharedFiles());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sharedFiles).toHaveLength(2);
    expect(result.current.sharedFiles[0]).toEqual({
      name: 'Q3-Report.pdf',
      sharedWith: 'jane.doe@company.com',
      expires: 'Nov 20, 2025',
    });
    expect(result.current.sharedFiles[1].expires).toBe('Never');
  });
});

describe('useSuggestions hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useSuggestions());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.suggestions).toEqual([]);
  });

  it('should fetch and return suggestions', async () => {
    const { result } = renderHook(() => useSuggestions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.suggestions).toHaveLength(3);
    expect(result.current.suggestions[0]).toEqual({
      title: 'Archive old files',
      description: "15 files haven't been accessed in 6+ months (3.2 GB)",
    });
    expect(result.current.suggestions[1].title).toBe('Empty trash');
  });
});

describe('useAutomations hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useAutomations());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.automations).toEqual([]);
  });

  it('should fetch and return automations', async () => {
    const { result } = renderHook(() => useAutomations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.automations).toHaveLength(2);
    expect(result.current.automations[0]).toEqual({
      name: 'Daily Backup: /Documents → AWS S3',
      nextRun: 'Today at 11:00 PM',
      lastRun: 'Yesterday (Success)',
    });
    expect(result.current.automations[1].lastRun).toBe('Nov 10 (Success)');
  });
});

describe('useStorageTrend hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially for 7d period', () => {
    const { result } = renderHook(() => useStorageTrend('7d'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it('should fetch and return storage trend data for 7d period', async () => {
    const { result } = renderHook(() => useStorageTrend('7d'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(8);
    expect(result.current.data[0]).toEqual({
      date: 'Nov 7',
      storage: 38,
    });
    expect(result.current.data[7].storage).toBe(45);
  });

  it('should fetch and return storage trend data for 30d period', async () => {
    const { result } = renderHook(() => useStorageTrend('30d'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data[0]).toEqual({
      date: 'Oct 15',
      storage: 30,
    });
  });

  it('should fetch and return storage trend data for 90d period', async () => {
    const { result } = renderHook(() => useStorageTrend('90d'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data[0]).toEqual({
      date: 'Aug 14',
      storage: 18,
    });
  });

  it('should fetch and return storage trend data for 1y period', async () => {
    const { result } = renderHook(() => useStorageTrend('1y'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data[0]).toEqual({
      date: "Dec '23",
      storage: 10,
    });
  });

  it('should update data when period changes', async () => {
    const { result, rerender } = renderHook(
      ({ period }) => useStorageTrend(period),
      { initialProps: { period: '7d' as StoragePeriod } },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(8);

    rerender({ period: '30d' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data[0].date).toBe('Oct 15');
  });
});
