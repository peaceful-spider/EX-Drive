import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, User, Smartphone, LogOut, ArrowLeft, 
  CreditCard, HardDrive, Bell, Settings as SettingsIcon, 
  HelpCircle, Eye, Zap, Accessibility, Globe, Info, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';

// Section Components
import { PlanBillingSettings } from '../components/settings/PlanBillingSettings';
import { SecuritySettings, PrivacySettings } from '../components/settings/SecurityPrivacySettings';
import { StorageSettings, SyncSettings } from '../components/settings/StorageSyncSettings';
import { NotificationSettings, AccessibilitySettings } from '../components/settings/PreferencesSettings';

import { InstallPrompt } from '../components/InstallPrompt';

export function HelpSettings() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">App Installation</h2>
        <Card className="rounded-2xl border-indigo-100 bg-indigo-50/30 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Smartphone size={24} /></div>
              <div className="flex-1">
                 <h3 className="font-bold text-slate-900">Get the ElgoraX App</h3>
                 <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                   Install ElgoraX Drive on your device for a full-screen, offline-first experience. 
                   Works on iOS, Android, and Desktop.
                 </p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Download size={12} /> Add to Home Screen
                    </div>
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Shield size={12} /> Privacy First
                    </div>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="rounded-2xl border-slate-200 p-6 hover:bg-slate-50 cursor-pointer transition-colors">
              <MessageSquare className="text-indigo-600 mb-2" />
              <h3 className="font-bold">Community Discord</h3>
              <p className="text-xs text-slate-500 mt-1">Join the conversation and get help</p>
           </Card>
           <Card className="rounded-2xl border-slate-200 p-6 hover:bg-slate-50 cursor-pointer transition-colors">
              <Info className="text-indigo-600 mb-2" />
              <h3 className="font-bold">Documentation</h3>
              <p className="text-xs text-slate-500 mt-1">Deep dive into ElgoraX features</p>
           </Card>
        </div>
      </section>
    </div>
  );
}

export default function Settings() {
  const { user, logout, isPowerMode, setPowerMode } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, group: 'Account' },
    { id: 'security', label: 'Security', icon: Shield, group: 'Account' },
    { id: 'privacy', label: 'Privacy', icon: Eye, group: 'Account' },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard, group: 'Account' },
    
    { id: 'storage', label: 'Storage', icon: HardDrive, group: 'System' },
    { id: 'sync', label: 'Sync & Offline', icon: Zap, group: 'System' },
    { id: 'notifications', label: 'Notifications', icon: Bell, group: 'System' },
    
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility, group: 'Preferences' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, group: 'General' },
  ];

  const groupedTabs = tabs.reduce((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = [];
    acc[tab.group].push(tab);
    return acc;
  }, {} as Record<string, typeof tabs>);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
              <p className="text-slate-500">Manage your personal identity and account details.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold ring-4 ring-white shadow-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50">
                    <SettingsIcon size={14} className="text-slate-600" />
                  </button>
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                  <p className="text-slate-500">{user?.email}</p>
                  <Button variant="link" className="p-0 h-auto text-indigo-600 font-bold hover:no-underline">Change Photo</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Display Language</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white">
                    <option>English (US)</option>
                    <option>Urdu (اردو)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Timezone</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white">
                    <option>(GMT+05:00) Islamabad, Karachi</option>
                    <option>(GMT-08:00) Pacific Time</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="text-sm text-slate-500 italic">Email changes require verification.</div>
                 <Button className="bg-slate-900 text-white px-8 py-6 rounded-2xl font-bold hover:bg-slate-800 transition-all w-full md:w-auto">
                    Save Profile Changes
                 </Button>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return <PlanBillingSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'storage':
        return <StorageSettings />;
      case 'sync':
        return <SyncSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'accessibility':
        return <AccessibilitySettings />;
      case 'help':
        return <HelpSettings />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-slate-400">
            Section coming soon...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Settings</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Control your account, security, and storage</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">{user?.name}</span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{user?.plan} Member</span>
          </div>
          <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm overflow-hidden">
             {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name.charAt(0).toUpperCase()}
          </button>
          <button 
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-0 z-20 md:relative md:inset-auto md:w-80 md:flex bg-slate-50 border-r border-slate-200 flex-shrink-0 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="absolute inset-0 bg-slate-900/10 md:hidden" onClick={() => setSidebarOpen(false)} />
          <ScrollArea className="h-full w-full bg-slate-50 md:bg-transparent relative z-10">
            <div className="p-6 space-y-8">
              {Object.entries(groupedTabs).map(([group, groupTabs]) => (
                <div key={group} className="space-y-2">
                  <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">{group}</p>
                  <div className="space-y-1">
                    {groupTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left",
                          activeTab === tab.id 
                            ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" 
                            : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
                        )}
                      >
                        <tab.icon size={18} className={cn("transition-colors", activeTab === tab.id ? "text-indigo-600" : "text-slate-400")} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-slate-200 space-y-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
              
              {/* Power Mode Toggle Mini */}
              <div className="mt-8 p-4 bg-indigo-900 rounded-3xl text-white shadow-lg overflow-hidden relative">
                 <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                 <div className="relative z-10">
                    <p className="text-xs font-bold opacity-80 mb-2">INTERFACE MODE</p>
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-sm">Power Mode</span>
                       <button 
                        onClick={() => setPowerMode(!isPowerMode)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative",
                          isPowerMode ? "bg-indigo-400" : "bg-white/20"
                        )}
                       >
                         <div className={cn(
                           "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                           isPowerMode ? "translate-x-4" : "translate-x-0"
                         )} />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="max-w-4xl mx-auto p-6 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}