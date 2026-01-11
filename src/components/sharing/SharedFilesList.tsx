import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { File, Copy, Link2, X, Edit, Users } from "lucide-react";
import type { InternalShare, ShareLink } from "@/types";

interface SharedFilesListProps {
  internalShares?: InternalShare[];
  publicLinks?: ShareLink[];
  onCopyLink?: (url: string) => void;
  onRevoke?: (id: string) => void;
  onEditPermissions?: (id: string) => void;
  type: "internal" | "public";
}

export function SharedFilesList({
  internalShares,
  publicLinks,
  onCopyLink,
  onRevoke,
  onEditPermissions,
  type,
}: SharedFilesListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPermissions = (permissions: string[]) => {
    return permissions.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
  };

  if (type === "internal" && internalShares) {
    if (internalShares.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg">
          <Users className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-lg font-mac-medium">No internal shares</p>
          <p className="text-sm">Files you share with users will appear here</p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Shared With</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Shared On</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {internalShares.map((share) => (
              <TableRow key={share.id}>
                <TableCell className="font-mac-medium">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    {share.fileName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {share.sharedWith.slice(0, 2).map((email) => (
                      <Badge key={email} variant="secondary" className="text-xs">
                        {email}
                      </Badge>
                    ))}
                    {share.sharedWith.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{share.sharedWith.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatPermissions(share.permissions)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(share.sharedAt)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {share.expiresAt ? formatDate(share.expiresAt) : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEditPermissions && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPermissions(share.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onRevoke && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevoke(share.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (type === "public" && publicLinks) {
    if (publicLinks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg">
          <Link2 className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-lg font-mac-medium">No public links</p>
          <p className="text-sm">Create public links to share files with anyone</p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Access Count</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publicLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mac-medium">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    {link.fileName}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground max-w-xs truncate">
                  {link.url}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {link.accessCount}
                  {link.maxAccessCount && ` / ${link.maxAccessCount}`}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(link.createdAt)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {link.expiresAt ? formatDate(link.expiresAt) : "Never"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={link.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {link.isActive ? "Active" : "Revoked"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onCopyLink && link.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopyLink(link.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    {onRevoke && link.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevoke(link.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return null;
}

