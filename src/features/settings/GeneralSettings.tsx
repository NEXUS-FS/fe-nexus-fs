import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

export function GeneralSettings() {
  const [theme, setTheme] = useState('light');
  const [defaultView, setDefaultView] = useState('grid');
  const [filesPerPage, setFilesPerPage] = useState('20');
  const [defaultProvider, setDefaultProvider] = useState('local');
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);

  const handleSave = () => {
    // TODO: Save settings to localStorage or backend
    alert('Settings saved!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how NexusFS looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color theme
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Display</CardTitle>
          <CardDescription>Configure how files are displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-view">Default View Mode</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger id="default-view">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files-per-page">Files Per Page</Label>
            <Select value={filesPerPage} onValueChange={setFilesPerPage}>
              <SelectTrigger id="files-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Preferences</CardTitle>
          <CardDescription>Configure default upload settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-provider">Default Upload Provider</Label>
            <Select value={defaultProvider} onValueChange={setDefaultProvider}>
              <SelectTrigger id="default-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local Storage</SelectItem>
                <SelectItem value="s3">AWS S3</SelectItem>
                <SelectItem value="gdrive">Google Drive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Files will be uploaded to this provider by default
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
          <CardDescription>
            Enable or disable keyboard shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mac-medium">Enable Keyboard Shortcuts</p>
              <p className="text-sm text-muted-foreground">
                Use keyboard shortcuts for quick actions
              </p>
            </div>
            <Switch
              checked={keyboardShortcuts}
              onCheckedChange={setKeyboardShortcuts}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
