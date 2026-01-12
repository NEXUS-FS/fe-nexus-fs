import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, File, CheckCircle2 } from 'lucide-react';
import { streamingApi } from '@/services';
import { Progress } from '@/components/ui/progress';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  currentPath: string;
  onSuccess: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export function UploadModal({
  isOpen,
  onClose,
  providerId,
  currentPath,
  onSuccess,
}: UploadModalProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newUploadingFiles: UploadingFile[] = fileArray.map((file) => ({
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Upload files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const filePath =
        currentPath === '/' || currentPath === '.'
          ? file.name
          : `${currentPath}/${file.name}`;

      try {
        await streamingApi.upload(
          {
            providerId,
            filePath,
            file,
          },
          (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadingFiles((prev) =>
              prev.map((uf, idx) =>
                idx === uploadingFiles.length + i ? { ...uf, progress } : uf,
              ),
            );
          },
        );

        setUploadingFiles((prev) =>
          prev.map((uf) =>
            uf.file === file
              ? { ...uf, status: 'completed', progress: 100 }
              : uf,
          ),
        );
      } catch (err: any) {
        console.error('Failed to upload file:', err);
        setUploadingFiles((prev) =>
          prev.map((uf) =>
            uf.file === file
              ? {
                  ...uf,
                  status: 'error',
                  error: err.response?.data?.message || 'Upload failed',
                }
              : uf,
          ),
        );
      }
    }

    // Auto-close after all uploads complete
    setTimeout(() => {
      onSuccess();
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setUploadingFiles([]);
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Upload Files</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFiles.some((f) => f.status === 'uploading')}
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Upload Progress */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadingFiles.map((uf, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  {uf.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uf.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uf.file.size)}
                    </p>
                  </div>
                  {uf.status === 'uploading' && (
                    <span className="text-xs text-gray-500">
                      {uf.progress}%
                    </span>
                  )}
                </div>
                {uf.status === 'uploading' && (
                  <Progress value={uf.progress} className="h-1.5" />
                )}
                {uf.status === 'error' && (
                  <p className="text-xs text-red-600 mt-1">{uf.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
