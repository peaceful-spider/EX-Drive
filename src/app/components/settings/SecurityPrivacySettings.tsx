import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, Key, Smartphone, LogOut, Lock, 
  Eye, Bell, Fingerprint, ShieldAlert, Monitor,
  MapPin, Clock, Trash2, ShieldCheck, Download, Users
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { toast } from 'sonner';

export function SecuritySettings() {
  const { user } = useAuth();
  
  const sessions = [
    { id: 1, device: 'Chrome on MacOS', location: 'San Francisco, US', time: 'Active now', current: true, type: 'desktop' },
    { id: 2, device: 'iPhone 15 Pro App', location: 'London, UK', time: '2 hours ago', current: false, type: 'mobile' },
    { id: 3, device: 'Safari on iPad', location: 'Paris, FR', time: '3 days ago', current: false, type: 'mobile' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Authentication */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Security & Authentication</h2>
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardContent className="divide-y divide-slate-100 p-0">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><Key size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900">Password</p>
                  <p className="text-sm text-slate-500">Last changed 45 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Fingerprint size={20} /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Gold Required</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Switch checked={user?.plan === 'gold' || user?.plan === 'platinum'} disabled={user?.plan === 'free' || user?.plan === 'silver'} />
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><ShieldAlert size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900">Reset Encryption Keys</p>
                  <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200 uppercase font-bold">Platinum Only</Badge>
                  <p className="text-sm text-slate-500">Regenerate your zero-knowledge master key</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>Reset</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. Active Sessions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Active Sessions</h2>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Log out of all devices</Button>
        </div>
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardContent className="divide-y divide-slate-100 p-0">
            {sessions.map(session => (
              <div key={session.id} className={`p-6 flex items-center justify-between ${session.current ? 'bg-indigo-50/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400">
                    {session.type === 'desktop' ? <Monitor size={20} /> : <Smartphone size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{session.device}</p>
                      {session.current && <Badge className="bg-green-500 text-[10px]">CURRENT</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {session.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {session.time}</span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                    <LogOut size={18} />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 3. Alerts */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Security Alerts</h2>
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Login Alerts</p>
                <p className="text-sm text-slate-500">Get notified of new logins via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">New Device Alerts</p>
                <p className="text-sm text-slate-500">Push notification when a new device connects</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export function PrivacySettings() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Privacy & Data Control</h2>
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Activity Tracking</p>
                <p className="text-sm text-slate-500">Record file access logs for your own security</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Share Analytics Visibility</p>
                <p className="text-sm text-slate-500">Show recipients how many times a file was downloaded</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Download Permission Defaults</p>
                <p className="text-sm text-slate-500">Allow downloads by default for new share links</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm"><ShieldCheck size={24} /></div>
           <div>
              <h3 className="font-bold text-slate-900">Our Privacy Commitment</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                ElgoraX Drive is built on the principle that your data belongs to you. 
                We use zero-knowledge encryption for Gold and Platinum plans, meaning even we cannot see your files. 
                We do not read, scan, or sell your personal information.
              </p>
              <button className="text-indigo-600 font-bold text-sm mt-3 hover:underline">Read our full Privacy Policy</button>
           </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
        <Card className="rounded-2xl border-red-100 bg-red-50/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Export All Account Data</p>
                <p className="text-sm text-slate-500">Download a full archive of your metadata and activity logs</p>
              </div>
              <Button variant="outline" className="border-slate-200"><Download size={16} className="mr-2" /> Export</Button>
            </div>
            <div className="pt-4 border-t border-red-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-red-600">Delete Account</p>
                <p className="text-sm text-slate-500">Permanently remove all files and data. This cannot be undone.</p>
              </div>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
