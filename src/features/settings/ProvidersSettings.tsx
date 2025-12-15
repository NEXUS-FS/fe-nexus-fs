import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Plus, HardDrive } from "lucide-react";
import { RequestAccessModal } from "@/components/settings/RequestAccessModal";
import { ConfigureProviderModal } from "@/components/settings/ConfigureProviderModal";
import { ProviderCard } from "@/components/settings/ProviderCard";
import { 
  useConnectedProviders, 
  useAvailableProviders, 
  useAccessRequests,
  useProviderConfig 
} from "@/hooks/settings/useProviders";
import type { ConnectedProvider, AvailableProvider } from "@/types";

const getProviderIcon = (type: string) => {
  switch (type) {
    case "google-drive":
      return <Cloud className="h-5 w-5" />;
    case "aws-s3":
      return <Cloud className="h-5 w-5" />;
    case "local":
      return <HardDrive className="h-5 w-5" />;
    default:
      return <Cloud className="h-5 w-5" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
    case "rejected":
      return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function ProvidersSettings() {
  const { 
    providers: connectedProviders, 
    isLoading: providersLoading,
    configureProvider,
    disconnectProvider,
    testConnection,
    addProvider
  } = useConnectedProviders();
  
  const { 
    providers: availableProviders, 
    setProviders: setAvailableProviders,
    isLoading: availableLoading 
  } = useAvailableProviders();
  
  const { 
    requests: accessRequests, 
    isLoading: requestsLoading,
    submitRequest 
  } = useAccessRequests();

  // Request Access Modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedAvailableProvider, setSelectedAvailableProvider] = useState<AvailableProvider | null>(null);

  // Configure Modal state
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [selectedProviderForConfig, setSelectedProviderForConfig] = useState<ConnectedProvider | null>(null);
  
  const providerConfig = useProviderConfig(selectedProviderForConfig?.type || null);

  const handleRequestAccess = (provider: AvailableProvider) => {
    setSelectedAvailableProvider(provider);
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = async (reason: string) => {
    if (selectedAvailableProvider) {
      await submitRequest(
        selectedAvailableProvider.name,
        selectedAvailableProvider.type,
        reason
      );
      
      // For demo: immediately approve and add as inactive provider
      const newProvider: ConnectedProvider = {
        id: `${selectedAvailableProvider.type}-${Date.now()}`,
        name: selectedAvailableProvider.name === "AWS S3" ? "AWS S3 Production" : selectedAvailableProvider.name,
        type: selectedAvailableProvider.type,
        status: "inactive",
        healthStatus: "Inactive",
        storageUsed: 0,
        storageTotal: 100,
        filesCount: 0,
        connectedAt: new Date().toISOString(),
        isConfigured: false,
      };
      
      addProvider(newProvider);
      
      // Remove from available providers
      setAvailableProviders((prev) => 
        prev.filter((p) => p.id !== selectedAvailableProvider.id)
      );
    }
  };

  const handleConfigure = (provider: ConnectedProvider) => {
    setSelectedProviderForConfig(provider);
    setIsConfigureModalOpen(true);
  };

  const handleConfigureSubmit = async (providerId: string, config: Record<string, string>) => {
    await configureProvider(providerId, config);
  };

  const handleTestConnection = async (provider: ConnectedProvider) => {
    const result = await testConnection(provider.id);
    alert(result.message);
  };

  const handleDisconnect = async (provider: ConnectedProvider) => {
    if (confirm(`Are you sure you want to disconnect ${provider.name}?`)) {
      await disconnectProvider(provider.id);
    }
  };

  // Filter out providers that already have pending requests or are connected
  const connectedTypes = connectedProviders.map((p) => p.type);
  const pendingRequestTypes = accessRequests
    .filter((r) => r.status === "pending")
    .map((r) => r.providerType);
  
  const availableForRequest = availableProviders.filter(
    (p) => !connectedTypes.includes(p.type) && !pendingRequestTypes.includes(p.type)
  );

  return (
    <div className="space-y-6">
      {/* Connected Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Providers</CardTitle>
          <CardDescription>Manage your connected storage providers</CardDescription>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : connectedProviders.length === 0 ? (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              No providers configured yet
            </div>
          ) : (
            <div className="space-y-4">
              {connectedProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onConfigure={handleConfigure}
                  onTestConnection={handleTestConnection}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Access */}
      <Card>
        <CardHeader>
          <CardTitle>Request Access</CardTitle>
          <CardDescription>Request access to additional storage providers</CardDescription>
        </CardHeader>
        <CardContent>
          {availableLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : availableForRequest.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              You have requested access to all available providers
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableForRequest.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getProviderIcon(provider.type)}
                    <span className="font-mac-medium">{provider.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRequestAccess(provider)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Request
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Access Requests */}
      <Card>
        <CardHeader>
          <CardTitle>My Access Requests</CardTitle>
          <CardDescription>Track your access request status</CardDescription>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : accessRequests.length === 0 ? (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              No requests were made yet.
            </div>
          ) : (
            <div className="space-y-3">
              {accessRequests.map((request, index) => (
                <div key={request.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {getProviderIcon(request.providerType)}
                      <div>
                        <p className="font-mac-medium">{request.providerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Requested on {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  {index < accessRequests.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Access Modal */}
      <RequestAccessModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        provider={selectedAvailableProvider}
        onSubmit={handleSubmitRequest}
      />

      {/* Configure Provider Modal */}
      <ConfigureProviderModal
        open={isConfigureModalOpen}
        onOpenChange={setIsConfigureModalOpen}
        provider={selectedProviderForConfig}
        config={providerConfig}
        onSubmit={handleConfigureSubmit}
      />
    </div>
  );
}
