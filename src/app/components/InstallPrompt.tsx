import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // Detect mobile and check if already standalone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isStandalone = (window as any).matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    if (!isStandalone && (isIOS || isAndroid)) {
      // Show prompt after a short delay
      const timer = setTimeout(() => setShow(true), 3000);
      setPlatform(isIOS ? 'ios' : 'android');
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-[60] md:hidden"
      >
        <div className="bg-indigo-600 rounded-3xl p-6 shadow-2xl shadow-indigo-200 border border-indigo-500 text-white">
          <button 
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
               <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Install ElgoraX App</h3>
              <p className="text-sm text-indigo-100">Get a faster, offline-first experience.</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 mb-4">
             {platform === 'ios' ? (
               <div className="text-sm space-y-2">
                 <p className="flex items-center gap-2">1. Tap the <Share size={16} /> button in Safari</p>
                 <p className="flex items-center gap-2">2. Scroll down and tap "Add to Home Screen"</p>
               </div>
             ) : (
               <div className="text-sm space-y-2">
                 <p>1. Tap the three dots menu in Chrome</p>
                 <p>2. Tap "Install app" or "Add to Home screen"</p>
               </div>
             )}
          </div>

          <Button 
            onClick={() => setShow(false)}
            className="w-full py-6 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors"
          >
            Got it
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
