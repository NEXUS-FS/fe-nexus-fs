export type ErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};

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
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UpdateUserData = {
  username?: string;
  name?: string;
  email?: string;
  role?: string;
};

export interface RecentActivityItem {
  action: string;
  file: string;
  time: string;
  icon: string;
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

export type StoragePeriod = '7d' | '30d' | '90d' | '1y';

export type ProviderType =
  | 'google-drive'
  | 'aws-s3'
  | 'local'
  | 'ftp'
  | 'memory';

export type ProviderStatus = 'active' | 'inactive' | 'pending' | 'disconnected';

export type ProviderHealthStatus = 'Healthy' | 'Stable' | 'Active' | 'Inactive';

export interface ProviderRegistrationRequest {
  providerId: string;
  providerType: string;
  configuration: Record<string, string>;
}

export type AccessRequestStatus = 'pending' | 'approved' | 'rejected';

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
  type: 'text' | 'password' | 'select';
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

// ============= File System Types =============

export interface FileItem {
  name: string;
  path: string;
  size: number;
  created: string | null;
  modified: string | null;
  contentType: string | null;
  isDirectory: boolean;
  exists: boolean;
  additionalMetadata?: Record<string, string>;
}

export interface FileOperationRequest {
  providerId: string;
  filePath: string;
  userId: string;
}

export interface ReadFileRequest extends FileOperationRequest {}

export interface ReadFileResponse {
  success: boolean;
  message: string | null;
  content: string | null;
  timestamp: string;
}

export interface WriteFileRequest extends FileOperationRequest {
  content: string;
}

export interface WriteFileResponse {
  success: boolean;
  message: string | null;
  timestamp: string;
}

export interface DeleteFileRequest extends FileOperationRequest {}

export interface DeleteFileResponse {
  success: boolean;
  message: string | null;
  timestamp: string;
}

export interface ListFilesRequest {
  providerId: string;
  directoryPath: string;
  recursive?: boolean;
  userId?: string | null;
}

export interface ListFilesResponse {
  success: boolean;
  message: string | null;
  files: string[] | null;
  directoryPath: string | null;
  timestamp: string;
}

export interface StatFileRequest {
  providerId: string;
  path: string;
  userId: string;
}

export interface StatFileResponse {
  success: boolean;
  message: string;
  timestamp: string;
  metadata: FileItem | null;
}

export interface MkdirRequest {
  providerId: string;
  path: string;
  recursive: boolean;
  userId: string;
}

export interface MkdirResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string | null;
}

export interface CopyFileRequest {
  providerId: string;
  sourcePath: string;
  destinationPath: string;
  userId: string;
}

export interface CopyFileResponse {
  success: boolean;
  message: string;
  timestamp: string;
  sourcePath: string | null;
  destinationPath: string | null;
}

export interface MoveFileRequest {
  providerId: string;
  sourcePath: string;
  destinationPath: string;
  userId: string;
}

export interface MoveFileResponse {
  success: boolean;
  message: string;
  timestamp: string;
  sourcePath: string | null;
  destinationPath: string | null;
}

export interface ExistsRequest {
  providerId: string;
  path: string;
  userId?: string | null;
}

export interface ExistsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string | null;
  exists: boolean;
}

export interface StreamDownloadParams {
  providerId: string;
  filePath: string;
}

export interface StreamUploadParams {
  providerId: string;
  filePath: string;
  file: File;
}

// ============= Credential Management Types =============

export interface RotateCredentialsRequest {
  newCredentials: Record<string, string>;
}

export interface RotateCredentialsResponse {
  success: boolean;
  message: string;
  providerId: string | null;
  rotatedAt: string | null;
}

export interface TestCredentialsRequest {
  credentials: Record<string, string>;
}

export interface TestCredentialsResponse {
  success: boolean;
  message: string;
  providerId: string | null;
  testedAt: string | null;
}

export interface CredentialRotationRecord {
  rotatedAt: string;
  rotatedBy: string;
  success: boolean;
  notes: string | null;
}

export interface CredentialHistoryResponse {
  success: boolean;
  message: string;
  providerId: string | null;
  lastUpdated: string | null;
  history: CredentialRotationRecord[];
}

// ============= Sharing Types (Frontend-only for now) =============

export type SharePermission = 'view' | 'download' | 'edit' | 'delete';

export interface ShareLink {
  id: string;
  fileId: string;
  fileName: string;
  token: string;
  url: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  password: string | null;
  accessCount: number;
  maxAccessCount: number | null;
  isActive: boolean;
}

export interface InternalShare {
  id: string;
  fileId: string;
  fileName: string;
  sharedBy: string;
  sharedWith: string[];
  permissions: SharePermission[];
  message: string | null;
  sharedAt: string;
  expiresAt: string | null;
}

export interface CreateShareLinkRequest {
  fileId: string;
  fileName: string;
  password?: string;
  expiresAt?: string;
  maxAccessCount?: number;
}

export interface CreateInternalShareRequest {
  fileId: string;
  fileName: string;
  sharedWith: string[];
  permissions: SharePermission[];
  message?: string;
  expiresAt?: string;
}

// ============= Admin Types =============

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  totalStorage: number;
  totalProviders: number;
  activeProviders: number;
  requestsToday: number;
  errorsToday: number;
  avgResponseTime: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  operation: string;
  resource: string;
  providerId: string | null;
  success: boolean;
  errorMessage: string | null;
  ipAddress: string;
  userAgent: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  metadata: Record<string, any>;
}

export interface ProviderMetrics {
  providerId: string;
  providerName: string;
  providerType: string;
  requestCount: number;
  errorCount: number;
  avgLatency: number;
  uptime: number;
  lastChecked: string;
}

// ============= View/Display Types =============

export type FileViewMode = 'grid' | 'list';
export type FileSortBy = 'name' | 'date' | 'size' | 'type';
export type FileSortOrder = 'asc' | 'desc';

export interface FileFilterOptions {
  providerId?: string;
  fileType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  minSize?: number;
  maxSize?: number;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}
