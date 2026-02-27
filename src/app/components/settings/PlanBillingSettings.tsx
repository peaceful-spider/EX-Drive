import React from 'react';
import { useAuth, PlanType } from '../../context/AuthContext';
import { 
  Check, X, Zap, Crown, Shield, HardDrive, 
  Smartphone, CreditCard, ChevronRight, AlertCircle, Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    storage: '10 GB',
    features: ['Basic Encryption', '1 Device', '7-day History', 'Standard Support'],
    color: 'bg-slate-500'
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 999,
    storage: '100 GB',
    features: ['Advanced Encryption', '3 Devices', '30-day History', 'Priority Support', 'Smart Collections'],
    color: 'bg-indigo-500'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 2499,
    storage: '1 TB',
    features: ['Zero-Knowledge Encryption', '10 Devices', '90-day History', '24/7 Support', 'Role-based Permissions', 'Time-limited Links'],
    color: 'bg-amber-500'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 4999,
    storage: '5 TB',
    features: ['Military-Grade Encryption', 'Unlimited Devices', 'Unlimited History', 'Dedicated Manager', 'Watermarking', 'Device Restrictions'],
    color: 'bg-purple-500'
  }
];

export function PlanBillingSettings() {
  const { user, updatePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = React.useState<PlanType | null>(null);
  const [step, setStep] = React.useState(1);
  const [billingCycle, setBillingCycle] = React.useState('monthly');
  const [paymentMethod, setPaymentMethod] = React.useState('bank');
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const currentPlan = PLANS.find(p => p.id === user?.plan) || PLANS[0];

  const handleUpgrade = (planId: PlanType) => {
    setSelectedPlan(planId);
    setStep(1);
    setIsSuccess(false);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const processPayment = async () => {
    if (!agreeTerms) {
      toast.error('Please agree to the subscription terms');
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
    if (selectedPlan) {
      updatePlan(selectedPlan);
    }
  };

  const featureGroups = [
    {
      name: 'Storage & Files',
      features: [
        { name: 'Max Storage', status: 'Enabled', desc: currentPlan.storage },
        { name: 'Upload Size Limit', status: user?.plan === 'free' ? 'Limited' : 'Enabled', desc: user?.plan === 'free' ? '2GB' : 'Unlimited' },
        { name: 'Version History', status: 'Enabled', desc: user?.plan === 'free' ? '7 days' : '30+ days' },
      ]
    },
    {
      name: 'Sharing & Security',
      features: [
        { name: 'Role-based Access', status: user?.plan === 'free' ? 'Locked' : 'Enabled', desc: 'Granular permissions' },
        { name: 'Expiry Links', status: user?.plan === 'free' || user?.plan === 'silver' ? 'Locked' : 'Enabled', desc: 'Auto-deleting links' },
        { name: 'Zero-Knowledge Encryption', status: user?.plan === 'gold' || user?.plan === 'platinum' ? 'Enabled' : 'Locked', desc: 'Ultimate privacy' },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Active Plan Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Active Plan</h2>
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Active</Badge>
        </div>
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className={`p-8 md:w-1/3 flex flex-col justify-center items-center text-white ${currentPlan.color}`}>
              <Crown size={40} className="mb-2" />
              <h3 className="text-2xl font-bold">{currentPlan.name} Plan</h3>
              <p className="opacity-90">Current Subscription</p>
            </div>
            <div className="p-8 md:w-2/3 bg-white space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Billing Info</p>
                  <p className="text-slate-900 font-bold">Rs. {currentPlan.price}/mo</p>
                  <p className="text-xs text-slate-500">Next renewal: March 21, 2026</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Storage</p>
                  <p className="text-slate-900 font-bold">4.2 GB / {currentPlan.storage}</p>
                  <Progress value={42} className="h-1.5 mt-2" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Devices</p>
                  <p className="text-slate-900 font-bold">3 Active</p>
                  <p className="text-xs text-slate-500">Allowed: {currentPlan.id === 'free' ? '1' : currentPlan.id === 'silver' ? '3' : '10+'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <Button size="sm" variant="outline">Change Plan</Button>
                <Button size="sm" variant="outline">Update Payment</Button>
                <Button size="sm" variant="outline">View Invoices</Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-transparent">Cancel Subscription</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Feature Access Matrix */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Feature Access & Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureGroups.map((group) => (
            <Card key={group.name} className="rounded-2xl border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">{group.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.features.map((feature) => (
                  <div key={feature.name} className="flex items-start justify-between group">
                    <div>
                      <div className="font-bold text-slate-900">{feature.name}</div>
                      <div className="text-xs text-slate-500">{feature.desc}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge 
                        variant="secondary" 
                        className={
                          feature.status === 'Enabled' ? 'bg-green-100 text-green-700' : 
                          feature.status === 'Limited' ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-100 text-slate-400'
                        }
                      >
                        {feature.status}
                      </Badge>
                      {feature.status === 'Locked' && (
                        <button className="text-[10px] text-indigo-600 font-bold mt-1 hover:underline">Upgrade to unlock</button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Other Plans */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Compare & Upgrade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={`rounded-2xl border-slate-200 flex flex-col ${user?.plan === plan.id ? 'ring-2 ring-indigo-600 border-transparent shadow-md' : 'shadow-sm'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription>{plan.storage}</CardDescription>
                  </div>
                  {user?.plan === plan.id && <Badge className="bg-indigo-600">Current</Badge>}
                </div>
                <div className="mt-4">
                   <span className="text-2xl font-bold text-slate-900">Rs. {plan.price}</span>
                   <span className="text-slate-500 text-sm"> /mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full rounded-xl" 
                      variant={user?.plan === plan.id ? 'outline' : 'default'}
                      disabled={user?.plan === plan.id}
                      onClick={() => handleUpgrade(plan.id as PlanType)}
                    >
                      {user?.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
                    {/* Multi-step Upgrade Flow */}
                    {!isSuccess ? (
                      <div className="flex flex-col h-full">
                        <div className="bg-indigo-600 p-8 text-white relative">
                          <h2 className="text-2xl font-bold">Upgrade to {selectedPlan ? PLANS.find(p => p.id === selectedPlan)?.name : ''}</h2>
                          <p className="opacity-90">Step {step} of 3</p>
                          <div className="absolute -bottom-6 right-8 p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
                             <Zap className="text-amber-500" size={32} />
                          </div>
                        </div>

                        <div className="p-8 pt-10">
                          {step === 1 && (
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-bold text-lg mb-4">Plan Confirmation</h3>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                   <div className="flex justify-between font-medium">
                                      <span className="text-slate-500">Selected Plan</span>
                                      <span className="text-slate-900 font-bold uppercase">{selectedPlan}</span>
                                   </div>
                                   <div className="flex justify-between font-medium">
                                      <span className="text-slate-500">Price</span>
                                      <span className="text-slate-900 font-bold text-xl">Rs. {PLANS.find(p => p.id === selectedPlan)?.price}</span>
                                   </div>
                                   <div className="flex justify-between font-medium">
                                      <span className="text-slate-500">Storage</span>
                                      <span className="text-indigo-600 font-bold">{PLANS.find(p => p.id === selectedPlan)?.storage}</span>
                                   </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <Label>Billing Cycle</Label>
                                <RadioGroup value={billingCycle} onValueChange={setBillingCycle} className="flex gap-4">
                                  <div className="flex items-center space-x-2 flex-1 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                                    <RadioGroupItem value="monthly" id="monthly" />
                                    <Label htmlFor="monthly" className="flex-1 cursor-pointer">Monthly</Label>
                                  </div>
                                  <div className="flex items-center space-x-2 flex-1 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 relative">
                                    <RadioGroupItem value="yearly" id="yearly" />
                                    <Label htmlFor="yearly" className="flex-1 cursor-pointer">Yearly</Label>
                                    <Badge className="absolute -top-2 -right-2 bg-green-500">Save 20%</Badge>
                                  </div>
                                </RadioGroup>
                              </div>

                              <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 py-6 rounded-2xl">Cancel</Button>
                                <Button onClick={nextStep} className="flex-1 py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700">Continue</Button>
                              </div>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="space-y-6">
                              <h3 className="font-bold text-lg">Billing Details</h3>
                              <div className="space-y-3">
                                <div 
                                  onClick={() => setPaymentMethod('easypaisa')}
                                  className={`p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'easypaisa' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">EP</div>
                                    <span className="font-bold">Easypaisa</span>
                                  </div>
                                  {paymentMethod === 'easypaisa' && <Check className="text-indigo-600" />}
                                </div>
                                <div 
                                  onClick={() => setPaymentMethod('bank')}
                                  className={`p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"><CreditCard size={20} /></div>
                                    <span className="font-bold">Bank Transfer</span>
                                  </div>
                                  {paymentMethod === 'bank' && <Check className="text-indigo-600" />}
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Button variant="outline" onClick={prevStep} className="flex-1 py-6 rounded-2xl">Back</Button>
                                <Button onClick={nextStep} className="flex-1 py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700">Next</Button>
                              </div>
                            </div>
                          )}

                          {step === 3 && (
                            <div className="space-y-6">
                              <h3 className="font-bold text-lg">Payment Confirmation</h3>
                              <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Plan</span>
                                    <span className="font-bold">{PLANS.find(p => p.id === selectedPlan)?.name}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Cycle</span>
                                    <span className="font-bold uppercase">{billingCycle}</span>
                                 </div>
                                 <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                    <span className="text-slate-900 font-bold">Total Due Now</span>
                                    <span className="text-xl font-bold text-indigo-600">Rs. {PLANS.find(p => p.id === selectedPlan)?.price}</span>
                                 </div>
                              </div>

                              <div className="flex items-start space-x-2 pt-2">
                                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(c) => setAgreeTerms(!!c)} />
                                <Label htmlFor="terms" className="text-xs text-slate-500 leading-tight cursor-pointer">
                                  I agree to the subscription terms and conditions. I understand this will be billed {billingCycle}.
                                </Label>
                              </div>

                              <div className="flex gap-3">
                                <Button variant="outline" onClick={prevStep} className="flex-1 py-6 rounded-2xl" disabled={isProcessing}>Back</Button>
                                <Button 
                                  onClick={processPayment} 
                                  className="flex-1 py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold"
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center space-y-6 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                           <Check size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Payment Successful!</h2>
                        <p className="text-slate-500 max-w-xs mx-auto">
                          Your plan has been updated to {PLANS.find(p => p.id === selectedPlan)?.name} successfully.
                          All features are now unlocked.
                        </p>
                        <div className="pt-4 flex flex-col w-full gap-3">
                           <Button className="w-full py-6 rounded-2xl bg-slate-900 text-white font-bold">Go to Drive</Button>
                           <DialogTrigger asChild>
                              <Button variant="ghost" className="w-full py-6 rounded-2xl text-slate-500">View Plan Details</Button>
                           </DialogTrigger>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Expiry / Grace Period Warning (Simulated) */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4 text-amber-800">
         <div className="p-2 bg-amber-100 rounded-lg"><Clock size={20} /></div>
         <div className="flex-1">
            <p className="text-sm font-bold">7-Day Grace Period Active</p>
            <p className="text-xs opacity-80">Your Platinum plan trial ended. Files are safe, but uploads are limited until you subscribe.</p>
         </div>
         <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none">Renew Now</Button>
      </div>
    </div>
  );
}
