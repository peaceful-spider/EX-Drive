export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'folder';

export interface Tag {
  id: string;
  name: string;
  color: string;
  parentId?: string; // For hierarchical tags
}

export interface SyncStatus {
  state: 'synced' | 'syncing' | 'pending' | 'error' | 'offline';
  progress: number; // 0-100
  lastSynced?: Date;
  error?: string;
  device?: string;
}

export interface SharePermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'viewer' | 'commenter' | 'editor';
  expiresAt?: Date;
  allowDownload: boolean;
  allowCopy: boolean;
  watermark: boolean;
  deviceRestricted?: string[]; // Device IDs
  locationRestricted?: string[]; // IP ranges
  maxViews?: number;
  currentViews: number;
  createdAt: Date;
}

export interface ShareAnalytics {
  fileId: string;
  views: Array<{
    userId: string;
    userName: string;
    timestamp: Date;
    device: string;
    location: string;
    ipAddress: string;
    duration: number; // seconds
  }>;
  downloads: Array<{
    userId: string;
    userName: string;
    timestamp: Date;
    device: string;
  }>;
}

export interface FileVersion {
  id: string;
  fileId: string;
  version: number;
  size: number;
  createdAt: Date;
  createdBy: string;
  comment?: string;
  changes?: string;
  hash: string;
}

export interface SmartCollection {
  id: string;
  name: string;
  icon: string;
  color: string;
  rules: CollectionRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionRule {
  id: string;
  field: 'type' | 'size' | 'date' | 'tags' | 'name' | 'extension' | 'starred' | 'shared';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'before' | 'after';
  value: string | number | string[];
  conjunction?: 'AND' | 'OR';
}

export interface ActivityLog {
  id: string;
  fileId: string;
  action: 'created' | 'modified' | 'renamed' | 'moved' | 'deleted' | 'shared' | 'downloaded' | 'viewed' | 'restored';
  userId: string;
  userName: string;
  timestamp: Date;
  device: string;
  location?: string;
  details?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  path: string; // Unix-style path
  parentId: string | null;
  tags: string[]; // Tag IDs
  createdAt: Date;
  updatedAt: Date;
  syncStatus: SyncStatus;
  version: number;
  shared?: boolean;
  starred?: boolean;
  trashed?: boolean;
  content?: string; // For text files or preview URL
  encrypted?: boolean;
  encryptionType?: 'client' | 'server' | 'zero-knowledge';
  offlineAvailable?: boolean;
  owner: string;
  sharedWith?: SharePermission[];
  versions?: FileVersion[];
  activity?: ActivityLog[];
  hash?: string; // For duplicate detection
  duplicateOf?: string; // If this is a duplicate
}

export type ViewMode = 'simple' | 'power';