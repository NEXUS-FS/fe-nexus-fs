import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardOverview } from '@/features/dashboard/DashboardOverview';
import { DashboardStorage } from '@/features/dashboard/DashboardStorage';
import { AppHeader } from '@/components/layout/AppHeader';
import { useAuthContext } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuthContext();

  // Format username for display (capitalize first letter of each word)
  const formatDisplayName = (username: string) => {
    return username
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayName = user?.username
    ? formatDisplayName(user.username)
    : 'User';

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <AppHeader />

      <main className="container py-8 px-12 lg:px-16 space-y-8">
        <div>
          <h1 className="text-3xl font-mac-semibold tracking-tight italic">
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your files today.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#F2F5F6]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="storage">
            <DashboardStorage />
          </TabsContent>

          <TabsContent value="management">
            <div className="text-muted-foreground text-center py-12">
              Management features coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
