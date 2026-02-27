import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Archive, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Share2,
  Trash,
  Info,
  ChevronRight,
  List as ListIcon,
  Grid as GridIcon,
  ArrowUp,
  ArrowDown,
  Monitor,
  Edit2,
  Star,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { FileItem, ViewMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FileExplorerProps {
  files: FileItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  isPowerMode: boolean;
  onDelete: (ids: string[]) => void;
  onRename: (id: string) => void;
  onShare: (id: string) => void;
  onToggleStar: (ids: string[]) => void;
  onDownload: (id: string) => void;
  onContextMenu?: (file: FileItem, x: number, y: number) => void;
}

export function FileExplorer({ 
    files, 
    currentPath, 
    onNavigate, 
    isPowerMode,
    onDelete,
    onRename,
    onShare,
    onToggleStar,
    onDownload,
    onContextMenu
}: FileExplorerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(isPowerMode ? 'list' : 'grid');
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: keyof FileItem; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  // Update view mode when power mode changes, but allow override
  React.useEffect(() => {
    setViewMode(isPowerMode ? 'list' : 'grid');
  }, [isPowerMode]);

  const currentFolder = useMemo(() => {
     return files.find(f => f.path === currentPath);
  }, [files, currentPath]);

  const displayedFiles = useMemo(() => {
    let filtered = [];
    
    // If path is empty string, show all files (flat view for Search, Starred, Recent)
    if (currentPath === '') {
        filtered = files;
    } 
    // If root, show top level items
    else if (currentPath === '/') {
       filtered = files.filter(f => f.parentId === null);
    } else {
       const parent = files.find(f => f.path === currentPath);
       if (parent) {
         filtered = files.filter(f => f.parentId === parent.id);
       }
    }
    
    return filtered.sort((a, b) => {
      // Folders first
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [files, currentPath, sortConfig]);

  const handleSort = (key: keyof FileItem) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="text-blue-500 fill-blue-500/20" />;
      case 'image': return <ImageIcon className="text-purple-500" />;
      case 'video': return <Film className="text-red-500" />;
      case 'audio': return <Music className="text-yellow-500" />;
      case 'archive': return <Archive className="text-orange-500" />;
      default: return <FileText className="text-slate-500" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '--';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const breadcrumbs = useMemo(() => {
      if (currentPath === '/' || currentPath === '') return [{ name: 'My Drive', path: '/' }];
      const parts = currentPath.split('/').filter(Boolean);
      let pathAccumulator = '';
      const crumbs = parts.map(part => {
          pathAccumulator += `/${part}`;
          return { name: part, path: pathAccumulator };
      });
      return [{ name: 'My Drive', path: '/' }, ...crumbs];
  }, [currentPath]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      {/* Selection Toolbar */}
      <AnimatePresence>
        {selectedFileIds.size > 0 && (
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-4"
            >
                <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                    <span className="font-medium text-sm">{selectedFileIds.size} selected</span>
                    <button onClick={() => setSelectedFileIds(new Set())} className="p-1 hover:bg-slate-800 rounded-full">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => onToggleStar(Array.from(selectedFileIds))} className="p-2 hover:bg-slate-800 rounded-full" title="Star">
                        <Star className="w-4 h-4" />
                    </button>
                    {selectedFileIds.size === 1 && (
                        <button onClick={() => onRename(Array.from(selectedFileIds)[0])} className="p-2 hover:bg-slate-800 rounded-full" title="Rename">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                     {selectedFileIds.size === 1 && (
                        <button onClick={() => onShare(Array.from(selectedFileIds)[0])} className="p-2 hover:bg-slate-800 rounded-full" title="Share">
                            <Share2 className="w-4 h-4" />
                        </button>
                    )}
                     {selectedFileIds.size === 1 && (
                        <button onClick={() => onDownload(Array.from(selectedFileIds)[0])} className="p-2 hover:bg-slate-800 rounded-full" title="Download">
                            <Download className="w-4 h-4" />
                        </button>
                    )}
                    <button onClick={() => { onDelete(Array.from(selectedFileIds)); setSelectedFileIds(new Set()); }} className="p-2 hover:bg-red-900/50 text-red-400 rounded-full" title="Delete">
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade">
           {breadcrumbs.map((crumb, index) => (
               <div key={crumb.path} className="flex items-center gap-2">
                   {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                   <button 
                    onClick={() => onNavigate(crumb.path)}
                    className={cn(
                        "text-sm font-medium whitespace-nowrap px-2 py-1 rounded hover:bg-slate-100 transition-colors",
                        index === breadcrumbs.length - 1 ? "text-slate-900" : "text-slate-500"
                    )}
                   >
                       {crumb.name}
                   </button>
               </div>
           ))}
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded transition-colors", viewMode === 'grid' ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600")}
            >
                <GridIcon className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded transition-colors", viewMode === 'list' ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600")}
            >
                <ListIcon className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* File Area */}
      <div id="tour-file-list" className="flex-1 overflow-y-auto p-4" onClick={() => setSelectedFileIds(new Set())}>
        {viewMode === 'grid' ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
                 {displayedFiles.map(file => (
                     <div 
                        key={file.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            const isMobile = window.innerWidth < 768;
                            
                            if (isMobile && file.type === 'folder') {
                                onNavigate(file.path);
                                return;
                            }

                            const newSet = new Set(selectedFileIds);
                            if (e.metaKey || e.ctrlKey) {
                                if (newSet.has(file.id)) newSet.delete(file.id);
                                else newSet.add(file.id);
                            } else {
                                newSet.clear();
                                newSet.add(file.id);
                            }
                            setSelectedFileIds(newSet);
                        }}
                        onDoubleClick={(e) => {
                             e.stopPropagation();
                             if (file.type === 'folder') {
                                onNavigate(file.path);
                             }
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onContextMenu) {
                                onContextMenu(file, e.clientX, e.clientY);
                            }
                        }}
                        className={cn(
                            "group relative flex flex-col p-3 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer select-none",
                            selectedFileIds.has(file.id) 
                                ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100" 
                                : "bg-white border-slate-200 hover:border-blue-200"
                        )}
                     >
                         <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                             {file.type === 'image' ? (
                                 <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400">
                                     <ImageIcon className="w-8 h-8 opacity-50" />
                                 </div>
                             ) : (
                                <div className="transform transition-transform group-hover:scale-110 duration-300">
                                    {React.cloneElement(getFileIcon(file.type) as React.ReactElement, { className: "w-12 h-12" })}
                                </div>
                             )}
                             
                             {/* Sync Status Badge */}
                             <div className="absolute top-2 right-2">
                                 {file.syncStatus.state === 'synced' && <CheckCircle2 className="w-4 h-4 text-green-500 fill-white" />}
                                 {file.syncStatus.state === 'syncing' && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                                 {file.syncStatus.state === 'error' && <AlertCircle className="w-4 h-4 text-red-500 fill-white" />}
                             </div>

                             {file.starred && (
                                 <div className="absolute top-2 left-2">
                                     <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                 </div>
                             )}
                         </div>
                         
                         <div className="flex items-start justify-between gap-2">
                             <div className="min-w-0">
                                 <h3 className="text-sm font-medium text-slate-700 truncate" title={file.name}>{file.name}</h3>
                                 <p className="text-xs text-slate-400 mt-0.5">{file.type === 'folder' ? format(file.updatedAt, 'MMM d, yyyy') : formatSize(file.size)}</p>
                             </div>
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newSet = new Set();
                                    newSet.add(file.id);
                                    setSelectedFileIds(newSet);
                                    // Could open a context menu here
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-opacity"
                            >
                                 <MoreVertical className="w-4 h-4 text-slate-400" />
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
        ) : (
            <div className="min-w-full inline-block align-middle pb-20">
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                                </th>
                                {isPowerMode && (
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                        Tags
                                    </th>
                                )}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 hidden sm:table-cell" onClick={() => handleSort('updatedAt')}>
                                    <div className="flex items-center gap-1">Date Modified {sortConfig.key === 'updatedAt' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-slate-100" onClick={() => handleSort('size')}>
                                    <div className="flex items-center gap-1">Size {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                                </th>
                                {isPowerMode && (
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                                        Path (Unix)
                                    </th>
                                )}
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {displayedFiles.map((file) => (
                                <tr 
                                    key={file.id} 
                                    className={cn(
                                        "hover:bg-slate-50 transition-colors cursor-pointer select-none",
                                        selectedFileIds.has(file.id) ? "bg-blue-50/50" : ""
                                    )}
                                    onClick={(e) => {
                                        const isMobile = window.innerWidth < 768;
                                        if (isMobile && file.type === 'folder') {
                                            onNavigate(file.path);
                                            return;
                                        }
                                        const newSet = new Set();
                                        newSet.add(file.id);
                                        setSelectedFileIds(newSet);
                                    }}
                                    onDoubleClick={(e) => {
                                         if (file.type === 'folder') {
                                            onNavigate(file.path);
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center relative">
                                                {React.cloneElement(getFileIcon(file.type) as React.ReactElement, { className: "w-5 h-5" })}
                                                {file.starred && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{file.name}</div>
                                                {isPowerMode && file.syncStatus.device && (
                                                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <Monitor className="w-3 h-3" />
                                                        Synced from {file.syncStatus.device}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    {isPowerMode && (
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {file.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                                        {format(file.updatedAt, isPowerMode ? 'yyyy-MM-dd HH:mm:ss' : 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden md:table-cell font-mono">
                                        {formatSize(file.size)}
                                    </td>
                                    {isPowerMode && (
                                         <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono hidden lg:table-cell">
                                            {file.path}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); onShare(file.id); }} className="p-1 text-slate-400 hover:text-blue-600" title="Share"><Share2 className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onDownload(file.id); }} className="p-1 text-slate-400 hover:text-blue-600" title="Download"><Download className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onDelete([file.id]); }} className="p-1 text-slate-400 hover:text-red-600" title="Delete"><Trash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}