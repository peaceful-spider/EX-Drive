import React, { useState } from 'react';
import { Clock, Download, RotateCcw, GitBranch, User, FileText, X, CheckCircle2 } from 'lucide-react';
import { FileVersion, FileItem } from '../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface VersionHistoryProps {
  file: FileItem;
  onRestore: (versionId: string) => void;
  onDownloadVersion: (versionId: string) => void;
  onClose: () => void;
}

export function VersionHistory({ file, onRestore, onDownloadVersion, onClose }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[string | null, string | null]>([null, null]);

  // Mock versions - in real app this would come from file.versions
  const versions: FileVersion[] = file.versions || [
    {
      id: 'v3',
      fileId: file.id,
      version: 3,
      size: file.size,
      createdAt: file.updatedAt,
      createdBy: 'You',
      comment: 'Final revisions completed',
      changes: 'Updated sections 3-5, added conclusion',
      hash: 'abc123'
    },
    {
      id: 'v2',
      fileId: file.id,
      version: 2,
      size: file.size - 1000,
      createdAt: new Date(file.updatedAt.getTime() - 86400000),
      createdBy: 'Sarah Chen',
      comment: 'Peer review feedback incorporated',
      changes: 'Modified introduction, fixed typos',
      hash: 'def456'
    },
    {
      id: 'v1',
      fileId: file.id,
      version: 1,
      size: file.size - 2000,
      createdAt: new Date(file.updatedAt.getTime() - 172800000),
      createdBy: 'You',
      comment: 'Initial draft',
      changes: 'Created document',
      hash: 'ghi789'
    },
  ];

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Version History</h2>
              <p className="text-sm text-slate-500">{file.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                compareMode ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              Compare Mode
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {versions.map((version, index) => {
              const isSelected = selectedVersion === version.id;
              const isInCompare = compareVersions.includes(version.id);
              
              return (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative p-5 rounded-xl border-2 transition-all cursor-pointer",
                    isSelected ? "border-blue-500 bg-blue-50 shadow-md" : 
                    isInCompare ? "border-purple-400 bg-purple-50" :
                    "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  )}
                  onClick={() => !compareMode && setSelectedVersion(version.id)}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
                    {index === 0 && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded">
                            v{version.version}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">{version.createdBy}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {format(version.createdAt, 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>

                      {version.comment && (
                        <p className="text-sm font-medium text-slate-900 mb-2">{version.comment}</p>
                      )}
                      
                      {version.changes && (
                        <p className="text-xs text-slate-600 mb-3">{version.changes}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {formatSize(version.size)}
                        </span>
                        <span className="font-mono">{version.hash}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {compareMode ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const [v1, v2] = compareVersions;
                            if (!v1) setCompareVersions([version.id, v2]);
                            else if (!v2) setCompareVersions([v1, version.id]);
                            else setCompareVersions([version.id, null]);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            isInCompare 
                              ? "bg-purple-500 text-white" 
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          )}
                        >
                          {isInCompare ? 'Selected' : 'Select'}
                        </button>
                      ) : (
                        <>
                          {index !== 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRestore(version.id);
                              }}
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadVersion(version.id);
                            }}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {compareMode && compareVersions[0] && compareVersions[1] && (
            <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Comparison View</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {compareVersions.map((vId, i) => {
                  const v = versions.find(ver => ver.id === vId);
                  return v ? (
                    <div key={i} className="p-3 bg-white rounded-lg border border-purple-200">
                      <div className="font-semibold text-sm mb-1">Version {v.version}</div>
                      <div className="text-xs text-slate-600">{v.comment}</div>
                      <div className="text-xs text-slate-500 mt-2">{formatSize(v.size)}</div>
                    </div>
                  ) : null;
                })}
              </div>
              <p className="text-xs text-purple-700 mt-3">
                Size difference: {Math.abs((versions.find(v => v.id === compareVersions[0])?.size || 0) - (versions.find(v => v.id === compareVersions[1])?.size || 0))} bytes
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
