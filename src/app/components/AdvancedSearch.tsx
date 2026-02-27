import React, { useState } from 'react';
import { Search, X, Calendar, Users, FileType, Tag, Star, HardDrive, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Tag as TagType } from '../types';

interface AdvancedSearchProps {
  tags: TagType[];
  onSearch: (filters: SearchFilters) => void;
  onClose: () => void;
}

export interface SearchFilters {
  query: string;
  fileTypes: string[];
  dateRange: { start?: Date; end?: Date };
  sharedBy: string[];
  tags: string[];
  starred?: boolean;
  minSize?: number;
  maxSize?: number;
}

const FILE_TYPE_OPTIONS = [
  { value: 'document', label: 'Documents', icon: FileType },
  { value: 'image', label: 'Images', icon: FileType },
  { value: 'video', label: 'Videos', icon: FileType },
  { value: 'audio', label: 'Audio', icon: FileType },
  { value: 'folder', label: 'Folders', icon: FileType },
  { value: 'archive', label: 'Archives', icon: FileType },
];

const DATE_PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
];

export function AdvancedSearch({ tags, onSearch, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    fileTypes: [],
    dateRange: {},
    sharedBy: [],
    tags: [],
  });

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      query: '',
      fileTypes: [],
      dateRange: {},
      sharedBy: [],
      tags: [],
    });
  };

  const toggleFileType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(type)
        ? prev.fileTypes.filter(t => t !== type)
        : [...prev.fileTypes, type]
    }));
  };

  const toggleTag = (tagId: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const setDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setFilters(prev => ({ ...prev, dateRange: { start, end } }));
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
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Advanced Search</h2>
              <p className="text-sm text-slate-500">Filter files with precision</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search Query */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Query</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filters.query}
                onChange={e => setFilters({ ...filters, query: e.target.value })}
                placeholder="File name, content, or keywords..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* File Types */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">File Types</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FILE_TYPE_OPTIONS.map(type => (
                <button
                  key={type.value}
                  onClick={() => toggleFileType(type.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium",
                    filters.fileTypes.includes(type.value)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  )}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Date Modified</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {DATE_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setDatePreset(preset.days)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={e => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value ? new Date(e.target.value) : undefined }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={e => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value ? new Date(e.target.value) : undefined }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2",
                    filters.tags.includes(tag.id)
                      ? "border-current shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: filters.tags.includes(tag.id) ? tag.color + '30' : tag.color + '20',
                    color: tag.color
                  }}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Additional Filters</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.starred || false}
                  onChange={e => setFilters({ ...filters, starred: e.target.checked || undefined })}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-slate-700">Starred only</span>
              </label>
            </div>
          </div>

          {/* File Size */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">File Size</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Min (MB)</label>
                <input
                  type="number"
                  value={filters.minSize ? filters.minSize / (1024 * 1024) : ''}
                  onChange={e => setFilters({
                    ...filters,
                    minSize: e.target.value ? Number(e.target.value) * 1024 * 1024 : undefined
                  })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Max (MB)</label>
                <input
                  type="number"
                  value={filters.maxSize ? filters.maxSize / (1024 * 1024) : ''}
                  onChange={e => setFilters({
                    ...filters,
                    maxSize: e.target.value ? Number(e.target.value) * 1024 * 1024 : undefined
                  })}
                  placeholder="∞"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
