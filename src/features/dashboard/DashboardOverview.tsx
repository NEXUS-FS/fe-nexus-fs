import { StatsCard, StatsCardSkeleton } from '@/components/dashboard/StatsCard';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { Files, HardDrive, Sparkles, Cloud } from 'lucide-react';
import {
  useDashboardStats,
  useRecentActivity,
} from '@/hooks/dashboard/useDashboard';

export function DashboardOverview() {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();

  return (
    <div className="space-y-6">
      {/* System Status - First */}
      <SystemStatus />

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {statsLoading || !stats ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Files"
              value={stats.totalFiles.toLocaleString()}
              icon={Files}
              description={stats.filesChange}
            />
            <StatsCard
              title="Storage Used"
              value={`${stats.storageUsed} GB`}
              icon={HardDrive}
              description={`${stats.storagePercentage}% of ${stats.storageTotal} GB`}
              showProgress
              progressValue={stats.storagePercentage}
            />
            <StatsCard
              title="Activity Today"
              value={stats.activityToday}
              icon={Sparkles}
              description="operations completed"
            />
            <StatsCard
              title="Providers"
              value={stats.providersCount}
              icon={Cloud}
              description="connected services"
            />
          </>
        )}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivityCard
          activities={activities}
          onViewAll={() => console.log('View all logs')}
          isLoading={activitiesLoading}
        />
        <QuickActionsCard
          onUpload={() => console.log('Upload')}
          onNewFolder={() => console.log('New folder')}
          onShare={() => console.log('Share')}
          onSettings={() => console.log('Settings')}
        />
      </div>
    </div>
  );
}
