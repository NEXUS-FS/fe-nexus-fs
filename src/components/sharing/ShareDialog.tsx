import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InternalShareForm } from './InternalShareForm';
import { PublicLinkForm } from './PublicLinkForm';
import type {
  CreateShareLinkRequest,
  CreateInternalShareRequest,
} from '@/types';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  fileName: string;
  onCreatePublicLink: (request: CreateShareLinkRequest) => Promise<any>;
  onCreateInternalShare: (request: CreateInternalShareRequest) => Promise<any>;
}

export function ShareDialog({
  open,
  onOpenChange,
  fileId,
  fileName,
  onCreatePublicLink,
  onCreateInternalShare,
}: ShareDialogProps) {
  const [activeTab, setActiveTab] = useState('internal');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share &quot;{fileName}&quot;</DialogTitle>
          <DialogDescription>
            Share this file with specific users or create a public link
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Share with Users</TabsTrigger>
            <TabsTrigger value="public">Create Public Link</TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="mt-6">
            <InternalShareForm
              fileId={fileId}
              fileName={fileName}
              onSubmit={onCreateInternalShare}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="public" className="mt-6">
            <PublicLinkForm
              fileId={fileId}
              fileName={fileName}
              onSubmit={onCreatePublicLink}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
