import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Shield, Mail, ArrowRight, Eye, EyeOff, Check, Lock, AlertCircle, User, Chrome } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

type AuthStep = 'gateway' | 'login' | 'signup' | 'verify-email' | 'welcome';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function Auth() {
  const [step, setStep] = useState<AuthStep>('gateway');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  // Welcome Animation State
  const [welcomeText, setWelcomeText] = useState('');
  const fullWelcomeText = `Welcome ${fullName || 'User'}`;
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Password Strength Calculator
  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score: 5, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Validation Functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (pwd: string, isSignup: boolean): boolean => {
    if (!pwd) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (isSignup) {
      if (pwd.length < 8) {
        setPasswordError('Password must be at least 8 characters');
        return false;
      }
      if (!/[A-Z]/.test(pwd)) {
        setPasswordError('Password must contain at least 1 uppercase letter');
        return false;
      }
      if (!/[0-9]/.test(pwd)) {
        setPasswordError('Password must contain at least 1 number');
        return false;
      }
      if (!/[^A-Za-z0-9]/.test(pwd)) {
        setPasswordError('Password must contain at least 1 special character');
        return false;
      }
    }
    
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (pwd: string, confirmPwd: string): boolean => {
    if (!confirmPwd) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (pwd !== confirmPwd) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name || name.trim().length < 2) {
      setNameError('Please enter your full name');
      return false;
    }
    setNameError('');
    return true;
  };

  useEffect(() => {
    if (isAuthenticated && step !== 'welcome' && step !== 'verify-email') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, step]);

  useEffect(() => {
    if (step === 'welcome') {
      let i = 0;
      const interval = setInterval(() => {
        setWelcomeText(fullWelcomeText.slice(0, i + 1));
        i++;
        if (i === fullWelcomeText.length) {
          clearInterval(interval);
          setTimeout(() => setShowSubtitle(true), 300);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1200);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, fullWelcomeText, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, false);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    await login(email, fullName || 'User');
    setIsLoading(false);
    toast.success('Successfully logged in!');
    setStep('welcome');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, true);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('Please accept the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await login(email, fullName);
    setIsLoading(false);
    toast.success('Account created successfully!');
    setStep('verify-email');
  };

  const handleDemoAuth = async () => {
    setIsLoading(true);
    setFullName('Demo User');
    setEmail('demo@elgorax.com');
    await new Promise(resolve => setTimeout(resolve, 600));
    await login('demo@elgorax.com', 'Demo User');
    setIsLoading(false);
    toast.success('Successfully logged in as Demo User!');
    setStep('welcome');
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const googleName = 'Google User';
    setFullName(googleName);
    setEmail('google-user@example.com');
    await new Promise(resolve => setTimeout(resolve, 600));
    await login('google-user@example.com', googleName);
    setIsLoading(false);
    toast.success('Successfully authenticated with Google!');
    setStep('welcome');
  };

  const handleVerifyLater = () => {
    toast.info('You can verify your email later in settings');
    setStep('welcome');
  };

  const switchToLogin = () => {
    setStep('login');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');
    setConfirmPassword('');
    setAgreedToTerms(false);
  };

  const switchToSignup = () => {
    setStep('signup');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-md z-10">
        <AnimatePresence mode="wait">
          {step === 'gateway' && (
            <motion.div
              key="gateway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 mb-4"
              >
                <Shield className="w-12 h-12 text-indigo-600" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Your files. Your rules.
                </h1>
                <p className="text-slate-500 text-lg">
                  Privacy-first cloud storage built for control.
                </p>
              </div>

              <div className="w-full space-y-3 pt-4">
                <button
                  onClick={handleDemoAuth}
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-3"
                >
                  <Zap className="w-5 h-5" fill="currentColor" />
                  Try Demo Instantly
                </button>

                <button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-3 relative group overflow-hidden"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => setStep('login')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Continue with Email
                </button>
              </div>

              <p className="text-xs text-slate-400 max-w-xs mx-auto pt-8">
                By continuing, you acknowledge that ElgoraX encrypts your data locally before upload.
              </p>
            </motion.div>
          )}

          {(step === 'login' || step === 'signup') && (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95, x: step === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: step === 'signup' ? -20 : 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full"
            >
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-slate-900">
                  {step === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-slate-500 mt-2">
                  {step === 'login' 
                    ? 'Enter your credentials to access your drive.' 
                    : 'Get started with 5GB free encrypted storage.'}
                </p>
              </motion.div>

              <form onSubmit={step === 'login' ? handleLogin : handleSignup} className="space-y-4">
                <AnimatePresence mode="wait">
                  {step === 'signup' && (
                    <motion.div
                      key="fullname-field"
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <User size={14} className="inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all",
                          nameError && "border-red-300 bg-red-50/30"
                        )}
                        placeholder="Enter your full name"
                        required
                      />
                      {nameError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertCircle size={12} />
                          {nameError}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Mail size={14} className="inline mr-1" />
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all",
                      emailError && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="you@example.com"
                    required
                  />
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {emailError}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Lock size={14} className="inline mr-1" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-10",
                        passwordError && "border-red-300 bg-red-50/30"
                      )}
                      placeholder={step === 'signup' ? "Create a strong password" : "••••••••"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {passwordError}
                    </motion.p>
                  )}
                  {step === 'signup' && password.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all duration-300",
                              i <= passwordStrength.score ? passwordStrength.color : "bg-slate-100"
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn(
                        "text-xs mt-1 font-medium",
                        passwordStrength.score <= 2 ? "text-red-500" :
                        passwordStrength.score <= 3 ? "text-yellow-500" :
                        passwordStrength.score <= 4 ? "text-blue-500" : "text-green-500"
                      )}>
                        Password strength: {passwordStrength.label}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                <AnimatePresence mode="wait">
                  {step === 'signup' && (
                    <motion.div
                      key="confirm-password-field"
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <Check size={14} className="inline mr-1" />
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-10",
                            confirmPasswordError && "border-red-300 bg-red-50/30"
                          )}
                          placeholder="Re-enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {confirmPasswordError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertCircle size={12} />
                          {confirmPasswordError}
                        </motion.p>
                      )}
                      {!confirmPasswordError && confirmPassword && password === confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-green-500 text-xs mt-1 flex items-center gap-1"
                        >
                          <Check size={12} />
                          Passwords match
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step === 'signup' && (
                    <motion.div 
                      key="terms-checkbox"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-2"
                    >
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-0.5 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                          I agree to the <a href="#" className="text-indigo-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</a>
                        </span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all mt-6 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {step === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div 
                className="mt-6 text-center text-sm text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {step === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={switchToSignup} className="text-indigo-600 font-semibold hover:underline transition-colors">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={switchToLogin} className="text-indigo-600 font-semibold hover:underline transition-colors">
                      Log in
                    </button>
                  </>
                )}
              </motion.div>
              
              <motion.div 
                className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Lock size={12} />
                <span>We never read your files. Zero-knowledge encryption.</span>
              </motion.div>
            </motion.div>
          )}

          {step === 'verify-email' && (
            <motion.div
              key="verify-email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1, filter: ['drop-shadow(0 0 0px rgba(99, 102, 241, 0))', 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))', 'drop-shadow(0 0 0px rgba(99, 102, 241, 0))'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8 inline-block p-6 bg-white rounded-3xl shadow-xl"
              >
                <Shield className="w-16 h-16 text-indigo-600" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-slate-900 mb-4 h-12">
                Verify your email
                <span className="animate-pulse">|</span>
              </h1>
              
              <AnimatePresence>
                {showSubtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl text-slate-500"
                  >
                    to ElgoraX Drive
                  </motion.p>
                )}
              </AnimatePresence>
              
              <p className="text-sm text-slate-500 mt-4">
                We have sent a verification email to <strong>{email}</strong>. Please check your inbox and click the link to verify your email address.
              </p>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleVerifyLater}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Verify later
                </button>
              </div>
            </motion.div>
          )}

          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1, filter: ['drop-shadow(0 0 0px rgba(99, 102, 241, 0))', 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))', 'drop-shadow(0 0 0px rgba(99, 102, 241, 0))'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8 inline-block p-6 bg-white rounded-3xl shadow-xl"
              >
                <Shield className="w-16 h-16 text-indigo-600" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-slate-900 mb-4 h-12">
                {welcomeText}
                <span className="animate-pulse">|</span>
              </h1>
              
              <AnimatePresence>
                {showSubtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl text-slate-500"
                  >
                    to ElgoraX Drive
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        
        {step === 'gateway' && (
             <div className="absolute bottom-8 left-0 w-full text-center text-xs text-slate-300">
                v1.0.0 • ElgoraX Security Inc.
             </div>
        )}
      </div>
    </div>
  );
}