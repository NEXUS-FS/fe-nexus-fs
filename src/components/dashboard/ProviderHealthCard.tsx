import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2 } from "lucide-react";
import type { ProviderHealth } from "@/types";

interface ProviderHealthCardProps {
  providers: ProviderHealth[];
  onManage?: () => void;
  isLoading?: boolean;
}

export function ProviderHealthCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-44 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
              {i < 3 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function ProviderHealthCard({ providers, onManage, isLoading }: ProviderHealthCardProps) {
  if (isLoading) {
    return <ProviderHealthCardSkeleton />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Health</CardTitle>
        <CardDescription>Connected storage services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{provider.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {provider.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {provider.files} files
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {provider.uptime}
                </span>
              </div>
              {index < providers.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <Button 
          variant="default" 
          className="w-full" 
          onClick={onManage}
        >
          Manage Connections
        </Button>
      </CardContent>
    </Card>
  );
}