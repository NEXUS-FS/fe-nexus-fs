import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Link2 } from "lucide-react";
import type { CreateShareLinkRequest } from "@/types";

interface PublicLinkFormProps {
  fileId: string;
  fileName: string;
  onSubmit: (request: CreateShareLinkRequest) => Promise<any>;
  onSuccess: () => void;
}

export function PublicLinkForm({
  fileId,
  fileName,
  onSubmit,
  onSuccess,
}: PublicLinkFormProps) {
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxAccessCount, setMaxAccessCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const request: CreateShareLinkRequest = {
      fileId,
      fileName,
      password: password.trim() || undefined,
      expiresAt: expiresAt || undefined,
      maxAccessCount: maxAccessCount ? parseInt(maxAccessCount) : undefined,
    };

    const result = await onSubmit(request);

    setIsSubmitting(false);

    if (result.success) {
      setGeneratedLink(result.shareLink.url);
    } else {
      alert(result.error || "Failed to create share link");
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (generatedLink) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <Check className="h-5 w-5" />
            <p className="font-mac-medium">Link created successfully!</p>
          </div>
          <p className="text-sm text-green-700">
            Anyone with this link can access the file
          </p>
        </div>

        <div className="space-y-2">
          <Label>Share Link</Label>
          <div className="flex gap-2">
            <Input
              value={generatedLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onSuccess}>
            Done
          </Button>
          <Button onClick={() => setGeneratedLink(null)} variant="ghost">
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 mb-1">
          <Link2 className="h-4 w-4" />
          <p className="font-mac-medium text-sm">Public Link Sharing</p>
        </div>
        <p className="text-xs text-blue-700">
          Anyone with the link will be able to access this file
        </p>
      </div>

      {/* Password Protection */}
      <div className="space-y-2">
        <Label htmlFor="password">Password (optional)</Label>
        <Input
          id="password"
          type="password"
          placeholder="Leave empty for no password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Protect the link with a password
        </p>
      </div>

      {/* Expiration Date */}
      <div className="space-y-2">
        <Label htmlFor="expires">Expires on (optional)</Label>
        <Input
          id="expires"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Link will automatically expire after this date
        </p>
      </div>

      {/* Max Access Count */}
      <div className="space-y-2">
        <Label htmlFor="max-access">Max downloads (optional)</Label>
        <Input
          id="max-access"
          type="number"
          min="1"
          placeholder="Unlimited"
          value={maxAccessCount}
          onChange={(e) => setMaxAccessCount(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Limit the number of times this file can be accessed
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating Link..." : "Create Link"}
        </Button>
      </div>
    </div>
  );
}

