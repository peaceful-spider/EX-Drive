import React from 'react';
import { Search, Bell, Menu, Grid, List, Monitor, Smartphone, Globe, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  isPowerMode: boolean;
  onToggleMode: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ isPowerMode, onToggleMode, viewMode, onViewModeChange, searchQuery, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder={isPowerMode ? "Search via regex, tags, or content..." : "Search files..."}
            className={cn(
              "w-full h-10 pl-10 pr-4 rounded-lg border outline-none transition-all text-sm",
              isPowerMode 
                ? "bg-slate-50 border-slate-300 focus:bg-white focus:border-blue-500 font-mono text-xs" 
                : "bg-slate-100 border-transparent focus:bg-white focus:border-blue-300 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
            )}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {isPowerMode && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="text-[10px] bg-slate-200 px-1 rounded text-slate-500 font-mono border border-slate-300">CMD+K</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
          <button
            onClick={() => isPowerMode && onToggleMode()}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2",
              !isPowerMode 
                ? "bg-white text-slate-800 shadow-sm border border-slate-200" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Smartphone className="w-3 h-3" />
            <span>Simple</span>
          </button>
          <button
            onClick={() => !isPowerMode && onToggleMode()}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2",
              isPowerMode 
                ? "bg-slate-800 text-white shadow-md border border-slate-700" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Monitor className="w-3 h-3" />
            <span>Power</span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <button 
          className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
           <button 
             onClick={() => navigate('/profile')}
             className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm overflow-hidden hover:scale-105 transition-transform"
           >
             {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
           </button>
        </div>
      </div>
    </header>
  );
}
