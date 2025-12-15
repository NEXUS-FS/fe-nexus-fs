import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Cloud, HardDrive } from "lucide-react";
import type { ConnectedProvider } from "@/types";

interface ProviderCardProps {
  provider: ConnectedProvider;
  onConfigure: (provider: ConnectedProvider) => void;
  onTestConnection: (provider: ConnectedProvider) => void;
  onDisconnect: (provider: ConnectedProvider) => void;
}

const getProviderIcon = (type: string) => {
  switch (type) {
    case "google-drive":
      return (
        <div className="h-6 w-6 flex items-center justify-center">
          <svg viewBox="0 0 87.3 78" className="h-5 w-5">
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
          </svg>
        </div>
      );
    case "aws-s3":
      return (
        <div className="h-6 w-6 flex items-center justify-center">
          <svg viewBox="0 0 256 310" className="h-5 w-5">
            <path fill="#E25444" d="m4.8 176.8 119.2 69v62L4.8 241.4z"/>
            <path fill="#7B1D13" d="M124 245.8 243.2 176.8v64.6l-119.2 66.4z"/>
            <path fill="#F58536" d="m243.2 94.2-119.2 69V231.6l119.2-66.8z"/>
            <path fill="#E25444" d="M124 163.2 4.8 94.2v103.6l119.2 38z"/>
            <path fill="#7B1D13" d="m124 0-119.2 65.8v103.6l119.2-106z"/>
            <path fill="#F58536" d="m124 0 119.2 65.8v103.6L124 63.4z"/>
          </svg>
        </div>
      );
    case "local":
      return <HardDrive className="h-5 w-5 text-blue-500" />;
    default:
      return <Cloud className="h-5 w-5" />;
  }
};

const getHealthBadge = (healthStatus: string, isConfigured: boolean) => {
  if (!isConfigured) {
    return (
      <Badge variant="outline" className="gap-1">
        <Circle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  }

  switch (healthStatus) {
    case "Healthy":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Healthy
        </Badge>
      );
    case "Stable":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Stable
        </Badge>
      );
    case "Active":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <Circle className="h-3 w-3" />
          {healthStatus}
        </Badge>
      );
  }
};

export function ProviderCard({
  provider,
  onConfigure,
  onTestConnection,
  onDisconnect,
}: ProviderCardProps) {
  const storagePercentage = (provider.storageUsed / provider.storageTotal) * 100;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getProviderIcon(provider.type)}
              <div>
                <p className="font-mac-semibold text-lg">{provider.name}</p>
                <p className="text-sm text-muted-foreground">
                  {provider.filesCount} files
                </p>
              </div>
            </div>
            {getHealthBadge(provider.healthStatus, provider.isConfigured)}
          </div>

          {/* Storage (only show if configured) */}
          {provider.isConfigured && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mac-medium">Storage</span>
                <span className="text-muted-foreground">
                  {provider.storageUsed} / {provider.storageTotal} GB
                </span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(provider)}
            >
              Configure
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTestConnection(provider)}
            >
              Test Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDisconnect(provider)}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

