import { useState, useEffect } from "react";
import type { 
  ConnectedProvider, 
  AvailableProvider, 
  AccessRequest, 
  ProviderConfig,
  ProviderType 
} from "@/types";

// Mock connected providers data
const mockConnectedProviders: ConnectedProvider[] = [
  {
    id: "local-1",
    name: "Local Storage",
    type: "local",
    status: "active",
    healthStatus: "Active",
    storageUsed: 12,
    storageTotal: 50,
    filesCount: 234,
    connectedAt: "2024-01-15T10:30:00Z",
    isConfigured: true,
  },
  {
    id: "google-1",
    name: "Google Drive",
    type: "google-drive",
    status: "active",
    healthStatus: "Stable",
    storageUsed: 8,
    storageTotal: 15,
    filesCount: 110,
    connectedAt: "2024-02-20T14:45:00Z",
    isConfigured: true,
  },
];

// Mock available providers for request
const mockAvailableProviders: AvailableProvider[] = [
  {
    id: "aws-s3",
    name: "AWS S3",
    type: "aws-s3",
    description: "Connect to Amazon S3 buckets",
  },
];

// Mock access requests - AWS S3 is approved but needs configuration
const mockAccessRequests: AccessRequest[] = [];

// Provider configuration fields
const providerConfigs: Record<ProviderType, ProviderConfig> = {
  "aws-s3": {
    providerType: "aws-s3",
    fields: [
      {
        id: "accessKeyId",
        label: "Access Key ID",
        type: "text",
        placeholder: "Enter your AWS Access Key ID",
        required: true,
      },
      {
        id: "secretAccessKey",
        label: "Secret Access Key",
        type: "password",
        placeholder: "Enter your AWS Secret Access Key",
        required: true,
      },
      {
        id: "bucketName",
        label: "Bucket Name",
        type: "text",
        placeholder: "my-bucket-name",
        required: true,
      },
      {
        id: "region",
        label: "Region",
        type: "select",
        required: true,
        options: [
          { value: "us-east-1", label: "US East (N. Virginia)" },
          { value: "us-west-2", label: "US West (Oregon)" },
          { value: "eu-west-1", label: "EU (Ireland)" },
          { value: "eu-central-1", label: "EU (Frankfurt)" },
          { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
        ],
      },
    ],
  },
  "google-drive": {
    providerType: "google-drive",
    fields: [
      {
        id: "clientId",
        label: "Client ID",
        type: "text",
        placeholder: "Enter your Google Client ID",
        required: true,
      },
      {
        id: "clientSecret",
        label: "Client Secret",
        type: "password",
        placeholder: "Enter your Google Client Secret",
        required: true,
      },
      {
        id: "folderId",
        label: "Root Folder ID (optional)",
        type: "text",
        placeholder: "Leave empty for root",
        required: false,
      },
    ],
  },
  "local": {
    providerType: "local",
    fields: [
      {
        id: "basePath",
        label: "Base Path",
        type: "text",
        placeholder: "/path/to/storage",
        required: true,
      },
      {
        id: "maxStorage",
        label: "Max Storage (GB)",
        type: "text",
        placeholder: "50",
        required: true,
      },
    ],
  },
};

export function useConnectedProviders() {
  const [providers, setProviders] = useState<ConnectedProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProviders(mockConnectedProviders);
      setIsLoading(false);
    };

    fetchProviders();
  }, []);

  const configureProvider = async (providerId: string, _config: Record<string, string>) => {
    // Simulate API call to configure provider
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, isConfigured: true, status: "active" as const, healthStatus: "Healthy" as const }
          : p
      )
    );
  };

  const addProvider = (provider: ConnectedProvider) => {
    setProviders((prev) => [...prev, provider]);
  };

  const disconnectProvider = async (providerId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProviders((prev) => prev.filter((p) => p.id !== providerId));
  };

  const testConnection = async (_providerId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "Connection successful" };
  };

  return {
    providers,
    isLoading,
    configureProvider,
    addProvider,
    disconnectProvider,
    testConnection,
  };
}

export function useAvailableProviders() {
  const [providers, setProviders] = useState<AvailableProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProviders(mockAvailableProviders);
      setIsLoading(false);
    };

    fetchProviders();
  }, []);

  return { providers, setProviders, isLoading };
}

export function useAccessRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setRequests(mockAccessRequests);
      setIsLoading(false);
    };

    fetchRequests();
  }, []);

  const submitRequest = async (providerName: string, providerType: ProviderType, reason: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newRequest: AccessRequest = {
      id: `req-${Date.now()}`,
      providerName,
      providerType,
      reason,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
    
    setRequests((prev) => [...prev, newRequest]);
    return newRequest;
  };

  return { requests, setRequests, isLoading, submitRequest };
}

export function useProviderConfig(providerType: ProviderType | null) {
  if (!providerType) return null;
  return providerConfigs[providerType] || null;
}

