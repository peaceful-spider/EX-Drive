import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { FileExplorer } from '../components/FileExplorer';
import { SyncInspector } from '../components/SyncInspector';
import { DetailsPanel } from '../components/DetailsPanel';
import { TagManager } from '../components/TagManager';
import { SmartCollections } from '../components/SmartCollections';
import { VersionHistory } from '../components/VersionHistory';
import { StorageAnalytics } from '../components/StorageAnalytics';
import { ContextMenu } from '../components/ContextMenu';
import { AdvancedSearch, SearchFilters } from '../components/AdvancedSearch';
import { SecurityPanel, SecuritySettings } from '../components/SecurityPanel';
import { OfflineManager } from '../components/OfflineManager';
import { initialFiles, initialTags } from '../data';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { FileItem, Tag, SmartCollection } from '../types';
import { CreateFolderModal, RenameModal, ConfirmDeleteModal, ShareModal, UploadModal } from '../components/Modals';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { TourOverlay } from '../components/TourOverlay';
import { useDashboard } from '../context/DashboardContext';

import { InstallPrompt } from '../components/InstallPrompt';

export default function Dashboard() {
  const { isPowerMode, setPowerMode: setIsPowerMode, hasSeenOnboarding, completeOnboarding } = useAuth();
  const { activeSidebarItem, setActiveSidebarItem, uploadOpen, setUploadOpen } = useDashboard();
  const [showTour, setShowTour] = useState(false);

  React.useEffect(() => {
     if (!hasSeenOnboarding) {
         const timer = setTimeout(() => setShowTour(true), 1500);
         return () => clearTimeout(timer);
     }
  }, [hasSeenOnboarding]);

  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSyncInspector, setShowSyncInspector] = useState(false);
  
  // File System State
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [collections, setCollections] = useState<SmartCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

  // Modal State
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState<FileItem | null>(null);

  // Feature Panels
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<FileItem | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showSmartCollections, setShowSmartCollections] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [fileForVersionHistory, setFileForVersionHistory] = useState<FileItem | null>(null);
  const [showStorageAnalytics, setShowStorageAnalytics] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [fileForSecurity, setFileForSecurity] = useState<FileItem | null>(null);
  const [showOfflineManager, setShowOfflineManager] = useState(false);

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{ file: FileItem; x: number; y: number } | null>(null);

  // --- Actions ---

  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      size: 0,
      path: currentPath === '/' ? `/${name}` : `${currentPath}/${name}`,
      parentId: files.find(f => f.path === currentPath)?.id || null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: { state: 'pending', progress: 0 },
      version: 1,
      owner: 'You',
      hash: `folder-hash-${Date.now()}`,
    };
    setFiles([...files, newFolder]);
    toast.success(`Folder "${name}" created`);
  };

  const handleRename = (newName: string) => {
    if (!fileToRename) return;
    
    const updatedFiles = files.map(f => {
      if (f.id === fileToRename.id) {
        return { ...f, name: newName, updatedAt: new Date() };
      }
      return f;
    });
    
    setFiles(updatedFiles);
    toast.success(`Renamed to "${newName}"`);
    setFileToRename(null);
  };

  const handleDelete = () => {
    if (activeSidebarItem === 'trash') {
        setFiles(prev => prev.filter(f => !filesToDelete.includes(f.id)));
        toast.success(`${filesToDelete.length} item(s) permanently deleted`);
    } else {
        const updatedFiles = files.map(f => {
            if (filesToDelete.includes(f.id)) {
                return { ...f, trashed: true, updatedAt: new Date() };
            }
            return f;
        });
        setFiles(updatedFiles);
        toast.success(`${filesToDelete.length} item(s) moved to trash`);
    }
    setFilesToDelete([]);
  };

  const handleToggleStar = (ids: string[]) => {
    const updatedFiles = files.map(f => {
      if (ids.includes(f.id)) {
        return { ...f, starred: !f.starred };
      }
      return f;
    });
    setFiles(updatedFiles);
    toast.success(ids.length === 1 ? 'Star updated' : 'Stars updated');
  };

  const handleUpload = (fileList: FileList) => {
    const newFiles: FileItem[] = Array.from(fileList).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
      size: file.size,
      path: currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`,
      parentId: files.find(f => f.path === currentPath)?.id || null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: { state: 'syncing', progress: 0 },
      version: 1,
      owner: 'You',
      hash: `hash-${Date.now()}-${Math.random()}`,
    }));
    
    setFiles([...files, ...newFiles]);
    toast.success(`${fileList.length} file(s) uploaded`);
    
    setTimeout(() => {
        setFiles(prev => prev.map(f => {
            if (newFiles.find(nf => nf.id === f.id)) {
                return { ...f, syncStatus: { state: 'synced', progress: 100 } };
            }
            return f;
        }));
        toast.success('Upload complete');
    }, 2000);
  };

  // --- Tag Management ---
  const handleCreateTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = { ...tag, id: `t${Date.now()}` };
    setTags([...tags, newTag]);
    toast.success(`Tag "${tag.name}" created`);
  };

  const handleUpdateTag = (id: string, updates: Partial<Tag>) => {
    setTags(tags.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Tag updated');
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
    setFiles(files.map(f => ({ ...f, tags: f.tags.filter(t => t !== id) })));
    toast.success('Tag deleted');
  };

  const handleAddTagToFile = (fileId: string, tagId: string) => {
    setFiles(files.map(f =>
      f.id === fileId ? { ...f, tags: [...f.tags, tagId] } : f
    ));
    toast.success('Tag added');
  };

  const handleRemoveTagFromFile = (fileId: string, tagId: string) => {
    setFiles(files.map(f =>
      f.id === fileId ? { ...f, tags: f.tags.filter(t => t !== tagId) } : f
    ));
    toast.success('Tag removed');
  };

  // --- Smart Collections ---
  const handleCreateCollection = (collection: Omit<SmartCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCollection: SmartCollection = {
      ...collection,
      id: `col-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCollections([...collections, newCollection]);
    toast.success(`Collection "${collection.name}" created`);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
    toast.success('Collection deleted');
  };

  const handleSelectCollection = (id: string) => {
    setActiveSidebarItem(`collection-${id}`);
    setShowSmartCollections(false);
  };

  // --- Version History ---
  const handleRestoreVersion = (versionId: string) => {
    toast.success(`Version ${versionId} restored`);
  };

  const handleDownloadVersion = (versionId: string) => {
    toast.success(`Downloading version ${versionId}`);
  };

  // --- Storage Analytics ---
  const handleCleanDuplicates = () => {
    const duplicates = files.filter(f => f.duplicateOf);
    setFiles(files.filter(f => !f.duplicateOf));
    toast.success(`${duplicates.length} duplicate(s) removed`);
    setShowStorageAnalytics(false);
  };

  const handleArchiveOld = () => {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oldFiles = files.filter(f => f.updatedAt < ninetyDaysAgo && !f.trashed);
    toast.success(`${oldFiles.length} old file(s) archived`);
    setShowStorageAnalytics(false);
  };

  // --- Context Menu Actions ---
  const handleContextMenuAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case 'open':
        if (file.type === 'folder') setCurrentPath(file.path);
        break;
      case 'download':
        toast.success('Download started');
        break;
      case 'share':
        setFileToShare(file);
        setShareOpen(true);
        break;
      case 'rename':
        setFileToRename(file);
        setRenameOpen(true);
        break;
      case 'delete':
        setFilesToDelete([fileId]);
        setDeleteOpen(true);
        break;
      case 'star':
        handleToggleStar([fileId]);
        break;
      case 'add-tag':
        setShowTagManager(true);
        break;
      case 'offline':
        setFiles(files.map(f => f.id === fileId ? { ...f, offlineAvailable: !f.offlineAvailable } : f));
        toast.success(file.offlineAvailable ? 'Removed from offline' : 'Made available offline');
        break;
      case 'versions':
        setFileForVersionHistory(file);
        setShowVersionHistory(true);
        break;
      case 'details':
        setSelectedFileForDetails(file);
        setShowDetailsPanel(true);
        break;
      case 'security':
        setFileForSecurity(file);
        setShowSecurityPanel(true);
        break;
    }
  };

  // --- Security ---
  const handleUpdateSecurity = (fileId: string, settings: SecuritySettings) => {
    setFiles(files.map(f =>
      f.id === fileId
        ? {
            ...f,
            encrypted: settings.encrypted,
            encryptionType: settings.encryptionType,
          }
        : f
    ));
    toast.success('Security settings updated');
  };

  // --- Offline Management ---
  const handleToggleOffline = (fileId: string) => {
    setFiles(files.map(f =>
      f.id === fileId ? { ...f, offlineAvailable: !f.offlineAvailable } : f
    ));
  };

  const handleRemoveOffline = (fileIds: string[]) => {
    setFiles(files.map(f =>
      fileIds.includes(f.id) ? { ...f, offlineAvailable: false } : f
    ));
    toast.success(`${fileIds.length} file(s) removed from offline`);
  };

  // --- Navigation & Filter Logic ---

  const handleSidebarNavigate = (id: string) => {
    setActiveSidebarItem(id);
    if (id === 'my-drive') setCurrentPath('/');
    else if (id === 'sync-inspector') setShowSyncInspector(true);
    else if (id === 'analytics') setShowStorageAnalytics(true);
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setActiveFilters(filters);
    setSearchQuery(filters.query);
  };

  const filteredFiles = useMemo(() => {
    let filtered = files;

    // Advanced filters
    if (activeFilters) {
      if (activeFilters.fileTypes.length > 0) {
        filtered = filtered.filter(f => activeFilters.fileTypes.includes(f.type));
      }
      if (activeFilters.tags.length > 0) {
        filtered = filtered.filter(f => f.tags.some(t => activeFilters.tags.includes(t)));
      }
      if (activeFilters.starred) {
        filtered = filtered.filter(f => f.starred);
      }
      if (activeFilters.minSize) {
        filtered = filtered.filter(f => f.size >= (activeFilters.minSize || 0));
      }
      if (activeFilters.maxSize) {
        filtered = filtered.filter(f => f.size <= (activeFilters.maxSize || Infinity));
      }
      if (activeFilters.dateRange.start) {
        filtered = filtered.filter(f => f.updatedAt >= (activeFilters.dateRange.start || new Date(0)));
      }
      if (activeFilters.dateRange.end) {
        filtered = filtered.filter(f => f.updatedAt <= (activeFilters.dateRange.end || new Date()));
      }
    }

    // Search Filtering
    if (searchQuery.trim()) {
        filtered = filtered.filter(f => !f.trashed && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return filtered;
    }

    // Global filters based on sidebar
    if (activeSidebarItem === 'trash') {
        return filtered.filter(f => f.trashed);
    }
    
    filtered = filtered.filter(f => !f.trashed);

    if (activeSidebarItem === 'starred') {
        return filtered.filter(f => f.starred);
    }
    if (activeSidebarItem === 'recent') {
        return [...filtered].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    if (activeSidebarItem === 'shared') {
        return filtered.filter(f => f.shared);
    }

    return filtered;

  }, [files, activeSidebarItem, searchQuery, activeFilters]);

  const isFlatView = activeSidebarItem !== 'my-drive' || !!searchQuery;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar - Hidden on small screens */}
      <div className="hidden md:flex">
        <Sidebar 
          activeItem={activeSidebarItem} 
          onNavigate={handleSidebarNavigate}
          isPowerMode={isPowerMode}
          onCreateFolder={() => setCreateFolderOpen(true)}
          onUploadFile={() => setUploadOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <Header 
          isPowerMode={isPowerMode} 
          onToggleMode={() => setIsPowerMode(!isPowerMode)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Feature Buttons in Power Mode */}
        {isPowerMode && (
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setShowTagManager(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              🏷️ Manage Tags
            </button>
            <button
              onClick={() => setShowSmartCollections(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              ✨ Smart Collections
            </button>
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              🔍 Advanced Search
            </button>
            <button
              onClick={() => setShowOfflineManager(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              📥 Offline Files
            </button>
          </div>
        )}
        
        <div className="flex-1 flex overflow-hidden relative">
          <FileExplorer 
            files={filteredFiles} 
            currentPath={isFlatView ? '' : currentPath} 
            onNavigate={setCurrentPath}
            isPowerMode={isPowerMode}
            onDelete={(ids) => { setFilesToDelete(ids); setDeleteOpen(true); }}
            onRename={(id) => { setFileToRename(files.find(f => f.id === id) || null); setRenameOpen(true); }}
            onShare={(id) => { setFileToShare(files.find(f => f.id === id) || null); setShareOpen(true); }}
            onToggleStar={handleToggleStar}
            onDownload={(id) => toast.success('Download started')}
            onContextMenu={(file, x, y) => setContextMenu({ file, x, y })}
          />
          
          <AnimatePresence>
            {(showSyncInspector || (isPowerMode && activeSidebarItem === 'sync-inspector')) && (
               <motion.div
                 initial={{ x: 320, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 320, opacity: 0 }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 className="absolute right-0 top-0 bottom-0 h-full z-20 shadow-2xl"
               >
                 <SyncInspector 
                    files={files} 
                    onClose={() => {
                        setShowSyncInspector(false);
                        if (activeSidebarItem === 'sync-inspector') setActiveSidebarItem('my-drive');
                    }} 
                 />
               </motion.div>
            )}

            {showDetailsPanel && selectedFileForDetails && (
              <DetailsPanel
                file={selectedFileForDetails}
                tags={tags}
                onClose={() => setShowDetailsPanel(false)}
                onAddTag={handleAddTagToFile}
                onRemoveTag={handleRemoveTagFromFile}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <CreateFolderModal 
        isOpen={createFolderOpen} 
        onClose={() => setCreateFolderOpen(false)} 
        onCreate={handleCreateFolder} 
      />
      
      <RenameModal 
        isOpen={renameOpen} 
        onClose={() => setRenameOpen(false)} 
        onRename={handleRename} 
        currentName={fileToRename?.name || ''} 
      />
      
      <ConfirmDeleteModal 
        isOpen={deleteOpen} 
        onClose={() => setDeleteOpen(false)} 
        onConfirm={handleDelete} 
        itemCount={filesToDelete.length} 
      />
      
      <ShareModal 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
        file={fileToShare || undefined} 
      />
      
      <UploadModal 
        isOpen={uploadOpen} 
        onClose={() => setUploadOpen(false)} 
        onUpload={handleUpload} 
      />

      <AnimatePresence>
        {showTagManager && (
          <TagManager
            tags={tags}
            onCreateTag={handleCreateTag}
            onUpdateTag={handleUpdateTag}
            onDeleteTag={handleDeleteTag}
            onClose={() => setShowTagManager(false)}
          />
        )}

        {showSmartCollections && (
          <SmartCollections
            collections={collections}
            files={files}
            onCreateCollection={handleCreateCollection}
            onDeleteCollection={handleDeleteCollection}
            onSelectCollection={handleSelectCollection}
            onClose={() => setShowSmartCollections(false)}
          />
        )}

        {showVersionHistory && fileForVersionHistory && (
          <VersionHistory
            file={fileForVersionHistory}
            onRestore={handleRestoreVersion}
            onDownloadVersion={handleDownloadVersion}
            onClose={() => setShowVersionHistory(false)}
          />
        )}

        {showStorageAnalytics && (
          <StorageAnalytics
            files={files}
            onClose={() => setShowStorageAnalytics(false)}
            onCleanDuplicates={handleCleanDuplicates}
            onArchiveOld={handleArchiveOld}
          />
        )}

        {showAdvancedSearch && (
          <AdvancedSearch
            tags={tags}
            onSearch={handleAdvancedSearch}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}

        {showSecurityPanel && fileForSecurity && (
          <SecurityPanel
            file={fileForSecurity}
            onUpdateSecurity={handleUpdateSecurity}
            onClose={() => setShowSecurityPanel(false)}
          />
        )}

        {showOfflineManager && (
          <OfflineManager
            files={files}
            onToggleOffline={handleToggleOffline}
            onRemoveOffline={handleRemoveOffline}
            onClose={() => setShowOfflineManager(false)}
          />
        )}

        {contextMenu && (
          <ContextMenu
            file={contextMenu.file}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onClose={() => setContextMenu(null)}
            onAction={handleContextMenuAction}
          />
        )}
      </AnimatePresence>

      <TourOverlay 
        isOpen={showTour} 
        onComplete={() => { setShowTour(false); completeOnboarding(); }} 
        onDismiss={() => { setShowTour(false); completeOnboarding(); }} 
      />

      <InstallPrompt />
    </div>
  );
}