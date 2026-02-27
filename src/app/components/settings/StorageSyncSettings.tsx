import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  HardDrive, Database, Wifi, Smartphone, 
  CloudUpload, CheckCircle, AlertTriangle, 
  FileSearch, Copy, Archive, Info, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function StorageSettings() {
  const { user } = useAuth();
  
  const storageBreakdown = [
    { label: 'Documents', size: '1.2 GB', color: 'bg-blue-500', percentage: 28 },
    { label: 'Images', size: '2.4 GB', color: 'bg-indigo-500', percentage: 57 },
    { label: 'Videos', size: '0.4 GB', color: 'bg-purple-500', percentage: 10 },
    { label: 'Other', size: '0.2 GB', color: 'bg-slate-300', percentage: 5 },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Storage Management</h2>
        <Card className="rounded-2xl border-slate-200 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-sm font-medium text-slate-500">Total Used Space</p>
                  <p className="text-3xl font-bold text-slate-900">4.2 GB <span className="text-lg text-slate-400 font-normal">/ 10 GB</span></p>
               </div>
               <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">Healthy</Badge>
            </div>
            
            <div className="h-4 bg-slate-100 rounded-full flex overflow-hidden">
               {storageBreakdown.map((item) => (
                  <div key={item.label} className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
               ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {storageBreakdown.map((item) => (
                  <div key={item.label} className="space-y-1">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs font-medium text-slate-600">{item.label}</span>
                     </div>
                     <p className="text-sm font-bold text-slate-900 pl-4">{item.size}</p>
                  </div>
               ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Cleanup Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card className="rounded-2xl border-slate-200 p-4 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><FileSearch size={20} /></div>
              <h3 className="font-bold text-slate-900">Large Files</h3>
              <p className="text-xs text-slate-500 mt-1">Found 12 files larger than 500MB</p>
           </Card>
           <Card className="rounded-2xl border-slate-200 p-4 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Copy size={20} /></div>
              <h3 className="font-bold text-slate-900">Duplicates</h3>
              <p className="text-xs text-slate-500 mt-1">320MB of duplicate files detected</p>
           </Card>
           <Card className="rounded-2xl border-slate-200 p-4 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Archive size={20} /></div>
              <h3 className="font-bold text-slate-900">Old Versions</h3>
              <p className="text-xs text-slate-500 mt-1">1.2GB in versions older than 30 days</p>
           </Card>
        </div>
      </section>
    </div>
  );
}

export function SyncSettings() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sync & Offline Access</h2>
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardContent className="divide-y divide-slate-100 p-0">
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Enable Offline Access</p>
                <p className="text-sm text-slate-500">Access and edit files without an internet connection</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Sync over Wi-Fi only</p>
                <p className="text-sm text-slate-500">Save mobile data by only syncing on Wi-Fi networks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Sync Priority</p>
                <p className="text-sm text-slate-500">Prioritize high-speed syncing for important folders</p>
              </div>
              <Badge variant="outline" className="rounded-lg">Normal</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sync Status</h2>
        <Card className="rounded-2xl border-slate-200 p-6 bg-slate-50/50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-indigo-600 animate-pulse">
                    <RefreshCw size={24} />
                 </div>
                 <div>
                    <p className="font-bold text-slate-900">All files are up to date</p>
                    <p className="text-sm text-slate-500">Last synced: 2 minutes ago</p>
                 </div>
              </div>
              <Button variant="outline" size="sm">Sync Now</Button>
           </div>
        </Card>
      </section>
    </div>
  );
}
