import { useState, useEffect, useCallback } from 'react';
import { sharingApi } from '@/services';
import type {
  ShareLink,
  InternalShare,
  CreateShareLinkRequest,
  CreateInternalShareRequest,
  SharePermission,
} from '@/types';

/**
 * Hook for managing file sharing
 */
export function useSharing() {
  const [sharedByMe, setSharedByMe] = useState<InternalShare[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<InternalShare[]>([]);
  const [myShareLinks, setMyShareLinks] = useState<ShareLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [byMe, withMe, links] = await Promise.all([
        sharingApi.getSharedByMe(),
        sharingApi.getSharedWithMe(),
        sharingApi.getMyShareLinks(),
      ]);

      setSharedByMe(byMe);
      setSharedWithMe(withMe);
      setMyShareLinks(links);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shares');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createPublicLink = async (request: CreateShareLinkRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const shareLink = await sharingApi.createPublicLink(request);
      setMyShareLinks((prev) => [...prev, shareLink]);
      return { success: true, shareLink };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create share link';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const createInternalShare = async (request: CreateInternalShareRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const share = await sharingApi.createInternalShare(request);
      setSharedByMe((prev) => [...prev, share]);
      return { success: true, share };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create share';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const revokeLink = async (linkId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await sharingApi.revokeShareLink(linkId);
      setMyShareLinks((prev) =>
        prev.map((link) =>
          link.id === linkId ? { ...link, isActive: false } : link,
        ),
      );
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to revoke share link';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const removeInternalShare = async (shareId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await sharingApi.removeInternalShare(shareId);
      setSharedByMe((prev) => prev.filter((s) => s.id !== shareId));
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to remove share';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermissions = async (
    shareId: string,
    permissions: SharePermission[],
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await sharingApi.updateSharePermissions(shareId, permissions);
      setSharedByMe((prev) =>
        prev.map((share) =>
          share.id === shareId ? { ...share, permissions } : share,
        ),
      );
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update permissions';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sharedByMe,
    sharedWithMe,
    myShareLinks,
    isLoading,
    error,
    createPublicLink,
    createInternalShare,
    revokeLink,
    removeInternalShare,
    updatePermissions,
    refresh: fetchAll,
  };
}
