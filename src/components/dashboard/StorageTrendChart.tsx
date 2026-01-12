import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { StorageDataPoint, StoragePeriod } from '@/types';

interface StorageTrendChartProps {
  data: StorageDataPoint[];
  period: StoragePeriod;
  onPeriodChange: (period: StoragePeriod) => void;
  isLoading?: boolean;
}

const chartConfig = {
  storage: {
    label: 'Storage (GB)',
    color: 'hsl(var(--foreground))',
  },
} satisfies ChartConfig;

export function StorageTrendChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex flex-col justify-between py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-[1px] flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-[1px] flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-[1px] flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-[1px] flex-1" />
          </div>
          <div className="flex justify-between mt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-4 w-12" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StorageTrendChart({
  data,
  period,
  onPeriodChange,
  isLoading,
}: StorageTrendChartProps) {
  // Show skeleton only on initial load (no data yet)
  if (isLoading && data.length === 0) {
    return <StorageTrendChartSkeleton />;
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Storage Trend</CardTitle>
            <CardDescription>Storage usage over time</CardDescription>
          </div>
          <Select
            value={period}
            onValueChange={(value: StoragePeriod) => onPeriodChange(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={`h-[300px] w-full transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        >
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              label={{
                value: 'GB',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="storage"
              type="linear"
              stroke="#000000"
              strokeWidth={2}
              dot={{
                fill: '#000000',
                r: 5,
                strokeWidth: 0,
              }}
              activeDot={{
                r: 7,
                strokeWidth: 0,
              }}
              connectNulls
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
