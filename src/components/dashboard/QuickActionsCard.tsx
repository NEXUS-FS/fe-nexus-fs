import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FolderPlus, Share2, Settings } from "lucide-react";

interface QuickActionsCardProps {
  onUpload?: () => void;
  onNewFolder?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

export function QuickActionsCard({ 
  onUpload, 
  onNewFolder, 
  onShare,
  onSettings
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center gap-2 py-4"
            onClick={onUpload}
          >
            <Upload className="h-5 w-5" />
            <span className="text-sm font-mac-semibold">Upload</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center gap-2 py-4"
            onClick={onNewFolder}
          >
            <FolderPlus className="h-5 w-5" />
            <span className="text-sm font-mac-semibold">New Folder</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center gap-2 py-4"
            onClick={onShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-mac-semibold">Share</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center gap-2 py-4"
            onClick={onSettings}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-mac-semibold">Settings</span>
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="text-sm font-medium">Favorites</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Q4-Sales-Report.xlsx</span>
              <Badge variant="outline" className="text-xs">AWS S3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">project-mockups.pdf</span>
              <Badge variant="outline" className="text-xs">Local</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}