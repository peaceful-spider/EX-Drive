import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, Eye, MousePointer, Smartphone, 
  Keyboard, Monitor, Accessibility, Moon, 
  Languages, Globe, MessageSquare, Info, Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';

export function NotificationSettings() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardContent className="divide-y divide-slate-100 p-0">
            {[
              { label: 'File shared with me', desc: 'Notify when someone shares a file' },
              { label: 'File edited', desc: 'Notify when a shared file is updated' },
              { label: 'Expiring links', desc: 'Warn before a share link expires' },
              { label: 'Storage warnings', desc: 'Notify when approaching storage limit' },
              { label: 'Billing alerts', desc: 'Invoices and subscription updates' },
            ].map((item) => (
              <div key={item.label} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export function AccessibilitySettings() {
  const { isPowerMode, setPowerMode } = useAuth();

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Interface & Accessibility</h2>
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardContent className="divide-y divide-slate-100 p-0">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Zap size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900">Power Mode</p>
                    <p className="text-sm text-slate-500">Enable advanced features and compact UI</p>
                 </div>
              </div>
              <Switch checked={isPowerMode} onCheckedChange={setPowerMode} />
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><Monitor size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900">Layout Density</p>
                    <p className="text-sm text-slate-500">Adjust the spacing between items</p>
                 </div>
              </div>
              <Select defaultValue="comfortable">
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><Keyboard size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900">Keyboard Shortcuts</p>
                    <p className="text-sm text-slate-500">View and customize shortcuts</p>
                 </div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><MousePointer size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900">Reduced Motion</p>
                    <p className="text-sm text-slate-500">Minimize animations throughout the app</p>
                 </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Regional</h2>
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardContent className="divide-y divide-slate-100 p-0">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><Languages size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900">Language</p>
                    <p className="text-sm text-slate-500">Choose your preferred language</p>
                 </div>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="ur">Urdu (اردو)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
