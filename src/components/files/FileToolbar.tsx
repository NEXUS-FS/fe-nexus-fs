import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FolderPlus,
  Grid3x3,
  List,
  Search,
} from "lucide-react";
import type { FileViewMode, FileSortBy } from "@/types";

interface FileToolbarProps {
  viewMode: FileViewMode;
  onViewModeChange: (mode: FileViewMode) => void;
  sortBy: FileSortBy;
  onSortChange: (sort: FileSortBy) => void;
  onUploadClick: () => void;
  onNewFolderClick: () => void;
  onSearchChange: (query: string) => void;
}

export function FileToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onUploadClick,
  onNewFolderClick,
  onSearchChange,
}: FileToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-white">
      {/* Left: Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={onUploadClick} size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
        <Button onClick={onNewFolderClick} variant="outline" size="sm">
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Right: View controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as FileSortBy)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Date Modified</SelectItem>
            <SelectItem value="size">Size</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>

        {/* View mode toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

