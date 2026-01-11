import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SharedFilesList } from "@/components/sharing/SharedFilesList";
import { ShareDialog } from "@/components/sharing/ShareDialog";
import { useSharing } from "@/hooks/sharing";
import { Share2, Loader2, RefreshCw } from "lucide-react";

export default function SharedFiles() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"by-me" | "with-me" | "links">("by-me");

  const {
    sharedByMe,
    sharedWithMe,
    myShareLinks,
    isLoading,
    error,
    createPublicLink,
    createInternalShare,
    revokeLink,
    removeInternalShare,
    refresh,
  } = useSharing();

  const handleCopyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    // Show success feedback (could add a toast here)
  };

  const handleRevoke = async (id: string, type: "internal" | "public") => {
    const confirmMessage =
      type === "internal"
        ? "Are you sure you want to remove this share?"
        : "Are you sure you want to revoke this link? It will no longer be accessible.";

    if (!confirm(confirmMessage)) return;

    const result = type === "internal" 
      ? await removeInternalShare(id)
      : await revokeLink(id);

    if (result.success) {
      // Success - list will update automatically
    } else {
      alert(result.error || "Failed to revoke");
    }
  };

  const handleEditPermissions = (_shareId: string) => {
    // TODO: Implement permissions editor dialog
    alert("Permissions editor coming soon!");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <AppHeader />

      <main className="container py-8 px-12 lg:px-16">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-mac-semibold tracking-tight">Shared Files</h1>
            <p className="text-muted-foreground mt-1">
              Manage files you&apos;ve shared and files shared with you
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share File
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-mac-medium">Error loading shares</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="by-me">Shared by Me</TabsTrigger>
            <TabsTrigger value="with-me">Shared with Me</TabsTrigger>
            <TabsTrigger value="links">Public Links</TabsTrigger>
          </TabsList>

          <TabsContent value="by-me">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <SharedFilesList
                internalShares={sharedByMe}
                type="internal"
                onRevoke={(id) => handleRevoke(id, "internal")}
                onEditPermissions={handleEditPermissions}
              />
            )}
          </TabsContent>

          <TabsContent value="with-me">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : sharedWithMe.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg">
                <Share2 className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-mac-medium">No files shared with you</p>
                <p className="text-sm">Files others share with you will appear here</p>
              </div>
            ) : (
              <SharedFilesList
                internalShares={sharedWithMe}
                type="internal"
              />
            )}
          </TabsContent>

          <TabsContent value="links">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <SharedFilesList
                publicLinks={myShareLinks}
                type="public"
                onCopyLink={handleCopyLink}
                onRevoke={(id) => handleRevoke(id, "public")}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Share Dialog (Demo - would normally be triggered from file context menu) */}
      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        fileId="demo-file-1"
        fileName="example-document.pdf"
        onCreatePublicLink={createPublicLink}
        onCreateInternalShare={createInternalShare}
      />
    </div>
  );
}

