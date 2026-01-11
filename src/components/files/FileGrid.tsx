import { useState } from "react";
import { File, Folder, Image, FileText, Film, Music, Archive } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FileGridProps {
  files: string[];
  selectedFiles: string[];
  onFileClick: (filePath: string) => void;
  onFileDoubleClick: (filePath: string) => void;
  onSelectionChange: (filePath: string) => void;
  onContextMenu: (e: React.MouseEvent, filePath: string) => void;
}

export function FileGrid({
  files,
  selectedFiles,
  onFileClick,
  onFileDoubleClick,
  onSelectionChange,
  onContextMenu,
}: FileGridProps) {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    
    if (fileName.endsWith("/")) {
      return <Folder className="h-12 w-12 text-blue-500" />;
    }

    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "svg":
        return <Image className="h-12 w-12 text-green-500" />;
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
      case "md":
        return <FileText className="h-12 w-12 text-red-500" />;
      case "mp4":
      case "avi":
      case "mov":
      case "mkv":
        return <Film className="h-12 w-12 text-purple-500" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <Music className="h-12 w-12 text-pink-500" />;
      case "zip":
      case "tar":
      case "gz":
      case "rar":
        return <Archive className="h-12 w-12 text-yellow-500" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  const formatFileName = (path: string) => {
    const parts = path.split("/");
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Folder className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-mac-medium">This folder is empty</p>
        <p className="text-sm">Upload files or create a new folder to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6">
      {files.map((filePath) => {
        const isSelected = selectedFiles.includes(filePath);
        const fileName = formatFileName(filePath);

        return (
          <div
            key={filePath}
            className={cn(
              "relative group flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent",
              isSelected
                ? "border-primary bg-accent"
                : "border-transparent hover:border-gray-300"
            )}
            onClick={() => onFileClick(filePath)}
            onDoubleClick={() => onFileDoubleClick(filePath)}
            onContextMenu={(e) => onContextMenu(e, filePath)}
          >
            {/* Selection checkbox */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelectionChange(filePath)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* File icon */}
            <div className="mb-3">{getFileIcon(fileName)}</div>

            {/* File name */}
            <p
              className="text-sm text-center break-words line-clamp-2 w-full"
              title={fileName}
            >
              {fileName}
            </p>
          </div>
        );
      })}
    </div>
  );
}

