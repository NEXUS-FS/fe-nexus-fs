export type ErrorResponse = {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
        provider?: string;
        isActive: boolean;
        createdAt: string;
        updatedAt?: string;
        lastLogin?: string;
    };
}

export type User = {
  id: string
  username: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export type PaginatedResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type UpdateUserData = {
  username?: string
  name?: string
  email?: string
  role?: string
}

export interface RecentActivityItem {
  action: string 
  file: string 
  time: string 
  icon: string 
}

export interface ProviderHealth {
  name: string;
  status: string;
  uptime: string;
  files: number;
}

export interface FileType {
  name: string;
  size: string;
  percentage: number;
}

export interface SharedFile {
  name: string;
  sharedWith: string;
  expires: string;
}

export interface Suggestion {
  title: string;
  description: string;
}

export interface Automation {
  name: string;
  nextRun: string;
  lastRun: string;
}

export interface StorageDataPoint {
  date: string;
  storage: number;
}

export interface DashboardStats {
  totalFiles: number;
  filesChange: string;
  storageUsed: number;
  storageTotal: number;
  storagePercentage: number;
  activityToday: number;
  providersCount: number;
}

export type StoragePeriod = "7d" | "30d" | "90d" | "1y";

export type ProviderType = "google-drive" | "aws-s3" | "local";

export type ProviderStatus = "active" | "inactive" | "pending" | "disconnected";

export type ProviderHealthStatus = "Healthy" | "Stable" | "Active" | "Inactive";

export type AccessRequestStatus = "pending" | "approved" | "rejected";

export interface ConnectedProvider {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  healthStatus: ProviderHealthStatus;
  storageUsed: number;
  storageTotal: number;
  filesCount: number;
  connectedAt: string;
  isConfigured: boolean;
}

export interface ProviderConfigField {
  id: string;
  label: string;
  type: "text" | "password" | "select";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface ProviderConfig {
  providerType: ProviderType;
  fields: ProviderConfigField[];
}

export interface AvailableProvider {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
}

export interface AccessRequest {
  id: string;
  providerName: string;
  providerType: ProviderType;
  reason: string;
  status: AccessRequestStatus;
  requestedAt: string;
  respondedAt?: string;
}