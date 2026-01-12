import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Download, Files } from 'lucide-react';
import type { RecentActivityItem } from '@/types';

const iconMap = {
  Upload,
  Download,
  Files,
};

interface RecentActivityCardProps {
  activities: RecentActivityItem[];
  onViewAll?: () => void;
  isLoading?: boolean;
}

export function RecentActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-40 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-0.5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function RecentActivityCard({
  activities,
  onViewAll,
  isLoading,
}: RecentActivityCardProps) {
  if (isLoading) {
    return <RecentActivityCardSkeleton />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest file operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || Files;
            return (
              <div key={index} className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    You <span className="font-medium">{item.action}</span>{' '}
                    <span className="font-medium">{item.file}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Separator className="my-4" />
        <Button
          variant="default"
          className="w-full"
          size="sm"
          onClick={onViewAll}
        >
          View All Logs
        </Button>
      </CardContent>
    </Card>
  );
}
