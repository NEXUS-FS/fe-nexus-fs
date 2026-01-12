import type {
  ShareLink,
  InternalShare,
  CreateShareLinkRequest,
  CreateInternalShareRequest,
  SharePermission,
} from '@/types';

/**
 * File Sharing API Service
 * NOTE: Backend endpoints not yet implemented
 * Using mock data structure ready for real API integration
 */

// Mock data store (in-memory for now)
const mockShareLinks: ShareLink[] = [];
const mockInternalShares: InternalShare[] = [];

export const sharingApi = {
  /**
   * Create a public share link
   * TODO: Replace with real API call when backend endpoint is ready
   */
  createPublicLink: async (
    request: CreateShareLinkRequest,
  ): Promise<ShareLink> => {
    // Mock implementation
    const shareLink: ShareLink = {
      id: `link-${Date.now()}`,
      fileId: request.fileId,
      fileName: request.fileName,
      token: Math.random().toString(36).substring(2, 15),
      url: `${window.location.origin}/share/${Math.random()
        .toString(36)
        .substring(2, 15)}`,
      createdBy: 'current-user', // Should come from auth context
      createdAt: new Date().toISOString(),
      expiresAt: request.expiresAt || null,
      password: request.password || null,
      accessCount: 0,
      maxAccessCount: request.maxAccessCount || null,
      isActive: true,
    };

    mockShareLinks.push(shareLink);

    // TODO: Replace with actual API call:
    // const response = await axiosInstance.post('/api/shares/public', request);
    // return response.data;

    return shareLink;
  },

  /**
   * Create internal share with specific users
   * TODO: Replace with real API call when backend endpoint is ready
   */
  createInternalShare: async (
    request: CreateInternalShareRequest,
  ): Promise<InternalShare> => {
    // Mock implementation
    const share: InternalShare = {
      id: `share-${Date.now()}`,
      fileId: request.fileId,
      fileName: request.fileName,
      sharedBy: 'current-user',
      sharedWith: request.sharedWith,
      permissions: request.permissions,
      message: request.message || null,
      sharedAt: new Date().toISOString(),
      expiresAt: request.expiresAt || null,
    };

    mockInternalShares.push(share);

    // TODO: Replace with actual API call:
    // const response = await axiosInstance.post('/api/shares/internal', request);
    // return response.data;

    return share;
  },

  /**
   * Get files shared by current user
   */
  getSharedByMe: async (): Promise<InternalShare[]> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/shares/by-me');
    return mockInternalShares;
  },

  /**
   * Get files shared with current user
   */
  getSharedWithMe: async (): Promise<InternalShare[]> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/shares/with-me');
    return [];
  },

  /**
   * Get public share links created by current user
   */
  getMyShareLinks: async (): Promise<ShareLink[]> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get('/api/shares/links');
    return mockShareLinks;
  },

  /**
   * Revoke share link
   */
  revokeShareLink: async (linkId: string): Promise<void> => {
    // Mock implementation
    const index = mockShareLinks.findIndex((link) => link.id === linkId);
    if (index !== -1) {
      mockShareLinks[index].isActive = false;
    }

    // TODO: Replace with: await axiosInstance.delete(`/api/shares/links/${linkId}`);
  },

  /**
   * Update share permissions
   */
  updateSharePermissions: async (
    shareId: string,
    permissions: SharePermission[],
  ): Promise<void> => {
    // Mock implementation
    const share = mockInternalShares.find((s) => s.id === shareId);
    if (share) {
      share.permissions = permissions;
    }

    // TODO: Replace with: await axiosInstance.patch(`/api/shares/${shareId}/permissions`, { permissions });
  },

  /**
   * Remove internal share
   */
  removeInternalShare: async (shareId: string): Promise<void> => {
    // Mock implementation
    const index = mockInternalShares.findIndex((s) => s.id === shareId);
    if (index !== -1) {
      mockInternalShares.splice(index, 1);
    }

    // TODO: Replace with: await axiosInstance.delete(`/api/shares/${shareId}`);
  },

  /**
   * Get share access statistics
   */
  getShareStats: async (
    _shareId: string,
  ): Promise<{
    accessCount: number;
    lastAccessed: string | null;
    uniqueVisitors: number;
  }> => {
    // Mock implementation
    // TODO: Replace with: await axiosInstance.get(`/api/shares/${shareId}/stats`);
    return {
      accessCount: 0,
      lastAccessed: null,
      uniqueVisitors: 0,
    };
  },
};
