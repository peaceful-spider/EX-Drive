import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  WifiOff, 
  Server, 
  Laptop, 
  Smartphone, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FileItem } from '../types';
import { motion } from 'motion/react';

interface SyncInspectorProps {
  files: FileItem[];
  onClose: () => void;
}

export function SyncInspector({ files, onClose }: SyncInspectorProps) {
  const syncingFiles = files.filter(f => f.syncStatus.state === 'syncing' || f.syncStatus.state === 'pending');
  const errorFiles = files.filter(f => f.syncStatus.state === 'error');
  const recentFiles = files.filter(f => f.syncStatus.state === 'synced').sort((a, b) => 
    (b.syncStatus.lastSynced?.getTime() || 0) - (a.syncStatus.lastSynced?.getTime() || 0)
  ).slice(0, 5);

  return (
    <div className="h-full bg-slate-50 border-l border-slate-200 flex flex-col w-80 shadow-xl z-20">
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <h2 className="font-bold text-slate-800">Sync Inspector</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Connection Status */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Network Topology</h3>
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col items-center gap-1">
              <Laptop className="w-6 h-6 text-slate-600" />
              <span className="text-[10px] font-medium text-slate-500">Local</span>
            </div>
            <div className="flex-1 h-px bg-slate-300 mx-2 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-100 text-green-700 text-[10px] px-1 rounded-full border border-green-200">
                 TLS 1.3
               </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Server className="w-6 h-6 text-blue-600" />
              <span className="text-[10px] font-medium text-blue-600">Cloud</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Connected (24ms latency)
          </div>
        </div>

        {/* Active Syncs */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            Active Operations
            <span className="bg-blue-100 text-blue-700 px-1.5 rounded-full text-[10px]">{syncingFiles.length}</span>
          </h3>
          
          <div className="space-y-2">
            {syncingFiles.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs italic">
                All files up to date
              </div>
            ) : (
              syncingFiles.map(file => (
                <div key={file.id} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-500" style={{ width: `${file.syncStatus.progress}%` }}></div>
                   <div className="flex justify-between items-start mb-1">
                     <span className="font-medium text-sm text-slate-700 truncate max-w-[150px]">{file.name}</span>
                     <span className="text-xs font-mono text-blue-600">{file.syncStatus.progress}%</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{file.syncStatus.device || 'Local'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span>Cloud</span>
                   </div>
                   <div className="mt-2 text-[10px] font-mono text-slate-400">
                     Chunk 45/102 • 4.5 MB/s
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Errors */}
        {errorFiles.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              Conflicts & Errors
              <span className="bg-red-100 text-red-700 px-1.5 rounded-full text-[10px]">{errorFiles.length}</span>
            </h3>
            <div className="space-y-2">
              {errorFiles.map(file => (
                <div key={file.id} className="bg-red-50 p-3 rounded-lg border border-red-100">
                   <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-red-900">{file.name}</div>
                        <div className="text-xs text-red-700 mt-1">{file.syncStatus.error}</div>
                        <div className="flex gap-2 mt-2">
                           <button className="bg-white border border-red-200 text-red-700 text-[10px] px-2 py-1 rounded hover:bg-red-50">Retry</button>
                           <button className="bg-red-600 text-white text-[10px] px-2 py-1 rounded hover:bg-red-700">Resolve</button>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Log */}
        <div>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sync Log</h3>
           <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] text-green-400 space-y-1 h-32 overflow-y-auto">
              <div className="opacity-50">[10:45:01] Handshake init...</div>
              <div className="opacity-50">[10:45:02] Connected to us-east-1</div>
              {recentFiles.map(file => (
                  <div key={file.id}>
                      <span className="text-blue-400">SYNC</span> {file.name} <span className="text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
              ))}
              {syncingFiles.map(file => (
                   <div key={file.id + 'up'}>
                      <span className="text-yellow-400">UPLD</span> {file.name} <span className="text-slate-500">{file.syncStatus.progress}%</span>
                  </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
