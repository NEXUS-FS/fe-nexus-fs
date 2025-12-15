import { useParams, Navigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { SettingsSidebar } from "@/components/layout/SettingsSidebar";
import { Card } from "@/components/ui/card";
import { ProvidersSettings } from "@/features/settings/ProvidersSettings";

const validTabs = ["profile", "general", "providers", "security", "notifications", "api", "support"];

export default function Settings() {
  const { tab } = useParams<{ tab: string }>();

  // Redirect to providers if no tab or invalid tab
  if (!tab || !validTabs.includes(tab)) {
    return <Navigate to="/settings/providers" replace />;
  }

  const renderContent = () => {
    switch (tab) {
      case "providers":
        return <ProvidersSettings />;
      case "profile":
        return (
          <div className="text-muted-foreground text-center py-12">
            Profile settings coming soon...
          </div>
        );
      case "general":
        return (
          <div className="text-muted-foreground text-center py-12">
            General settings coming soon...
          </div>
        );
      case "security":
        return (
          <div className="text-muted-foreground text-center py-12">
            Security settings coming soon...
          </div>
        );
      case "notifications":
        return (
          <div className="text-muted-foreground text-center py-12">
            Notification settings coming soon...
          </div>
        );
      case "api":
        return (
          <div className="text-muted-foreground text-center py-12">
            API settings coming soon...
          </div>
        );
      case "support":
        return (
          <div className="text-muted-foreground text-center py-12">
            Support options coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <AppHeader />

      <main className="container py-8 px-12 lg:px-16 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-mac-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>

        {/* Settings Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <Card className="w-64 shrink-0 p-4 h-fit">
            <SettingsSidebar />
          </Card>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}
