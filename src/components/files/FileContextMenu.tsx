import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Download,
  Copy,
  Scissors,
  Trash2,
  Share2,
  Info,
  FileEdit,
} from "lucide-react";

interface FileContextMenuProps {
  children: React.ReactNode;
  onDownload: () => void;
  onCopy: () => void;
  onMove: () => void;
  onDelete: () => void;
  onShare: () => void;
  onRename: () => void;
  onProperties: () => void;
}

export function FileContextMenu({
  children,
  onDownload,
  onCopy,
  onMove,
  onDelete,
  onShare,
  onRename,
  onProperties,
}: FileContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </ContextMenuItem>
        <ContextMenuItem onClick={onRename}>
          <FileEdit className="h-4 w-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={onMove}>
          <Scissors className="h-4 w-4 mr-2" />
          Move
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ContextMenuItem>
        <ContextMenuItem onClick={onProperties}>
          <Info className="h-4 w-4 mr-2" />
          Properties
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

