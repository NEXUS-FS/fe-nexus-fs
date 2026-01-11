import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FileToolbar } from "@/components/files/FileToolbar";
import { FileGrid } from "@/components/files/FileGrid";
import { FileList } from "@/components/files/FileList";
import { ProviderSidebar } from "@/components/files/ProviderSidebar";
import { Breadcrumb } from "@/components/files/Breadcrumb";
import { FileUploadZone } from "@/components/files/FileUploadZone";
import { NewFolderDialog } from "@/components/files/NewFolderDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFileList, useFileOperations, useFileUpload, useFileDownload, useFileSelection } from "@/hooks/files";
import { useConnectedProviders } from "@/hooks/settings/useProviders";
import type { FileViewMode, FileSortBy, FileSortOrder, BreadcrumbItem } from "@/types";
import { Loader2 } from "lucide-react";

export default function FileExplorer() {
  // State
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<FileViewMode>("grid");
  const [sortBy, setSortBy] = useState<FileSortBy>("name");
  const [sortOrder, setSortOrder] = useState<FileSortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

  // Hooks
  const { providers, isLoading: providersLoading } = useConnectedProviders();
  const { files, isLoading: filesLoading, error: filesError, refresh } = useFileList(
    selectedProviderId || "",
    currentPath
  );
  const { createDirectory } = useFileOperations();
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();
  const { downloadFile } = useFileDownload();
  const { selectedFiles, toggleSelection, clearSelection } = useFileSelection();

  // Auto-select first provider
  useEffect(() => {
    if (!selectedProviderId && providers.length > 0) {
      const activeProvider = providers.find(p => p.status === "active");
      setSelectedProviderId(activeProvider?.id || providers[0].id);
    }
  }, [providers, selectedProviderId]);

  // Build breadcrumb from current path
  const breadcrumbItems: BreadcrumbItem[] = currentPath
    .split("/")
    .filter(Boolean)
    .reduce((acc, segment, index, array) => {
      const path = "/" + array.slice(0, index + 1).join("/");
      acc.push({ label: segment, path });
      return acc;
    }, [] as BreadcrumbItem[]);

  // Filtered and sorted files
  const filteredFiles = files
    .filter((file) =>
      file.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aName = a.split("/").pop() || "";
      const bName = b.split("/").pop() || "";
      
      let comparison = 0;
      if (sortBy === "name") {
        comparison = aName.localeCompare(bName);
      }
      // Add more sort logic for size, date, type when metadata is available
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Event handlers
  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
    setCurrentPath("/");
    clearSelection();
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    clearSelection();
  };

  const handleFileClick = (filePath: string) => {
    toggleSelection(filePath);
  };

  const handleFileDoubleClick = (filePath: string) => {
    if (filePath.endsWith("/")) {
      // Navigate into directory
      setCurrentPath(filePath);
      clearSelection();
    } else {
      // Open/download file
      handleDownload(filePath);
    }
  };

  const handleUpload = async (uploadedFiles: File[]) => {
    if (!selectedProviderId) return;

    for (const file of uploadedFiles) {
      const filePath = currentPath === "/" ? `/${file.name}` : `${currentPath}/${file.name}`;
      const result = await uploadFile(selectedProviderId, filePath, file);
      
      if (!result.success) {
        alert(`Failed to upload ${file.name}`);
        break;
      }
    }
    
    refresh();
    setIsUploadDialogOpen(false);
  };

  const handleNewFolder = async (folderName: string) => {
    if (!selectedProviderId) return;

    const folderPath = currentPath === "/" ? `/${folderName}` : `${currentPath}/${folderName}`;
    const result = await createDirectory(selectedProviderId, folderPath);
    
    if (result.success) {
      refresh();
    } else {
      alert(result.message || "Failed to create folder");
    }
  };

  const handleDownload = async (filePath: string) => {
    if (!selectedProviderId) return;

    const fileName = filePath.split("/").pop();
    const result = await downloadFile(selectedProviderId, filePath, fileName);
    
    if (!result.success) {
      alert("Failed to download file");
    }
  };

  const handleSort = (column: FileSortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleContextMenu = (e: React.MouseEvent, _filePath: string) => {
    e.preventDefault();
    // Context menu is handled by FileContextMenu wrapper
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <AppHeader />

      <main className="container py-8 px-12 lg:px-16">
        <div className="mb-6">
          <h1 className="text-3xl font-mac-semibold tracking-tight">Files</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage files across all your providers
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Providers */}
          <aside className="w-64 shrink-0">
            {providersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ProviderSidebar
                providers={providers}
                selectedProviderId={selectedProviderId}
                onProviderSelect={handleProviderSelect}
              />
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="border rounded-lg bg-white shadow-sm">
              {/* Breadcrumb */}
              <Breadcrumb items={breadcrumbItems} onNavigate={handleNavigate} />

              {/* Toolbar */}
              <FileToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onUploadClick={() => setIsUploadDialogOpen(true)}
                onNewFolderClick={() => setIsNewFolderDialogOpen(true)}
                onSearchChange={setSearchQuery}
              />

              {/* File Display */}
              <div className="min-h-[400px]">
                {filesLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : filesError ? (
                  <div className="flex flex-col items-center justify-center py-16 text-red-600">
                    <p>Error loading files</p>
                    <p className="text-sm">{filesError}</p>
                    <Button onClick={refresh} variant="outline" className="mt-4">
                      Retry
                    </Button>
                  </div>
                ) : viewMode === "grid" ? (
                  <FileGrid
                    files={filteredFiles}
                    selectedFiles={selectedFiles}
                    onFileClick={handleFileClick}
                    onFileDoubleClick={handleFileDoubleClick}
                    onSelectionChange={toggleSelection}
                    onContextMenu={handleContextMenu}
                  />
                ) : (
                  <FileList
                    files={filteredFiles}
                    selectedFiles={selectedFiles}
                    onFileClick={handleFileClick}
                    onFileDoubleClick={handleFileDoubleClick}
                    onSelectionChange={toggleSelection}
                    onContextMenu={handleContextMenu}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload files to: <strong>{currentPath}</strong>
            </DialogDescription>
          </DialogHeader>
          <FileUploadZone
            onFilesSelected={handleUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress?.progress}
            multiple={true}
          />
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <NewFolderDialog
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        onConfirm={handleNewFolder}
        currentPath={currentPath}
      />
    </div>
  );
}

