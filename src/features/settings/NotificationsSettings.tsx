import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

export function NotificationsSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: "file-shared",
      label: "File Shared with Me",
      description: "When someone shares a file with you",
      email: true,
      push: true,
    },
    {
      id: "link-accessed",
      label: "Share Link Accessed",
      description: "When someone accesses your shared link",
      email: true,
      push: false,
    },
    {
      id: "provider-issues",
      label: "Provider Connection Issues",
      description: "When a provider becomes unavailable",
      email: true,
      push: true,
    },
    {
      id: "storage-warning",
      label: "Storage Quota Warnings",
      description: "When you're running low on storage",
      email: true,
      push: false,
    },
    {
      id: "security-alerts",
      label: "Security Alerts",
      description: "Suspicious activity on your account",
      email: true,
      push: true,
    },
    {
      id: "weekly-summary",
      label: "Weekly Activity Summary",
      description: "Summary of your file activity",
      email: false,
      push: false,
    },
  ]);

  const toggleEmail = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, email: !pref.email } : pref
      )
    );
  };

  const togglePush = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, push: !pref.push } : pref
      )
    );
  };

  const handleSave = () => {
    // TODO: Save preferences to backend
    alert("Notification preferences saved!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mac-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-mac-medium">Browser Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div key={pref.id} className="flex items-start justify-between py-4 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-mac-medium">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <div className="flex gap-6 ml-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <Switch
                      checked={pref.email && emailEnabled}
                      onCheckedChange={() => toggleEmail(pref.id)}
                      disabled={!emailEnabled}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">Push</span>
                    <Switch
                      checked={pref.push && pushEnabled}
                      onCheckedChange={() => togglePush(pref.id)}
                      disabled={!pushEnabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

