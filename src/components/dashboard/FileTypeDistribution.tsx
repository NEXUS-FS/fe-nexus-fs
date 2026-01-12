import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { FileType } from '@/types';

interface FileTypeDistributionProps {
  fileTypes: FileType[];
  isLoading?: boolean;
}

export function FileTypeDistributionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-36 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FileTypeDistribution({
  fileTypes,
  isLoading,
}: FileTypeDistributionProps) {
  if (isLoading) {
    return <FileTypeDistributionSkeleton />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage by Type</CardTitle>
        <CardDescription>File type distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fileTypes.map((type, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{type.name}</span>
                <span className="text-muted-foreground">{type.size}</span>
              </div>
              <Progress
                value={type.percentage}
                className="h-2 [&>div]:bg-foreground"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
