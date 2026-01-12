import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  showProgress?: boolean;
  progressValue?: number;
  isLoading?: boolean;
}

export function StatsCardSkeleton() {
  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  showProgress,
  progressValue,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return <StatsCardSkeleton />;
  }
  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-lg font-mac-semibold">{title}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {showProgress && progressValue !== undefined && (
          <Progress value={progressValue} className="h-2" />
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
