import React, { useMemo } from 'react';
import { Database, HardDrive, Copy, Trash2, Archive, TrendingUp, FileText, Image, Film, Folder, X } from 'lucide-react';
import { FileItem } from '../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StorageAnalyticsProps {
  files: FileItem[];
  onClose: () => void;
  onCleanDuplicates: () => void;
  onArchiveOld: () => void;
}

export function StorageAnalytics({ files, onClose, onCleanDuplicates, onArchiveOld }: StorageAnalyticsProps) {
  const stats = useMemo(() => {
    const nonTrashed = files.filter(f => !f.trashed);
    const totalSize = nonTrashed.reduce((acc, f) => acc + f.size, 0);
    
    const byType = nonTrashed.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + f.size;
      return acc;
    }, {} as Record<string, number>);

    // Detect duplicates by hash
    const hashMap = new Map<string, FileItem[]>();
    nonTrashed.forEach(f => {
      if (f.hash) {
        const existing = hashMap.get(f.hash) || [];
        hashMap.set(f.hash, [...existing, f]);
      }
    });
    const duplicates = Array.from(hashMap.values()).filter(arr => arr.length > 1);
    const duplicateSize = duplicates.reduce((acc, arr) => {
      // All but one are duplicates
      return acc + arr.slice(1).reduce((sum, f) => sum + f.size, 0);
    }, 0);

    // Files older than 90 days not accessed
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const coldFiles = nonTrashed.filter(f => f.updatedAt < ninetyDaysAgo);
    const coldSize = coldFiles.reduce((acc, f) => acc + f.size, 0);

    return {
      totalSize,
      totalFiles: nonTrashed.length,
      byType,
      duplicates: duplicates.length,
      duplicateSize,
      coldFiles: coldFiles.length,
      coldSize,
    };
  }, [files]);

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const typeColors: Record<string, string> = {
    folder: '#3b82f6',
    document: '#10b981',
    image: '#ec4899',
    video: '#ef4444',
    audio: '#f59e0b',
    archive: '#8b5cf6',
  };

  const pieData = Object.entries(stats.byType).map(([type, size]) => ({
    name: type,
    value: size,
    color: typeColors[type] || '#64748b'
  }));

  const barData = Object.entries(stats.byType).map(([type, size]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    size: size / (1024 * 1024), // Convert to MB
  }));

  const totalStorageGB = 2 * 1024; // 2TB
  const usedGB = stats.totalSize / (1024 * 1024 * 1024);
  const usagePercent = (usedGB / totalStorageGB) * 100;

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Storage Analytics</h2>
              <p className="text-sm text-slate-500">Optimize your cloud storage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Total Storage</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{formatSize(stats.totalSize)}</div>
              <div className="text-xs text-blue-600 mt-1">{stats.totalFiles} files</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-900">Duplicates</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">{formatSize(stats.duplicateSize)}</div>
              <div className="text-xs text-orange-600 mt-1">{stats.duplicates} duplicate groups</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">Cold Storage</span>
              </div>
              <div className="text-2xl font-bold text-slate-700">{formatSize(stats.coldSize)}</div>
              <div className="text-xs text-slate-600 mt-1">{stats.coldFiles} old files</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">Potential Savings</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {formatSize(stats.duplicateSize + stats.coldSize)}
              </div>
              <div className="text-xs text-green-600 mt-1">Can be freed</div>
            </div>
          </div>

          {/* Storage Usage Bar */}
          <div className="mb-6 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Storage Usage</h3>
              <span className="text-sm font-bold text-blue-600">{usagePercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden mb-2">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  usagePercent > 90 ? "bg-gradient-to-r from-red-400 to-red-600" :
                  usagePercent > 75 ? "bg-gradient-to-r from-orange-400 to-orange-600" :
                  "bg-gradient-to-r from-blue-400 to-blue-600"
                )}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{formatSize(stats.totalSize)} used</span>
              <span>{formatSize(totalStorageGB * 1024 * 1024 * 1024)} total</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pie Chart */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Storage by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatSize(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600 capitalize">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Size Distribution (MB)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => value.toFixed(2) + ' MB'} />
                  <Bar dataKey="size" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-900 mb-1">Remove Duplicates</h3>
                  <p className="text-sm text-orange-700 mb-3">
                    Free up {formatSize(stats.duplicateSize)} by removing {stats.duplicates} duplicate files
                  </p>
                  <button
                    onClick={onCleanDuplicates}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    Clean Duplicates
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Archive Old Files</h3>
                  <p className="text-sm text-slate-700 mb-3">
                    Archive {stats.coldFiles} files not accessed in 90+ days ({formatSize(stats.coldSize)})
                  </p>
                  <button
                    onClick={onArchiveOld}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    Archive Files
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
