import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AvailableProvider } from "@/types";

interface RequestAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: AvailableProvider | null;
  onSubmit: (reason: string) => void;
}

export function RequestAccessModal({
  open,
  onOpenChange,
  provider,
  onSubmit,
}: RequestAccessModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-mac-semibold">
            Request Provider Access
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for requesting access to {provider?.name || "this provider"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="font-mac-medium">
              Reason for Access
            </Label>
            <Textarea
              id="reason"
              placeholder="I need access to this provider for..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason.trim()}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

