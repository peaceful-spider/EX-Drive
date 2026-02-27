import React, { useState, useMemo } from 'react';
import { CloudOff, HardDrive, Trash2, Download, CheckCircle2, X, Wifi, WifiOff } from 'lucide-react';
import { FileItem } from '../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface OfflineManagerProps {
  files: FileItem[];
  onToggleOffline: (fileId: string) => void;
  onRemoveOffline: (fileIds: string[]) => void;
  onClose: () => void;
}

export function OfflineManager({ files, onToggleOffline, onRemoveOffline, onClose }: OfflineManagerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen to online/offline events
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const offlineFiles = useMemo(() => {
    return files.filter(f => f.offlineAvailable && !f.trashed);
  }, [files]);

  const stats = useMemo(() => {
    const totalSize = offlineFiles.reduce((acc, f) => acc + f.size, 0);
    const fileCount = offlineFiles.length;
    const folderCount = offlineFiles.filter(f => f.type === 'folder').length;
    
    return { totalSize, fileCount, folderCount };
  }, [offlineFiles]);

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelectAll = () => {
    if (selectedIds.size === offlineFiles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(offlineFiles.map(f => f.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleRemoveSelected = () => {
    onRemoveOffline(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <CloudOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Offline Files</h2>
              <p className="text-sm text-slate-500">Manage files available offline</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
              isOnline ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.fileCount}</div>
              <div className="text-xs text-slate-600">Files Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{formatSize(stats.totalSize)}</div>
              <div className="text-xs text-slate-600">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.folderCount}</div>
              <div className="text-xs text-slate-600">Folders Synced</div>
            </div>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedIds.size} file{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleRemoveSelected}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove from Offline
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {offlineFiles.length === 0 ? (
            <div className="text-center py-12">
              <CloudOff className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Offline Files</h3>
              <p className="text-sm text-slate-600 mb-4">
                Mark files as available offline to access them without internet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {selectedIds.size === offlineFiles.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {offlineFiles.map(file => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center gap-4 p-4 border-2 rounded-xl transition-all cursor-pointer hover:shadow-md",
                    selectedIds.has(file.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                  onClick={() => handleToggleSelect(file.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(file.id)}
                    onChange={() => handleToggleSelect(file.id)}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 text-blue-500 rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 truncate">{file.name}</h3>
                      {file.syncStatus.state === 'synced' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="capitalize">{file.type}</span>
                      <span>•</span>
                      <span>{formatSize(file.size)}</span>
                      <span>•</span>
                      <span>Last synced {format(file.syncStatus.lastSynced || file.updatedAt, 'MMM d, h:mm a')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.syncStatus.state === 'syncing' && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${file.syncStatus.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-10">{file.syncStatus.progress}%</span>
                      </div>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleOffline(file.id);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                      title="Remove from offline"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isOnline && offlineFiles.length > 0 && (
          <div className="p-4 bg-orange-50 border-t border-orange-200">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 text-sm">You're Offline</h4>
                <p className="text-xs text-orange-700">
                  You can still access these {offlineFiles.length} files. Changes will sync when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
