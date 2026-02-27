import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Check, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

interface TourOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

const steps = [
  {
    targetId: 'tour-upload-btn',
    title: 'Upload',
    description: 'Upload your first file to get started.',
    position: 'right'
  },
  {
    targetId: 'tour-file-list', 
    title: 'Organize with Tags',
    description: 'Right-click any file to add custom tags for easy organization.',
    position: 'center' 
  },
  {
    targetId: 'tour-shared-nav',
    title: 'Share with Control',
    description: 'Manage access and set permissions for your shared files.',
    position: 'right'
  },
  {
    id: 'upsell',
    title: 'Unlock Smart Collections',
    description: 'Automate your organization with Gold Plan.',
    isModal: true
  }
];

export function TourOverlay({ isOpen, onComplete, onDismiss }: TourOverlayProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { updatePlan } = useAuth();
  const navigate = useNavigate();

  const updateRect = useCallback(() => {
    if (step >= steps.length) return;
    const currentStep = steps[step];
    if (currentStep.isModal) {
      setTargetRect(null);
      return;
    }

    const el = document.getElementById(currentStep.targetId || '');
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
        // Fallback or skip if element not found
        console.warn(`Tour element ${currentStep.targetId} not found`);
        setTargetRect(null); 
    }
  }, [step, steps]);

  useEffect(() => {
    if (isOpen) {
      updateRect();
      window.addEventListener('resize', updateRect);
      return () => window.removeEventListener('resize', updateRect);
    }
  }, [isOpen, step, updateRect]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleUpgrade = () => {
    updatePlan('gold');
    onComplete();
    navigate('/plans'); // Or just stay and show success
  };

  if (!isOpen) return null;

  const currentStep = steps[step];
  const isModal = currentStep.isModal;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      <AnimatePresence>
        {/* Backdrop / Spotlight Mask */}
        {!isModal && targetRect && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 transition-colors duration-500 pointer-events-auto"
                style={{
                    maskImage: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 10}px, black ${Math.max(targetRect.width, targetRect.height) / 2 + 20}px)`,
                    WebkitMaskImage: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 10}px, black ${Math.max(targetRect.width, targetRect.height) / 2 + 20}px)`
                }}
             />
        )}
        
        {isModal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 pointer-events-auto backdrop-blur-sm"
            />
        )}

        {/* Tooltip / Modal Content */}
        {!isModal && targetRect && (
             <motion.div
                key={step}
                initial={{ opacity: 0, y: 10, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute pointer-events-auto"
                style={{
                    top: targetRect.top + (currentStep.position === 'center' ? targetRect.height/2 - 100 : targetRect.height/2),
                    left: currentStep.position === 'right' 
                        ? targetRect.right + 20 
                        : currentStep.position === 'center' 
                            ? targetRect.left + targetRect.width/2 - 160 
                            : targetRect.left,
                }}
             >
                <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-xs relative animate-bounce-subtle">
                    {/* Arrow Pointer */}
                    {currentStep.position === 'right' && (
                        <div className="absolute top-6 -left-2 w-4 h-4 bg-white transform rotate-45" />
                    )}

                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step {step + 1} of {steps.length}</span>
                        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{currentStep.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        {currentStep.description}
                    </p>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleNext}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
             </motion.div>
        )}

        {/* Upsell Modal */}
        {isModal && (
            <motion.div
                key="modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto p-4"
            >
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
                    
                    <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Zap size={32} fill="currentColor" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentStep.title}</h2>
                    <p className="text-slate-600 mb-8">
                        {currentStep.description}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleUpgrade}
                            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            Upgrade to Gold
                        </button>
                        <button 
                            onClick={onComplete}
                            className="w-full bg-transparent hover:bg-slate-50 text-slate-500 font-medium py-3 px-6 rounded-xl transition-all"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </motion.div>
        )}

      </AnimatePresence>
    </div>,
    document.body
  );
}
