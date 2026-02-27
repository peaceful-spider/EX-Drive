import React, { useEffect, useRef } from 'react';
import { 
  Download, Share2, Trash2, Star, Edit2, Copy, Scissors, 
  FolderInput, Eye, Info, Clock, Lock, Tag, CloudOff
} from 'lucide-react';
import { FileItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ContextMenuProps {
  file: FileItem;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string, fileId: string) => void;
}

export function ContextMenu({ file, position, onClose, onAction }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    { 
      id: 'open', 
      label: 'Open', 
      icon: Eye, 
      shortcut: '⏎',
      show: true 
    },
    { 
      id: 'download', 
      label: 'Download', 
      icon: Download, 
      shortcut: '⌘D',
      show: file.type !== 'folder' 
    },
    { type: 'separator', show: true },
    { 
      id: 'share', 
      label: 'Share', 
      icon: Share2, 
      shortcut: '⌘⇧S',
      show: true 
    },
    { 
      id: 'copy-link', 
      label: 'Copy Link', 
      icon: Copy,
      show: file.shared 
    },
    { type: 'separator', show: true },
    { 
      id: 'rename', 
      label: 'Rename', 
      icon: Edit2, 
      shortcut: 'F2',
      show: true 
    },
    { 
      id: 'move', 
      label: 'Move to...', 
      icon: FolderInput,
      show: true 
    },
    { 
      id: 'copy', 
      label: 'Make a copy', 
      icon: Copy,
      show: file.type !== 'folder' 
    },
    { type: 'separator', show: true },
    { 
      id: 'star', 
      label: file.starred ? 'Remove star' : 'Add star', 
      icon: Star,
      shortcut: 'S',
      show: true 
    },
    { 
      id: 'add-tag', 
      label: 'Add tags', 
      icon: Tag,
      show: true 
    },
    { 
      id: 'offline', 
      label: file.offlineAvailable ? 'Remove offline' : 'Make available offline', 
      icon: CloudOff,
      show: true 
    },
    { type: 'separator', show: true },
    { 
      id: 'versions', 
      label: 'Version history', 
      icon: Clock,
      shortcut: '⌘H',
      show: file.type !== 'folder' 
    },
    { 
      id: 'details', 
      label: 'File details', 
      icon: Info,
      shortcut: '⌘I',
      show: true 
    },
    { 
      id: 'security', 
      label: 'Security settings', 
      icon: Lock,
      show: true 
    },
    { type: 'separator', show: true },
    { 
      id: 'delete', 
      label: 'Move to trash', 
      icon: Trash2,
      shortcut: '⌫',
      color: 'text-red-600',
      show: true 
    },
  ];

  const handleAction = (actionId: string) => {
    onAction(actionId, file.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[100] w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 overflow-hidden"
        style={{
          left: position.x,
          top: position.y,
          maxHeight: 'calc(100vh - 20px)',
        }}
      >
        {menuItems.map((item, index) => {
          if (!item.show) return null;
          
          if (item.type === 'separator') {
            return <div key={`sep-${index}`} className="h-px bg-slate-200 my-2" />;
          }

          const Icon = item.icon!;
          return (
            <button
              key={item.id}
              onClick={() => handleAction(item.id!)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${item.color || 'text-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-slate-400 font-mono">{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
