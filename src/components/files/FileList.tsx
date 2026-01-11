import { File, Folder, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { FileSortBy, FileSortOrder } from "@/types";

interface FileListProps {
  files: string[];
  selectedFiles: string[];
  onFileClick: (filePath: string) => void;
  onFileDoubleClick: (filePath: string) => void;
  onSelectionChange: (filePath: string) => void;
  onContextMenu: (e: React.MouseEvent, filePath: string) => void;
  sortBy: FileSortBy;
  sortOrder: FileSortOrder;
  onSort: (column: FileSortBy) => void;
}

export function FileList({
  files,
  selectedFiles,
  onFileClick,
  onFileDoubleClick,
  onSelectionChange,
  onContextMenu,
  sortBy,
  sortOrder,
  onSort,
}: FileListProps) {
  const formatFileName = (path: string) => {
    const parts = path.split("/");
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  const formatFileSize = (_fileName: string) => {
    // Mock file sizes - in real app, this would come from file metadata
    return "—";
  };

  const formatModified = (_fileName: string) => {
    // Mock dates - in real app, this would come from file metadata
    return "—";
  };

  const getFileType = (fileName: string) => {
    if (fileName.endsWith("/")) return "Folder";
    const ext = fileName.split(".").pop()?.toUpperCase();
    return ext ? `${ext} File` : "File";
  };

  const isDirectory = (path: string) => path.endsWith("/");

  const SortIcon = ({ column }: { column: FileSortBy }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-30" />;
    }
    return (
      <ArrowUpDown
        className={cn(
          "h-4 w-4",
          sortOrder === "desc" && "transform rotate-180"
        )}
      />
    );
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedFiles.length === files.length}
                onCheckedChange={() => {
                  // Toggle select all logic here
                }}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-accent"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-2">
                Name
                <SortIcon column="name" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-accent"
              onClick={() => onSort("size")}
            >
              <div className="flex items-center gap-2">
                Size
                <SortIcon column="size" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-accent"
              onClick={() => onSort("date")}
            >
              <div className="flex items-center gap-2">
                Modified
                <SortIcon column="date" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-accent"
              onClick={() => onSort("type")}
            >
              <div className="flex items-center gap-2">
                Type
                <SortIcon column="type" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((filePath) => {
            const isSelected = selectedFiles.includes(filePath);
            const fileName = formatFileName(filePath);
            const isDir = isDirectory(filePath);

            return (
              <TableRow
                key={filePath}
                className={cn(
                  "cursor-pointer",
                  isSelected && "bg-accent"
                )}
                onClick={() => onFileClick(filePath)}
                onDoubleClick={() => onFileDoubleClick(filePath)}
                onContextMenu={(e) => onContextMenu(e, filePath)}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelectionChange(filePath)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell className="font-mac-medium">
                  <div className="flex items-center gap-2">
                    {isDir ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="truncate max-w-md" title={fileName}>
                      {fileName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatFileSize(fileName)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatModified(fileName)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getFileType(fileName)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

