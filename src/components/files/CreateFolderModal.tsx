import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Folder } from 'lucide-react';
import { fileOperationsApi } from '@/services';
import { useAuthContext } from '@/context/AuthContext';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  currentPath: string;
  onSuccess: () => void;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  providerId,
  currentPath,
  onSuccess,
}: CreateFolderModalProps) {
  const { user } = useAuthContext();
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const folderPath =
        currentPath === '/' || currentPath === '.'
          ? folderName
          : `${currentPath}/${folderName}`;

      await fileOperationsApi.mkdir({
        providerId,
        path: folderPath,
        recursive: true,
        userId: user?.id || '',
      });

      setFolderName('');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create folder:', err);
      setError(
        err.response?.data?.message ||
          'Failed to create folder. Please try again.',
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Create New Folder</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Folder Name
            </label>
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              disabled={isCreating}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !folderName.trim()}
            >
              {isCreating ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
