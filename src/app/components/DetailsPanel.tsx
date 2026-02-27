import React, { useState } from 'react';
import { X, FileText, Clock, Shield, Users, Activity, Eye, Download, MapPin, Monitor, Calendar, Tag as TagIcon, Star } from 'lucide-react';
import { FileItem, Tag } from '../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface DetailsPanelProps {
  file: FileItem | null;
  tags: Tag[];
  onClose: () => void;
  onAddTag: (fileId: string, tagId: string) => void;
  onRemoveTag: (fileId: string, tagId: string) => void;
}

type TabType = 'details' | 'activity' | 'versions' | 'security' | 'sharing';

export function DetailsPanel({ file, tags, onClose, onAddTag, onRemoveTag }: DetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');

  if (!file) return null;

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mock activity data
  const activities = file.activity || [
    { id: '1', fileId: file.id, action: 'modified', userId: '1', userName: 'You', timestamp: file.updatedAt, device: 'MacBook Pro', location: 'San Francisco, CA' },
    { id: '2', fileId: file.id, action: 'shared', userId: '2', userName: 'Sarah Chen', timestamp: new Date(file.updatedAt.getTime() - 86400000), device: 'iPhone 15', location: 'New York, NY' },
    { id: '3', fileId: file.id, action: 'viewed', userId: '3', userName: 'John Smith', timestamp: new Date(file.updatedAt.getTime() - 172800000), device: 'Windows PC', location: 'London, UK' },
  ];

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'versions', label: 'Versions', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'sharing', label: 'Sharing', icon: Users },
  ] as const;

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">{file.name}</h2>
            <p className="text-xs text-slate-500 mt-1">
              {file.type === 'folder' ? 'Folder' : formatSize(file.size)}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1",
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-3 h-3" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'details' && (
          <>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">File Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Type</span>
                  <span className="font-medium text-slate-900 capitalize">{file.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Size</span>
                  <span className="font-medium text-slate-900">{formatSize(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Version</span>
                  <span className="font-medium text-slate-900">v{file.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Starred</span>
                  <Star className={cn("w-4 h-4", file.starred ? "text-yellow-400 fill-yellow-400" : "text-slate-300")} />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Dates</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">Created</div>
                    <div className="font-medium text-slate-900">{format(file.createdAt, 'MMM d, yyyy h:mm a')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">Modified</div>
                    <div className="font-medium text-slate-900">{format(file.updatedAt, 'MMM d, yyyy h:mm a')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {file.tags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1 group"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag.name}
                      <button
                        onClick={() => onRemoveTag(file.id, tag.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {file.tags.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No tags</span>
                )}
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Location</h3>
              <div className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all">
                {file.path}
              </div>
            </div>

            {file.syncStatus.device && (
              <>
                <div className="h-px bg-slate-200" />
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Sync Info</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{file.syncStatus.device}</span>
                  </div>
                  {file.syncStatus.lastSynced && (
                    <p className="text-xs text-slate-500 mt-1">
                      Last synced {format(file.syncStatus.lastSynced, 'MMM d, h:mm a')}
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase">Activity Timeline</h3>
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 pb-4">
                {index !== activities.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-px bg-slate-200" />
                )}
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{activity.userName}</span>
                    <span className="text-slate-600 capitalize">{activity.action}</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(activity.timestamp, 'MMM d, h:mm a')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Monitor className="w-3 h-3" />
                      {activity.device}
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase">Version History</h3>
            {[3, 2, 1].map(v => (
              <div key={v} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-900">Version {v}</span>
                  {v === file.version && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  {v === 3 ? 'Final revisions' : v === 2 ? 'Peer review incorporated' : 'Initial draft'}
                </p>
                <div className="text-xs text-slate-500">
                  {format(new Date(file.updatedAt.getTime() - (3 - v) * 86400000), 'MMM d, h:mm a')}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Encryption</h3>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Status</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    file.encrypted ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                  )}>
                    {file.encrypted ? 'Encrypted' : 'Not Encrypted'}
                  </span>
                </div>
                {file.encrypted && file.encryptionType && (
                  <div className="text-xs text-slate-600">
                    Type: <span className="font-medium capitalize">{file.encryptionType}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">File Integrity</h3>
              <div className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all">
                {file.hash || 'abc123def456...'}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Access Controls</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-slate-600">Download</span>
                  <span className="text-green-600 font-medium">Allowed</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-slate-600">Copy</span>
                  <span className="text-green-600 font-medium">Allowed</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-slate-600">Sharing</span>
                  <span className="text-slate-600 font-medium">Owner Only</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sharing' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Shared With</h3>
              {file.sharedWith && file.sharedWith.length > 0 ? (
                <div className="space-y-2">
                  {file.sharedWith.map(permission => (
                    <div key={permission.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {permission.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">{permission.userName}</div>
                          <div className="text-xs text-slate-500 truncate">{permission.userEmail}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 capitalize">{permission.role}</span>
                        {permission.expiresAt && (
                          <span className="text-orange-600">
                            Expires {format(permission.expiresAt, 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">Not shared with anyone</p>
                </div>
              )}
            </div>

            {file.shared && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Share Analytics</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900">Views</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">24</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Download className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-900">Downloads</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">7</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
