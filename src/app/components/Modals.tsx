import React, { useState } from 'react';
import { Modal } from './Modal';
import { FileItem } from '../types';
import { Folder, Upload, Trash2, Edit2, Share2, Check } from 'lucide-react';

// --- CREATE FOLDER MODAL ---
interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateFolderModal({ isOpen, onClose, onCreate }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName);
      setFolderName('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
      width="max-w-sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
            Create
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="folderName" className="block text-sm font-medium text-slate-700 mb-1">
            Folder Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Folder className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="folderName"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="e.g. My Projects"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

// --- RENAME MODAL ---
interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export function RenameModal({ isOpen, onClose, onRename, currentName }: RenameModalProps) {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== currentName) {
      onRename(newName);
      onClose();
    }
  };

  React.useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rename Item"
      width="max-w-sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
            Rename
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="renameField" className="block text-sm font-medium text-slate-700 mb-1">
            New Name
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Edit2 className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="renameField"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

// --- CONFIRM DELETE MODAL ---
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemCount }: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${itemCount > 1 ? `${itemCount} items` : 'Item'}?`}
      width="max-w-sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </>
      }
    >
      <div className="text-sm text-slate-600 flex flex-col items-center text-center gap-4 py-2">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <Trash2 className="w-6 h-6" />
        </div>
        <p>
            Are you sure you want to move {itemCount > 1 ? `these ${itemCount} items` : 'this item'} to Trash? 
            You can restore them later.
        </p>
      </div>
    </Modal>
  );
}

// --- SHARE MODAL ---
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file?: FileItem;
}

export function ShareModal({ isOpen, onClose, file }: ShareModalProps) {
    const [email, setEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [role, setRole] = useState<'viewer' | 'commenter' | 'editor'>('viewer');
    const [allowDownload, setAllowDownload] = useState(true);
    const [allowCopy, setAllowCopy] = useState(true);
    const [watermark, setWatermark] = useState(false);
    const [expiryDays, setExpiryDays] = useState<number | ''>('');
    const [maxViews, setMaxViews] = useState<number | ''>('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://elgorax.com/s/${file?.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        // In real app, this would call an API
        console.log('Sharing with:', {
            email,
            role,
            allowDownload,
            allowCopy,
            watermark,
            expiryDays,
            maxViews
        });
        setEmail('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Share "${file?.name}"`}
            width="max-w-2xl"
            footer={
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                    Done
                </button>
            }
        >
            <div className="space-y-6">
                {/* Add People Section */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Add people</label>
                    <div className="flex gap-2 mb-3">
                        <input 
                            type="email" 
                            placeholder="Enter email address" 
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value as any)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="commenter">Commenter</option>
                            <option value="editor">Editor</option>
                        </select>
                        <button 
                            onClick={handleShare}
                            disabled={!email.trim()}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                        {showAdvanced ? '− Hide' : '+ Show'} advanced options
                    </button>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-2">Expires after (days)</label>
                                    <input
                                        type="number"
                                        value={expiryDays}
                                        onChange={e => setExpiryDays(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="Never"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-2">Max views</label>
                                    <input
                                        type="number"
                                        value={maxViews}
                                        onChange={e => setMaxViews(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="Unlimited"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={allowDownload}
                                        onChange={e => setAllowDownload(e.target.checked)}
                                        className="w-4 h-4 text-blue-500 rounded"
                                    />
                                    <span className="text-sm text-slate-700">Allow download</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={allowCopy}
                                        onChange={e => setAllowCopy(e.target.checked)}
                                        className="w-4 h-4 text-blue-500 rounded"
                                    />
                                    <span className="text-sm text-slate-700">Allow copy</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={watermark}
                                        onChange={e => setWatermark(e.target.checked)}
                                        className="w-4 h-4 text-blue-500 rounded"
                                    />
                                    <span className="text-sm text-slate-700">Apply watermark to preview</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Copy Link Section */}
                <div className="pt-4 border-t border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Share link</label>
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <Share2 className="w-4 h-4" />
                            </div>
                            <div className="text-xs text-slate-500 truncate font-mono">
                                https://elgorax.com/s/{file?.id}
                            </div>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-2"
                        >
                            {copied ? <><Check className="w-3 h-3" /> Copied</> : 'Copy'}
                        </button>
                    </div>
                </div>
                
                {/* Who Has Access */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Who has access</label>
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">EX</div>
                            <div>
                                <div className="text-sm font-medium text-slate-800">You</div>
                                <div className="text-xs text-slate-500">Owner</div>
                            </div>
                        </div>
                    </div>
                    {file?.shared && (
                        <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-2">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800">John Doe</div>
                                    <div className="text-xs text-slate-500">john@example.com • Editor</div>
                                </div>
                            </div>
                             <select className="text-xs text-slate-500 border border-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                <option>Editor</option>
                                <option>Commenter</option>
                                <option>Viewer</option>
                                <option>Remove</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Share Analytics (if file is shared) */}
                {file?.shared && (
                    <div className="pt-4 border-t border-slate-200">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Analytics</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-2xl font-bold text-blue-700">24</div>
                                <div className="text-xs text-blue-600">Total views</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-700">7</div>
                                <div className="text-xs text-green-600">Downloads</div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-2xl font-bold text-purple-700">3</div>
                                <div className="text-xs text-purple-600">Shared with</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

// --- UPLOAD FILE MODAL ---
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
            onClose();
        }
    };

    return (
        <Modal
             isOpen={isOpen}
             onClose={onClose}
             title="Upload Files"
             width="max-w-md"
        >
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}
            >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                    <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-1">Click to upload</h3>
                <p className="text-sm text-slate-500 mb-4">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Browse files
                </button>
            </div>
        </Modal>
    );
}