import { useState, useEffect } from 'react';
import { X, Download, Trash2, Loader2, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { fileOperationsApi, streamingApi } from '@/services';
import { useAuthContext } from '@/context/AuthContext';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  providerId: string;
  onDelete?: () => void;
}

export function FileViewerModal({
  isOpen,
  onClose,
  filePath,
  fileName,
  providerId,
  onDelete,
}: FileViewerModalProps) {
  const { user } = useAuthContext();
  const [content, setContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'text' | 'image' | 'pdf' | 'other'>(
    'text',
  );
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && filePath) {
      loadFileContent();
    }
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, filePath, providerId]);

  const detectFileType = (fileName: string): typeof fileType => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return 'image';
    }
    if (ext === 'pdf') {
      return 'pdf';
    }
    if (
      [
        'txt',
        'md',
        'json',
        'xml',
        'csv',
        'html',
        'css',
        'js',
        'ts',
        'tsx',
        'jsx',
        'py',
        'java',
        'c',
        'cpp',
        'sh',
      ].includes(ext || '')
    ) {
      return 'text';
    }
    return 'other';
  };

  const loadFileContent = async () => {
    setIsLoading(true);
    setError(null);
    const type = detectFileType(fileName);
    setFileType(type);

    try {
      if (type === 'text') {
        // Read text content directly
        const response = await fileOperationsApi.read({
          providerId,
          filePath,
          userId: user?.id || '',
        });
        const fileContent = response.content || '';
        setContent(fileContent);
        setEditedContent(fileContent);
      } else {
        // Download as blob for images/PDFs
        const blob = await streamingApi.download({
          providerId,
          filePath,
        });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      }
    } catch (err: any) {
      console.error('Failed to load file:', err);
      setError(err.response?.data?.message || 'Failed to load file content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await streamingApi.download({
        providerId,
        filePath,
      });
      streamingApi.triggerDownload(blob, fileName);
    } catch (err) {
      console.error('Failed to download file:', err);
      alert('Failed to download file');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await fileOperationsApi.delete({
        providerId,
        filePath,
        userId: user?.id || '',
      });
      onDelete?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete file:', err);
      alert('Failed to delete file');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content); // Reset to original content
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await fileOperationsApi.write({
        providerId,
        filePath,
        content: editedContent,
        userId: user?.id || '',
      });

      // Update the original content with saved content
      setContent(editedContent);
      setIsEditing(false);

      // Show success message briefly
      const successMsg = 'File saved successfully!';
      setError(successMsg);
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      console.error('Failed to save file:', err);
      setError(err.response?.data?.message || 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 truncate max-w-lg">
            {fileName}
          </h2>
          <div className="flex items-center gap-2">
            {/* Edit/Save buttons (only for text files) */}
            {fileType === 'text' && !isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                title="Edit"
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </>
            )}

            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {error && !error.includes('success') && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {error && error.includes('success') && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{error}</p>
            </div>
          )}

          {!isLoading && fileType === 'text' && isEditing && (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full min-h-[500px] font-mono text-sm resize-none"
              placeholder="Enter file content..."
            />
          )}

          {!isLoading && fileType === 'text' && !isEditing && (
            <pre className="bg-white border border-gray-200 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap break-words">
              {content}
            </pre>
          )}

          {!isLoading && !error && fileType === 'image' && blobUrl && (
            <div className="flex items-center justify-center h-full">
              <img
                src={blobUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {!isLoading && !error && fileType === 'pdf' && blobUrl && (
            <iframe
              src={blobUrl}
              className="w-full h-full border-0 rounded-lg"
              title={fileName}
            />
          )}

          {!isLoading && !error && fileType === 'other' && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-600 mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
