import React, { useState } from 'react';
import { 
  Home, 
  HardDrive, 
  Users, 
  Clock, 
  Star, 
  Trash2, 
  Cloud, 
  Settings, 
  Server,
  Activity,
  FolderOpen,
  Database,
  FileText,
  Plus,
  FolderPlus,
  UploadCloud,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from "../../assets/logo.png";
import { AnimatePresence, motion } from 'motion/react';

import { useNavigate } from 'react-router';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  isPowerMode: boolean;
  onCreateFolder: () => void;
  onUploadFile: () => void;
}

export function Sidebar({ activeItem, onNavigate, isPowerMode, onCreateFolder, onUploadFile }: SidebarProps) {
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id: 'my-drive', label: 'My Drive', icon: HardDrive },
    { id: 'computers', label: 'Computers', icon: Server },
    { id: 'shared', label: 'Shared with me', icon: Users },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all duration-300 z-30",
      isPowerMode ? "w-64" : "w-16 md:w-20"
    )}>
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <div className="relative">
            <img src={logo} alt="ElgoraX Drive" className="w-8 h-8 object-contain" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Online" />
        </div>
        <div className={cn(
          "flex flex-col overflow-hidden transition-all duration-300",
          !isPowerMode ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <span className="font-bold text-lg text-slate-800 whitespace-nowrap">
            ElgoraX
          </span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            Enterprise
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="px-3 mb-6 relative">
          <button 
            id="tour-upload-btn"
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className={cn(
            "w-full flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 rounded-xl p-3 shadow-sm transition-all group",
            !isPowerMode && "justify-center p-2 rounded-full h-12 w-12"
          )}>
            <div className={cn("bg-gradient-to-br from-blue-500 to-blue-600 text-white p-1 rounded shadow-md transition-transform duration-300", isNewMenuOpen ? "rotate-45" : "group-hover:scale-105")}>
              <Plus className="w-4 h-4" />
            </div>
            <span className={cn("font-semibold text-sm", !isPowerMode && "hidden")}>New</span>
          </button>

          {/* New Menu Dropdown */}
          <AnimatePresence>
            {isNewMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNewMenuOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={cn(
                    "absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 flex flex-col gap-1",
                    !isPowerMode && "left-14 top-0 mt-0"
                  )}
                >
                  <button 
                    onClick={() => { onCreateFolder(); setIsNewMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                  >
                    <FolderPlus className="w-4 h-4 text-blue-500" />
                    New Folder
                  </button>
                  <button 
                    onClick={() => { onUploadFile(); setIsNewMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                  >
                    <UploadCloud className="w-4 h-4 text-purple-500" />
                    File Upload
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={item.id === 'shared' ? 'tour-shared-nav' : undefined}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                activeItem === item.id 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                !isPowerMode && "justify-center"
              )}
              title={!isPowerMode ? item.label : undefined}
            >
              <item.icon className={cn(
                  "w-5 h-5 transition-colors", 
                  activeItem === item.id ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
              )} />
              <span className={cn("truncate transition-opacity duration-300", !isPowerMode ? "hidden opacity-0 w-0" : "block opacity-100 flex-1 text-left")}>
                {item.label}
              </span>
              
              {/* Tooltip for simple mode */}
              {!isPowerMode && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className={cn("mt-6 mb-2 px-4 transition-opacity duration-300", !isPowerMode ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
            <div className="h-px bg-slate-200 w-full mb-4"></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              System Health
            </div>
        </div>

        <nav className="space-y-1 px-2">
            <button
                onClick={() => onNavigate('sync-inspector')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  activeItem === 'sync-inspector' 
                    ? "bg-purple-50 text-purple-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  !isPowerMode && "justify-center"
                )}
                title={!isPowerMode ? "Sync Inspector" : undefined}
              >
                <Activity className={cn(
                    "w-5 h-5 transition-colors", 
                    activeItem === 'sync-inspector' ? "text-purple-600" : "text-slate-500 group-hover:text-purple-600"
                )} />
                <span className={cn("truncate transition-opacity duration-300", !isPowerMode ? "hidden opacity-0 w-0" : "block opacity-100 flex-1 text-left")}>
                  Sync Inspector
                </span>
                 {!isPowerMode && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Sync Inspector
                </div>
              )}
            </button>
            
            <button
                 onClick={() => onNavigate('analytics')}
                 className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  activeItem === 'analytics' 
                    ? "bg-purple-50 text-purple-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  !isPowerMode && "justify-center"
                )}
                title={!isPowerMode ? "Storage Analysis" : undefined}
              >
                 <Database className={cn(
                    "w-5 h-5 transition-colors", 
                    activeItem === 'analytics' ? "text-purple-600" : "text-slate-500 group-hover:text-purple-600"
                )} />
                 <span className={cn("truncate transition-opacity duration-300", !isPowerMode ? "hidden opacity-0 w-0" : "block opacity-100 flex-1 text-left")}>
                    Storage Analysis
                 </span>
                 {!isPowerMode && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Storage Analysis
                </div>
              )}
            </button>
        </nav>
            
        <div className={cn("mt-auto px-4 pt-8 transition-opacity duration-300", !isPowerMode ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
            <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Cloud Storage</span>
                    <span className="text-[10px] text-blue-600 font-bold">75%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>1.5 TB used</span>
                    <span>2 TB total</span>
                </div>
            </div>
        </div>

      </div>
      
      <div className="p-3 border-t border-slate-200 bg-white">
        <button 
          onClick={() => navigate('/settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors group relative",
            !isPowerMode && "justify-center"
          )}
        >
           <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
           <span className={cn("truncate transition-all duration-300", !isPowerMode ? "hidden opacity-0 w-0" : "block opacity-100 flex-1 text-left")}>Settings</span>
            {!isPowerMode && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Settings
                </div>
              )}
        </button>
      </div>
    </div>
  );
}
