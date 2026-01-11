import { useState, useCallback } from "react";

/**
 * Hook for managing file selection (single and multi-select)
 */
export function useFileSelection() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleSelection = useCallback((filePath: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(filePath)) {
        return prev.filter((f) => f !== filePath);
      }
      return [...prev, filePath];
    });
  }, []);

  const selectAll = useCallback((filePaths: string[]) => {
    setSelectedFiles(filePaths);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const isSelected = useCallback(
    (filePath: string) => {
      return selectedFiles.includes(filePath);
    },
    [selectedFiles]
  );

  const selectRange = useCallback(
    (startPath: string, endPath: string, allPaths: string[]) => {
      const startIndex = allPaths.indexOf(startPath);
      const endIndex = allPaths.indexOf(endPath);

      if (startIndex === -1 || endIndex === -1) return;

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      const rangeFiles = allPaths.slice(start, end + 1);
      setSelectedFiles((prev) => {
        const newSelection = new Set([...prev, ...rangeFiles]);
        return Array.from(newSelection);
      });
    },
    []
  );

  return {
    selectedFiles,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectRange,
    selectionCount: selectedFiles.length,
    hasSelection: selectedFiles.length > 0,
  };
}

