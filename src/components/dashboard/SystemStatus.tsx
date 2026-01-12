import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export function SystemStatus() {
  return (
    <Card className="py-4">
      <CardContent>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-mac-semibold text-xl">System Status</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          All services operational. Last sync 2 minutes ago.
        </p>
      </CardContent>
    </Card>
  );
}
