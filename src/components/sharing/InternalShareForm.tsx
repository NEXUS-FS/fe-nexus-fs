import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, UserPlus } from "lucide-react";
import type { CreateInternalShareRequest, SharePermission } from "@/types";

interface InternalShareFormProps {
  fileId: string;
  fileName: string;
  onSubmit: (request: CreateInternalShareRequest) => Promise<any>;
  onSuccess: () => void;
}

export function InternalShareForm({
  fileId,
  fileName,
  onSubmit,
  onSuccess,
}: InternalShareFormProps) {
  const [email, setEmail] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<SharePermission[]>(["view", "download"]);
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = () => {
    if (email.trim() && !sharedWith.includes(email.trim())) {
      setSharedWith([...sharedWith, email.trim()]);
      setEmail("");
    }
  };

  const handleRemoveUser = (userEmail: string) => {
    setSharedWith(sharedWith.filter((e) => e !== userEmail));
  };

  const togglePermission = (permission: SharePermission) => {
    if (permissions.includes(permission)) {
      // Don't allow removing "view" if it's the only permission
      if (permission === "view" && permissions.length === 1) return;
      setPermissions(permissions.filter((p) => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSubmit = async () => {
    if (sharedWith.length === 0) {
      alert("Please add at least one user");
      return;
    }

    setIsSubmitting(true);

    const request: CreateInternalShareRequest = {
      fileId,
      fileName,
      sharedWith,
      permissions,
      message: message.trim() || undefined,
      expiresAt: expiresAt || undefined,
    };

    const result = await onSubmit(request);

    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      alert(result.error || "Failed to share file");
    }
  };

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <div className="space-y-2">
        <Label htmlFor="email">Share with</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUser();
              }
            }}
          />
          <Button onClick={handleAddUser} variant="outline">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected users */}
        {sharedWith.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sharedWith.map((userEmail) => (
              <Badge key={userEmail} variant="secondary" className="pr-1">
                {userEmail}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => handleRemoveUser(userEmail)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Permissions */}
      <div className="space-y-3">
        <Label>Permissions</Label>
        <div className="space-y-2">
          {(["view", "download", "edit", "delete"] as SharePermission[]).map((perm) => (
            <div key={perm} className="flex items-center gap-2">
              <Checkbox
                id={`perm-${perm}`}
                checked={permissions.includes(perm)}
                onCheckedChange={() => togglePermission(perm)}
              />
              <Label htmlFor={`perm-${perm}`} className="cursor-pointer capitalize">
                {perm}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Optional message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          placeholder="Add a note for the recipients..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      {/* Expiration */}
      <div className="space-y-2">
        <Label htmlFor="expires">Expires on (optional)</Label>
        <Input
          id="expires"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || sharedWith.length === 0}
        >
          {isSubmitting ? "Sharing..." : "Send Invitation"}
        </Button>
      </div>
    </div>
  );
}

