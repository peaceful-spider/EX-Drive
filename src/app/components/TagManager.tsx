import React, { useState } from 'react';
import { Tag as TagIcon, X, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { Tag } from '../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface TagManagerProps {
  tags: Tag[];
  onCreateTag: (tag: Omit<Tag, 'id'>) => void;
  onUpdateTag: (id: string, updates: Partial<Tag>) => void;
  onDeleteTag: (id: string) => void;
  onClose: () => void;
}

const TAG_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444',
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export function TagManager({ tags, onCreateTag, onUpdateTag, onDeleteTag, onClose }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | undefined>();

  const handleCreate = () => {
    if (!newTagName.trim()) return;
    onCreateTag({ name: newTagName, color: selectedColor, parentId });
    setNewTagName('');
    setSelectedColor(TAG_COLORS[0]);
    setParentId(undefined);
  };

  const rootTags = tags.filter(t => !t.parentId);
  const getChildTags = (parentId: string) => tags.filter(t => t.parentId === parentId);

  const TagItem = ({ tag, depth = 0 }: { tag: Tag; depth?: number }) => {
    const children = getChildTags(tag.id);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div style={{ marginLeft: depth * 20 }}>
        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
          {children.length > 0 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-0.5">
              <ChevronRight className={cn("w-3 h-3 text-slate-400 transition-transform", isExpanded && "rotate-90")} />
            </button>
          )}
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
          <span className="flex-1 text-sm font-medium text-slate-700">{tag.name}</span>
          <div className="opacity-0 group-hover:opacity-100 flex gap-1">
            <button 
              onClick={() => setParentId(tag.id)} 
              className="p-1 hover:bg-slate-100 rounded"
              title="Add child tag"
            >
              <Plus className="w-3 h-3 text-slate-500" />
            </button>
            <button 
              onClick={() => onDeleteTag(tag.id)} 
              className="p-1 hover:bg-red-50 rounded"
              title="Delete tag"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
        {isExpanded && children.map(child => (
          <TagItem key={child.id} tag={child} depth={depth + 1} />
        ))}
      </div>
    );
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <TagIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tag Manager</h2>
              <p className="text-sm text-slate-500">Organize files with hierarchical tags</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Create New Tag */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Create New Tag</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Tag name..."
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleCreate()}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleCreate}
                disabled={!newTagName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              {TAG_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    selectedColor === color ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {parentId && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                <span>Parent: {tags.find(t => t.id === parentId)?.name}</span>
                <button onClick={() => setParentId(undefined)} className="text-red-500 hover:underline">
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Tag List */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">All Tags ({tags.length})</h3>
            {rootTags.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <TagIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No tags yet. Create one above!</p>
              </div>
            ) : (
              rootTags.map(tag => <TagItem key={tag.id} tag={tag} />)
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
