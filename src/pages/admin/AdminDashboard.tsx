import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MetricsCard } from "@/components/admin/MetricsCard";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminMetrics, useAdminUsers } from "@/hooks/admin";
import {
  Users,
  Files,
  HardDrive,
  Server,
  Activity,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const { metrics, providerMetrics, isLoading: metricsLoading, refresh: refreshMetrics } = useAdminMetrics();
  const { users, totalCount, totalPages, isLoading: usersLoading, deleteUser, refresh: refreshUsers } = useAdminUsers(currentPage, 10);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const result = await deleteUser(userId);
    if (!result.success) {
      alert(result.error || "Failed to delete user");
    }
  };

  const handleEditUser = (user: any) => {
    // TODO: Implement user edit dialog
    alert("User edit dialog coming soon!");
  };

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <AppHeader />

      <main className="container py-8 px-12 lg:px-16">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-mac-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              System overview and management
            </p>
          </div>

          <Button variant="outline" onClick={() => {
            refreshMetrics();
            refreshUsers();
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {metricsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <MetricsCard
                title="Total Users"
                value={metrics?.totalUsers || 0}
                change={`${metrics?.activeUsers || 0} active`}
                icon={Users}
                trend="up"
              />
              <MetricsCard
                title="Total Files"
                value={metrics?.totalFiles.toLocaleString() || 0}
                icon={Files}
              />
              <MetricsCard
                title="Storage Used"
                value={formatBytes(metrics?.totalStorage || 0)}
                icon={HardDrive}
              />
              <MetricsCard
                title="Active Providers"
                value={`${metrics?.activeProviders || 0} / ${metrics?.totalProviders || 0}`}
                icon={Server}
                trend={metrics && metrics.activeProviders === metrics.totalProviders ? "up" : "down"}
              />
            </div>

            {/* Activity Metrics */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-mac-medium">Requests Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-mac-bold">{metrics?.requestsToday.toLocaleString() || 0}</div>
                      <p className="text-xs text-muted-foreground">API requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-mac-medium">Errors Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <div className="text-2xl font-mac-bold">{metrics?.errorsToday || 0}</div>
                      <p className="text-xs text-muted-foreground">Failed requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-mac-medium">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-mac-bold">{metrics?.avgResponseTime || 0}ms</div>
                      <p className="text-xs text-muted-foreground">Average latency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Provider Metrics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Provider Performance</CardTitle>
                <CardDescription>Health and performance metrics by provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providerMetrics.map((provider) => (
                    <div key={provider.providerId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-mac-medium">{provider.providerName}</p>
                        <p className="text-sm text-muted-foreground">{provider.providerType}</p>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="text-muted-foreground">Requests</p>
                          <p className="font-mac-medium">{provider.requestCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Errors</p>
                          <p className="font-mac-medium text-red-600">{provider.errorCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Latency</p>
                          <p className="font-mac-medium">{provider.avgLatency}ms</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Uptime</p>
                          <p className="font-mac-medium text-green-600">{provider.uptime.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="logs">System Logs</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Users ({totalCount})</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <UserManagementTable
                          users={users}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center gap-2 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm">
                              Page {currentPage} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs">
                <Card>
                  <CardHeader>
                    <CardTitle>System Logs</CardTitle>
                    <CardDescription>View system logs and errors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg font-mac-medium">Log viewer coming soon</p>
                      <p className="text-sm">System logs will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>Track user actions and system changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg font-mac-medium">Audit trail coming soon</p>
                      <p className="text-sm">User activity logs will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

