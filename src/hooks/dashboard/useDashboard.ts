import { useState, useEffect } from 'react';
import type {
  DashboardStats,
  RecentActivityItem,
  ProviderHealth,
  FileType,
  SharedFile,
  Suggestion,
  Automation,
  StorageDataPoint,
  StoragePeriod,
} from '@/types';

const mockRecentActivity: RecentActivityItem[] = [
  { action: 'uploaded', file: 'report.pdf', time: '2m ago', icon: 'Upload' },
  {
    action: 'renamed',
    file: 'project-draft.docx → project-final.docx',
    time: '15m ago',
    icon: 'Files',
  },
  { action: 'deleted', file: 'old-backup.zip', time: '1h ago', icon: 'Files' },
  {
    action: 'downloaded',
    file: 'analysis.csv',
    time: '2h ago',
    icon: 'Download',
  },
];

const mockProviderHealth: ProviderHealth[] = [
  { name: 'AWS S3', status: 'Healthy', uptime: '99.98%', files: 890 },
  { name: 'Google Drive', status: 'Stable', uptime: '99.92%', files: 110 },
  { name: 'Local Storage', status: 'Active', uptime: '100%', files: 234 },
];

const mockFileTypes: FileType[] = [
  { name: 'Documents', size: '15.75 GB', percentage: 35 },
  { name: 'Spreadsheets', size: '9 GB', percentage: 20 },
  { name: 'Images', size: '11.25 GB', percentage: 25 },
  { name: 'Videos', size: '4.5 GB', percentage: 10 },
  { name: 'Archives', size: '3.6 GB', percentage: 8 },
  { name: 'Other', size: '0.9 GB', percentage: 2 },
];

const mockSharedFiles: SharedFile[] = [
  {
    name: 'Q3-Report.pdf',
    sharedWith: 'jane.doe@company.com',
    expires: 'Nov 20, 2025',
  },
  {
    name: 'Budget-2025.xlsx',
    sharedWith: 'finance-team@company.com',
    expires: 'Never',
  },
];

const mockSuggestions: Suggestion[] = [
  {
    title: 'Archive old files',
    description: "15 files haven't been accessed in 6+ months (3.2 GB)",
  },
  {
    title: 'Empty trash',
    description: 'Deleted files in trash: 8 files (1.5 GB)',
  },
  {
    title: 'Enable auto-sync',
    description: 'Keep files synced across all providers automatically',
  },
];

const mockAutomations: Automation[] = [
  {
    name: 'Daily Backup: /Documents → AWS S3',
    nextRun: 'Today at 11:00 PM',
    lastRun: 'Yesterday (Success)',
  },
  {
    name: 'Auto-delete old logs (>30 days)',
    nextRun: 'Weekly (Sundays)',
    lastRun: 'Nov 10 (Success)',
  },
];

const mockStorageTrendData: Record<StoragePeriod, StorageDataPoint[]> = {
  '7d': [
    { date: 'Nov 7', storage: 38 },
    { date: 'Nov 8', storage: 39 },
    { date: 'Nov 9', storage: 40 },
    { date: 'Nov 10', storage: 41 },
    { date: 'Nov 11', storage: 42 },
    { date: 'Nov 12', storage: 43 },
    { date: 'Nov 13', storage: 44 },
    { date: 'Nov 14', storage: 45 },
  ],
  '30d': [
    { date: 'Oct 15', storage: 30 },
    { date: 'Oct 20', storage: 32 },
    { date: 'Oct 25', storage: 35 },
    { date: 'Oct 30', storage: 37 },
    { date: 'Nov 4', storage: 40 },
    { date: 'Nov 9', storage: 42 },
    { date: 'Nov 14', storage: 45 },
  ],
  '90d': [
    { date: 'Aug 14', storage: 18 },
    { date: 'Sep 1', storage: 22 },
    { date: 'Sep 15', storage: 26 },
    { date: 'Oct 1', storage: 30 },
    { date: 'Oct 15', storage: 35 },
    { date: 'Nov 1', storage: 40 },
    { date: 'Nov 14', storage: 45 },
  ],
  '1y': [
    { date: "Dec '23", storage: 10 },
    { date: "Feb '24", storage: 15 },
    { date: "Apr '24", storage: 22 },
    { date: "Jun '24", storage: 28 },
    { date: "Aug '24", storage: 35 },
    { date: "Oct '24", storage: 40 },
    { date: "Nov '24", storage: 45 },
  ],
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats({
        totalFiles: 1234,
        filesChange: '+5 from last week',
        storageUsed: 45,
        storageTotal: 100,
        storagePercentage: 45,
        activityToday: 12,
        providersCount: 3,
      });
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  return { stats, isLoading };
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActivities(mockRecentActivity);
      setIsLoading(false);
    };

    fetchActivities();
  }, []);

  return { activities, isLoading };
}

export function useProviderHealth() {
  const [providers, setProviders] = useState<ProviderHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProviders(mockProviderHealth);
      setIsLoading(false);
    };

    fetchProviders();
  }, []);

  return { providers, isLoading };
}

export function useFileTypes() {
  const [fileTypes, setFileTypes] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFileTypes = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setFileTypes(mockFileTypes);
      setIsLoading(false);
    };

    fetchFileTypes();
  }, []);

  return { fileTypes, isLoading };
}

export function useSharedFiles() {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedFiles = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSharedFiles(mockSharedFiles);
      setIsLoading(false);
    };

    fetchSharedFiles();
  }, []);

  return { sharedFiles, isLoading };
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    };

    fetchSuggestions();
  }, []);

  return { suggestions, isLoading };
}

export function useAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAutomations = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setAutomations(mockAutomations);
      setIsLoading(false);
    };

    fetchAutomations();
  }, []);

  return { automations, isLoading };
}

export function useStorageTrend(period: StoragePeriod) {
  const [data, setData] = useState<StorageDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStorageTrend = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setData(mockStorageTrendData[period]);
      setIsLoading(false);
    };

    fetchStorageTrend();
  }, [period]);

  return { data, isLoading };
}
