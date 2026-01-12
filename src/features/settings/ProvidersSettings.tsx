import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, Plus, HardDrive, Database } from 'lucide-react';
import { ConfigureProviderModal } from '@/components/settings/ConfigureProviderModal';
import { ProviderCard } from '@/components/settings/ProviderCard';
import {
  useConnectedProviders,
  useAvailableProviders,
  useProviderConfig,
} from '@/hooks/settings/useProviders';
import type { ConnectedProvider, AvailableProvider } from '@/types';

const getProviderIcon = (type: string) => {
  switch (type) {
    case 'google-drive':
      return <Cloud className="h-5 w-5" />;
    case 'aws-s3':
      return <Cloud className="h-5 w-5" />;
    case 'local':
      return <HardDrive className="h-5 w-5" />;
    case 'ftp':
      return <Database className="h-5 w-5" />;
    case 'memory':
      return <Database className="h-5 w-5" />;
    default:
      return <Cloud className="h-5 w-5" />;
  }
};

export function ProvidersSettings() {
  const {
    providers: connectedProviders,
    isLoading: providersLoading,
    error: providersError,
    connectProvider,
    disconnectProvider,
    testConnection,
  } = useConnectedProviders();

  const { providers: availableProviders, isLoading: availableLoading } =
    useAvailableProviders();

  // Configure Modal state
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [selectedProviderForConnection, setSelectedProviderForConnection] =
    useState<AvailableProvider | null>(null);
  const [selectedConnectedProvider, setSelectedConnectedProvider] =
    useState<ConnectedProvider | null>(null);

  const providerConfig = useProviderConfig(
    selectedProviderForConnection?.type ||
      selectedConnectedProvider?.type ||
      null,
  );

  const handleConnectProvider = (provider: AvailableProvider) => {
    setSelectedProviderForConnection(provider);
    setSelectedConnectedProvider(null);
    setIsConfigureModalOpen(true);
  };

  const handleReconfigure = (provider: ConnectedProvider) => {
    setSelectedConnectedProvider(provider);
    setSelectedProviderForConnection(null);
    setIsConfigureModalOpen(true);
  };

  const handleConfigureSubmit = async (
    providerId: string,
    config: Record<string, string>,
  ) => {
    if (selectedProviderForConnection) {
      // Connecting a new provider
      const result = await connectProvider(
        selectedProviderForConnection.type,
        providerId,
        config,
      );

      if (result.success) {
        alert(result.message || 'Provider connected successfully!');
        setIsConfigureModalOpen(false);
      } else {
        alert(result.message || 'Failed to connect provider');
      }
    } else if (selectedConnectedProvider) {
      // Reconfiguring an existing provider
      // For now, just close the modal - in a real app, you'd update the configuration
      alert('Reconfiguration coming soon!');
      setIsConfigureModalOpen(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {providersError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{providersError}</p>
          </CardContent>
        </Card>
      )}

      {/* Connected Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Providers</CardTitle>
          <CardDescription>
            Manage your connected storage providers
          </CardDescription>
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
              <p className="font-mac-medium mb-2">No providers connected yet</p>
              <p className="text-sm">Connect a provider below to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {connectedProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onConfigure={handleReconfigure}
                  onTestConnection={handleTestConnection}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Providers</CardTitle>
          <CardDescription>Connect to a new storage provider</CardDescription>
        </CardHeader>
        <CardContent>
          {availableLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : availableProviders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              All available providers are already connected
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {getProviderIcon(provider.type)}
                    <div className="flex-1">
                      <p className="font-mac-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnectProvider(provider)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configure Provider Modal */}
      <ConfigureProviderModal
        open={isConfigureModalOpen}
        onOpenChange={setIsConfigureModalOpen}
        provider={selectedConnectedProvider}
        availableProvider={selectedProviderForConnection}
        config={providerConfig}
        onSubmit={handleConfigureSubmit}
      />
    </div>
  );
}
