import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  HardDrive, 
  Search, 
  Clock, 
  Settings, 
  Plus,
  User,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { useDashboard } from '../context/DashboardContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSidebarItem, setActiveSidebarItem, setUploadOpen } = useDashboard();
  
  const isDashboard = location.pathname === '/dashboard';

  const handleNavClick = (id: string, path?: string) => {
    if (path) {
      navigate(path);
    }
    
    // If we're on the dashboard and clicking Files or Recent, update the sidebar item
    if (isDashboard && (id === 'my-drive' || id === 'recent')) {
      setActiveSidebarItem(id);
    }
  };

  const handleOpenUpload = () => {
    if (location.pathname === '/dashboard') {
      setUploadOpen(true);
    } else {
      // Otherwise, navigate to dashboard first
      navigate('/dashboard');
      setTimeout(() => setUploadOpen(true), 100);
    }
  };

  const navItems = [
    { id: 'my-drive', label: 'Files', icon: HardDrive, path: '/dashboard' },
    { id: 'recent', label: 'Recent', icon: Clock, path: '/dashboard' },
    { id: 'new', label: '', icon: Plus, isAction: true },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'settings', label: 'Menu', icon: LayoutGrid, path: '/settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          // Determine active state
          let isActive = false;
          if (item.isAction) {
            isActive = false;
          } else if (isDashboard && (item.id === 'my-drive' || item.id === 'recent')) {
            // On dashboard, check if the sidebar item matches
            isActive = activeSidebarItem === item.id;
          } else {
            // For other pages, check path match
            isActive = location.pathname === item.path;
          }
          
          if (item.isAction) {
            return (
              <button
                key={item.id}
                className="relative -top-5 bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
                onClick={handleOpenUpload}
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-indigo-600" : "text-slate-400"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}