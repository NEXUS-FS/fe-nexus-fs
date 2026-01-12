import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { useFileList } from '@/hooks/files';
import { useConnectedProviders } from '@/hooks/settings/useProviders';
import { useAuthContext } from '@/context/AuthContext';
import { fileOperationsApi } from '@/services';
import {
  Grid3x3,
  LayoutList,
  Upload,
  FolderPlus,
  Filter,
  ChevronDown,
  Check,
  Settings as SettingsIcon,
  FileText,
  Sheet,
  Folder,
  ArrowUpFromLine,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FileExplorer() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // State
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  );
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [allFiles, setAllFiles] = useState<string[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Hooks
  const { providers } = useConnectedProviders();
  const { files, isLoading: filesLoading } = useFileList(
    selectedProviderId || '',
    currentPath,
  );

  // Auto-select first provider (but don't show all files by default)
  useEffect(() => {
    if (!selectedProviderId && !showAllFiles && providers.length > 0) {
      const activeProvider = providers.find((p) => p.status === 'active');
      setSelectedProviderId(activeProvider?.id || providers[0].id);
    }
  }, [providers, selectedProviderId, showAllFiles]);

  // Fetch files from all providers when "All files" is selected
  useEffect(() => {
    const fetchAllFiles = async () => {
      if (!showAllFiles || !user?.id) return;

      console.log('🔄 Fetching files from all providers:', providers);

      setIsLoadingAll(true);
      try {
        const allFilesPromises = providers.map(async (provider) => {
          try {
            console.log(
              `📥 Fetching from ${provider.name} (${provider.id}, type: ${provider.type})...`,
            );

            // Use correct root path based on provider type
            // Local uses ".", cloud providers use "/"
            const rootPath = provider.type === 'local' ? '.' : '/';

            const result = await fileOperationsApi.list({
              providerId: provider.id,
              directoryPath: rootPath,
              recursive: false,
              userId: user.id,
            });
            console.log(`✅ ${provider.name} returned:`, result);
            console.log(`📋 ${provider.name} files:`, result.files);
            return result.files || [];
          } catch (error) {
            console.error(
              `❌ Failed to fetch files from ${provider.name}:`,
              error,
            );
            return [];
          }
        });

        const filesArrays = await Promise.all(allFilesPromises);
        console.log('📦 All files arrays:', filesArrays);
        const combined = filesArrays.flat();
        console.log('🎯 Combined files:', combined);
        setAllFiles(combined);
      } catch (error) {
        console.error('Failed to fetch all files:', error);
        setAllFiles([]);
      } finally {
        setIsLoadingAll(false);
      }
    };

    fetchAllFiles();
  }, [showAllFiles, providers, user?.id]);

  const handleProviderSelect = (providerId: string) => {
    setShowAllFiles(false);
    setSelectedProviderId(providerId);
    setCurrentPath('/');
  };

  const handleAllFilesSelect = () => {
    setShowAllFiles(true);
    setSelectedProviderId(null);
  };

  const isFolder = (fileName: string) => {
    return (
      fileName.endsWith('/') ||
      (fileName.includes('/') && !fileName.includes('.'))
    );
  };

  const getFileIcon = (fileName: string) => {
    if (isFolder(fileName))
      return <Folder className="h-6 w-6 text-yellow-600" />;
    if (fileName.endsWith('.pdf'))
      return <FileText className="h-6 w-6 text-red-500" />;
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))
      return <Sheet className="h-6 w-6 text-green-600" />;
    return <FileText className="h-6 w-6 text-gray-400" />;
  };

  const handleFileClick = (filePath: string) => {
    if (isFolder(filePath)) {
      // Navigate into folder
      const folderPath = filePath.endsWith('/')
        ? filePath.slice(0, -1)
        : filePath;
      setCurrentPath(folderPath);
    } else {
      // TODO: Open/preview file
      console.log('Opening file:', filePath);
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path || '/');
  };

  const getFileSize = (fileName: string) => {
    if (fileName.includes('Q4-Report')) return '2.4 MB';
    if (fileName.includes('Budget')) return '890 KB';
    if (fileName.includes('Documents')) return '450 MB';
    if (fileName.includes('Media')) return '180 MB';
    if (fileName.includes('Archives')) return '320 MB';
    return '1.2 MB';
  };

  const getFileDate = (fileName: string) => {
    if (fileName.includes('Q4-Report')) return 'Nov 12, 2025';
    if (fileName.includes('Budget')) return 'Nov 10, 2025';
    if (fileName.includes('Documents')) return 'Nov 1, 2025';
    if (fileName.includes('Media')) return 'Oct 15, 2025';
    if (fileName.includes('Archives')) return 'Oct 10, 2025';
    return 'Nov 5, 2025';
  };

  const getProviderLabel = (fileName: string) => {
    if (fileName.includes('Q4-Report') || fileName.includes('Documents'))
      return 'AWS S3 Production';
    if (fileName.includes('Budget') || fileName.includes('Archives'))
      return 'Local Storage';
    if (fileName.includes('Media')) return 'Google Drive';
    return 'Local Storage';
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      <div className="flex gap-0 max-w-[1400px] mx-auto">
        {/* Left Sidebar - Storage Providers */}
        <aside className="w-[280px] min-h-[calc(100vh-64px)] border-r border-gray-200 bg-white">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Storage Providers</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="py-4 px-4">
            <div className="space-y-1">
              {/* All Files */}
              <button
                onClick={handleAllFilesSelect}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  showAllFiles
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
                <span>All files</span>
              </button>

              {/* Providers */}
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    selectedProviderId === provider.id && !showAllFiles
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="h-4 w-4">
                    {provider.type === 'local' && '💾'}
                    {provider.type === 'aws-s3' && '☁️'}
                    {provider.type === 'google-drive' && '📁'}
                  </div>
                  <span className="flex-1 text-left">{provider.name}</span>
                  {provider.status === 'active' && (
                    <Check
                      className={`h-4 w-4 ${selectedProviderId === provider.id && !showAllFiles ? 'text-green-400' : 'text-green-600'}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="absolute bottom-0 w-[280px] px-4 pb-4 border-t border-gray-200 pt-4 bg-white">
            <button
              onClick={() => navigate('/settings/providers')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">
          <div className="px-8 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <button
                onClick={() => handleBreadcrumbClick('/')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Home
              </button>
              {!showAllFiles &&
                currentPath !== '/' &&
                currentPath
                  .split('/')
                  .filter(Boolean)
                  .map((segment, index, array) => {
                    const path = '/' + array.slice(0, index + 1).join('/');
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-400">/</span>
                        <button
                          onClick={() => handleBreadcrumbClick(path)}
                          className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                          {segment}
                        </button>
                      </div>
                    );
                  })}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button className="h-9 px-4 bg-black hover:bg-black/90 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" className="h-9 px-4">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
                <Button variant="outline" className="h-9 px-4">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>

                <Button variant="ghost" className="h-9 px-3 ml-2">
                  <span className="text-sm font-medium">Name</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File Display Area */}
            {(showAllFiles ? isLoadingAll : filesLoading) ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Loading files...
              </div>
            ) : (showAllFiles ? allFiles : files).length === 0 ? (
              <div className="border-2 border-dashed border-blue-400 rounded-lg p-16 flex flex-col items-center justify-center text-center mb-6">
                <ArrowUpFromLine className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {showAllFiles
                    ? 'No files found across all providers'
                    : 'Drag and drop files here, or click Upload button'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(showAllFiles ? allFiles : files).map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleFileClick(file)}
                    className="border border-gray-200 rounded-lg px-5 py-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">{getFileIcon(file)}</div>

                    {/* Name & Provider */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {file.split('/').pop() || file}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {getProviderLabel(file)}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="text-sm text-gray-600 w-20 text-right">
                      {isFolder(file) ? '-' : getFileSize(file)}
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-600 w-32 text-right">
                      {getFileDate(file)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
