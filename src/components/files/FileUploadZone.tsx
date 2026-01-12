import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploadProgress?: number | null;
  isUploading?: boolean;
  accept?: string;
  multiple?: boolean;
}

export function FileUploadZone({
  onFilesSelected,
  uploadProgress = null,
  isUploading = false,
  accept,
  multiple = true,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input value so same file can be selected again
      e.target.value = '';
    },
    [onFilesSelected],
  );

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 hover:border-gray-400',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div
          className={cn(
            'p-4 rounded-full transition-colors',
            isDragging ? 'bg-primary/10' : 'bg-gray-100',
          )}
        >
          <Upload
            className={cn(
              'h-8 w-8',
              isDragging ? 'text-primary' : 'text-gray-500',
            )}
          />
        </div>

        {isUploading ? (
          <div className="w-full max-w-sm space-y-2">
            <p className="text-sm font-mac-medium">Uploading...</p>
            <Progress value={uploadProgress || 0} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {uploadProgress?.toFixed(0)}% complete
            </p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-lg font-mac-medium">
                {isDragging ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={accept}
              multiple={multiple}
              onChange={handleFileInput}
              disabled={isUploading}
            />

            <Button asChild variant="outline" disabled={isUploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </label>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
