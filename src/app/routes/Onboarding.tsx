import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Check, Zap, Layers, Lock, Shield, ArrowRight, LayoutGrid, HardDrive } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

type OnboardingStep = 'mode-selection' | 'plan-overview';

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>('mode-selection');
  const { setPowerMode, updatePlan, user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'simple' | 'power'>('simple');

  const handleModeSelect = (mode: 'simple' | 'power') => {
    setSelectedMode(mode);
  };

  const handleContinueMode = () => {
    setPowerMode(selectedMode === 'power');
    setStep('plan-overview');
  };

  const handleComplete = () => {
    completeOnboarding();
    toast.success('Welcome to ElgoraX Drive!');
    // Navigate to dashboard (which would show the optional tour)
    // But for now let's just navigate to dashboard and let the tour trigger
    // Actually, let's mark onboarding as NOT seen in context so dashboard triggers tour
    navigate('/dashboard');
  };

  const handleUpgrade = () => {
    updatePlan('gold');
    handleComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] bg-indigo-50/80 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-4xl z-10 relative">
        <AnimatePresence mode="wait">
          {step === 'mode-selection' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl font-bold text-slate-900 mb-2">How do you work?</h1>
              <p className="text-slate-500 mb-12 text-center max-w-md">
                Choose your interface style. You can always change this later in settings.
              </p>

              <div className="grid md:grid-cols-2 gap-8 w-full mb-12">
                {/* Simple Mode */}
                <div
                  onClick={() => handleModeSelect('simple')}
                  className={cn(
                    "bg-white p-8 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-xl relative overflow-hidden group",
                    selectedMode === 'simple' 
                      ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]" 
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="absolute top-4 right-4">
                    {selectedMode === 'simple' && (
                      <div className="bg-indigo-500 text-white p-1 rounded-full">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                    <LayoutGrid size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Simple Mode</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Clean, decluttered interface focused on browsing and viewing. Perfect for everyday use.
                  </p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-green-500" /> Minimal UI
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-green-500" /> Fewer controls
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-green-500" /> Beginner friendly
                    </li>
                  </ul>
                </div>

                {/* Power Mode */}
                <div
                  onClick={() => handleModeSelect('power')}
                  className={cn(
                    "bg-white p-8 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-xl relative overflow-hidden group",
                    selectedMode === 'power' 
                      ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]" 
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  )}
                >
                   <div className="absolute top-4 right-4">
                    {selectedMode === 'power' && (
                      <div className="bg-indigo-500 text-white p-1 rounded-full">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                    <Zap size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Power Mode</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Full control with advanced panels, analytics, and granular security settings.
                  </p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-blue-500" /> Advanced sidebars
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-blue-500" /> Detailed analytics
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-blue-500" /> Security controls
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleContinueMode}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-slate-900/10 transition-all flex items-center gap-3 text-lg"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 'plan-overview' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Storage Plan</h1>
                <p className="text-slate-500">
                  You're starting with the Free plan. Upgrade for full power.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Free Plan</h2>
                      <p className="text-sm text-slate-500">Active</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">0 GB <span className="text-base font-normal text-slate-400">/ 5 GB</span></div>
                    </div>
                  </div>

                  {/* Storage Bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-8">
                    <div className="bg-slate-300 w-[2%] h-full rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">Included</h4>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Check size={18} className="text-green-500" /> 5 GB Storage
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Check size={18} className="text-green-500" /> Basic Sharing
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                         <Shield size={18} className="text-green-500" /> Basic Encryption
                      </div>
                    </div>
                    
                    <div className="space-y-3 opacity-60">
                      <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">Locked</h4>
                      <div className="flex items-center gap-3 text-slate-500 group cursor-help relative">
                        <Lock size={18} /> Smart Collections
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Available in Gold</div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 group cursor-help relative">
                        <Lock size={18} /> Advanced Analytics
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Available in Gold</div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 group cursor-help relative">
                        <Lock size={18} /> Zero-Knowledge Key
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Available in Gold</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                  <p className="text-sm text-slate-500 italic">
                    "Google gives 15 GB. We give real ownership."
                  </p>
                  <div className="flex gap-4">
                     <button
                      onClick={handleComplete}
                      className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                    >
                      Maybe later
                    </button>
                    <button
                      onClick={handleUpgrade}
                      className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                    >
                      <Zap size={18} fill="currentColor" />
                      Upgrade to Gold
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}