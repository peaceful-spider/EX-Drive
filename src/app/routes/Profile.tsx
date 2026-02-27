import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  User, Mail, Calendar, Shield, Smartphone, ArrowRight, 
  Settings as SettingsIcon, LogOut, CheckCircle2, 
  ShieldCheck, CreditCard, ChevronRight, Edit3, Camera
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Top Section - Identity */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="rounded-full">
                <SettingsIcon size={20} className="text-slate-400" />
             </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-indigo-50 ring-4 ring-white shadow-sm">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-indigo-600 text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors group-hover:scale-110">
                <Camera size={16} className="text-slate-600" />
              </button>
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100">
                  {user.plan.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-green-600 font-medium text-sm">Verified Account</span>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <Button size="sm" variant="outline" className="rounded-full h-8 gap-2">
                  <Edit3 size={14} />
                  Edit Name
                </Button>
                <Button size="sm" variant="outline" className="rounded-full h-8 gap-2">
                  <ShieldCheck size={14} />
                  Verify Email
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Account Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={14} /> Member Since</span>
                <span className="font-medium text-slate-900">January 2024</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Smartphone size={14} /> Last Login Device</span>
                <span className="font-medium text-slate-900">Chrome on MacOS</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Last Login Location</span>
                <span className="font-medium text-slate-900">San Francisco, US</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Storage & Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Active Plan</span>
                <span className="font-medium text-indigo-600 flex items-center gap-1">
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Storage Used</span>
                  <span className="font-medium">4.2 GB / 10 GB</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[42%] transition-all duration-1000" />
                </div>
              </div>
              <Button variant="link" onClick={() => navigate('/settings')} className="p-0 h-auto text-indigo-600 font-medium hover:no-underline">
                Manage Plan <ArrowRight size={14} className="ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Connected Accounts */}
        <Card className="rounded-2xl border-slate-200 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 -mx-6 px-6">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Google Account</div>
                  <div className="text-sm text-slate-500">Connected as {user.email}</div>
                </div>
              </div>
              <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">Disconnect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Snapshot */}
        <Card className="rounded-2xl border-slate-200 overflow-hidden bg-indigo-900 text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <Shield size={32} className="text-white" />
               </div>
               <div>
                  <h3 className="text-xl font-bold">Security Score: 85/100</h3>
                  <p className="text-indigo-200">Your account is well protected. Enable 2FA for 100%.</p>
               </div>
            </div>
            <div className="flex gap-3">
               <Button onClick={() => navigate('/settings')} className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-6 py-6 rounded-xl">
                  Manage Security
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <Button onClick={() => navigate('/settings')} variant="outline" className="flex-1 py-6 rounded-2xl border-slate-200 hover:bg-slate-100 transition-all text-slate-700 font-bold gap-3">
            <SettingsIcon size={20} />
            Go to Settings
          </Button>
          <Button variant="outline" className="flex-1 py-6 rounded-2xl border-slate-200 hover:bg-slate-100 transition-all text-slate-700 font-bold gap-3">
            <CreditCard size={20} />
            Manage Plan
          </Button>
          <Button onClick={handleLogout} variant="outline" className="flex-1 py-6 rounded-2xl border-red-100 hover:bg-red-50 transition-all text-red-600 font-bold gap-3">
            <LogOut size={20} />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
