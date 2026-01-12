import { Cloud, HardDrive, Database, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ConnectedProvider } from '@/types';

interface ProviderSidebarProps {
  providers: ConnectedProvider[];
  selectedProviderId: string | null;
  onProviderSelect: (providerId: string) => void;
}

export function ProviderSidebar({
  providers,
  selectedProviderId,
  onProviderSelect,
}: ProviderSidebarProps) {
  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'local':
        return <HardDrive className="h-5 w-5" />;
      case 'aws-s3':
        return <Cloud className="h-5 w-5" />;
      case 'google-drive':
        return <Cloud className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'text-green-500';
      case 'Stable':
        return 'text-blue-500';
      case 'Active':
        return 'text-green-500';
      case 'Inactive':
        return 'text-gray-400';
      default:
        return 'text-gray-500';
    }
  };

  const formatStorage = (used: number, total: number) => {
    const usedGB = (used / (1024 * 1024 * 1024)).toFixed(1);
    const totalGB = (total / (1024 * 1024 * 1024)).toFixed(1);
    return `${usedGB} / ${totalGB} GB`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-mac-semibold px-2 text-muted-foreground uppercase">
        Providers
      </h3>
      {providers.map((provider) => (
        <Card
          key={provider.id}
          className={cn(
            'p-3 cursor-pointer transition-all hover:shadow-md',
            selectedProviderId === provider.id
              ? 'border-primary bg-accent'
              : 'hover:border-gray-300',
          )}
          onClick={() => onProviderSelect(provider.id)}
        >
          <div className="flex items-start gap-3">
            <div className={cn('mt-1', getStatusColor(provider.healthStatus))}>
              {getProviderIcon(provider.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-mac-medium text-sm truncate">
                  {provider.name}
                </h4>
                {selectedProviderId === provider.id && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {provider.filesCount} files
              </p>
              {provider.storageTotal > 0 && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${
                          (provider.storageUsed / provider.storageTotal) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatStorage(provider.storageUsed, provider.storageTotal)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
