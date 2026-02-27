import React, { useState } from 'react';
import { useAuth, PlanType } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Shield, Zap, Database, ArrowLeft, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    storage: '5 GB',
    features: ['Basic sharing', 'Standard encryption', 'Community support'],
    missing: ['Smart Collections', 'Advanced Analytics', 'Zero-knowledge', 'Priority Support'],
    color: 'slate'
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '10',
    currency: 'PKR',
    storage: '10 GB',
    features: ['Limited offline', 'Version history (30 days)', 'Standard encryption'],
    missing: ['Smart Collections', 'Advanced Analytics', 'Zero-knowledge'],
    color: 'zinc'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '99',
    currency: 'PKR',
    storage: '100 GB',
    features: ['Smart collections', 'Advanced sharing', 'Analytics', 'Priority Support'],
    missing: [],
    recommended: true,
    color: 'amber'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '399',
    currency: 'PKR',
    storage: '1 TB',
    features: ['Zero-knowledge encryption', 'Security panel', 'Audit logs', '24/7 Support'],
    missing: [],
    color: 'indigo'
  }
];

export default function Plans() {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSelectPlan = (planId: string) => {
    if (planId === user?.plan) return;
    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedPlan) {
      setTimeout(() => {
        updatePlan(selectedPlan as PlanType);
        toast.success(`Welcome to ${plans.find(p => p.id === selectedPlan)?.name} Plan 🚀`);
        setShowCheckout(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-xl font-bold text-slate-900">Plans & Billing</h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
            
          {/* Current Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-500 mb-1">Current Plan</h2>
              <div className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                {user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'} Plan
                {user?.plan === 'gold' && <Zap className="text-amber-500" fill="currentColor" />}
              </div>
              <p className="text-slate-500 mt-2 flex items-center gap-2">
                <Calendar size={16} /> Renews on 12 March 2026
              </p>
            </div>
            <div className="w-full md:w-1/3">
               <div className="flex justify-between text-sm font-medium mb-2">
                 <span>Storage Used</span>
                 <span>{user?.plan === 'gold' ? '42 GB / 100 GB' : '0 GB / 5 GB'}</span>
               </div>
               <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                 <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                        user?.plan === 'gold' ? "bg-amber-500 w-[42%]" : "bg-slate-400 w-[0%]"
                    )} 
                 />
               </div>
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-200 p-1 rounded-xl flex">
                <button
                    onClick={() => setBillingCycle('monthly')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        billingCycle === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBillingCycle('yearly')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        billingCycle === 'yearly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    Yearly <span className="text-green-600 text-xs">-20%</span>
                </button>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "bg-white rounded-2xl border p-6 flex flex-col relative overflow-hidden transition-all",
                  plan.recommended 
                    ? "border-amber-400 shadow-xl shadow-amber-100 ring-1 ring-amber-400" 
                    : "border-slate-200 shadow-sm hover:shadow-md",
                  user?.plan === plan.id && "opacity-80 pointer-events-none bg-slate-50"
                )}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    RECOMMENDED
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-slate-900 mb-6 flex items-baseline gap-1">
                   {plan.price === '0' ? 'Free' : (
                       <>
                        <span className="text-lg font-normal text-slate-500">{plan.currency}</span>
                        {plan.price}
                       </>
                   )}
                   {plan.price !== '0' && <span className="text-sm font-normal text-slate-400">/mo</span>}
                </div>

                <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 font-bold text-slate-800">
                        <Database size={20} className={cn(
                            plan.id === 'gold' ? 'text-amber-500' : 
                            plan.id === 'platinum' ? 'text-indigo-500' : 'text-slate-400'
                        )} />
                        {plan.storage}
                    </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                            {feature}
                        </div>
                    ))}
                    {plan.missing.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-slate-400">
                            <X size={16} className="text-slate-300 mt-0.5 shrink-0" />
                            {feature}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={user?.plan === plan.id}
                    className={cn(
                        "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all",
                        user?.plan === plan.id 
                            ? "bg-slate-100 text-slate-400 cursor-default" 
                            : plan.recommended
                                ? "bg-amber-400 hover:bg-amber-500 text-white shadow-lg shadow-amber-200"
                                : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
                    )}
                >
                    {user?.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Confirm Subscription</h3>
                        <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div>
                                <div className="font-bold text-slate-900">{plans.find(p => p.id === selectedPlan)?.name} Plan</div>
                                <div className="text-sm text-slate-500">{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing</div>
                            </div>
                            <div className="font-bold text-xl">
                                {plans.find(p => p.id === selectedPlan)?.price} <span className="text-sm font-normal text-slate-500">PKR</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">Payment Method</label>
                            <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-indigo-500 transition-colors bg-white">
                                <CreditCard size={20} className="text-slate-400" />
                                <span className="flex-1 font-medium">•••• •••• •••• 4242</span>
                                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmPurchase}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            Pay & Subscribe
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
