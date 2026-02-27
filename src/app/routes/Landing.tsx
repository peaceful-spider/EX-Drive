import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Shield, Cloud, Folder, Share2, Lock, Zap, Search, Tag, 
  BarChart, Clock, Download, ChevronDown, Check, X, 
  Smartphone, Chrome, ArrowRight, FileText, Users, 
  Star, Eye, Sparkles, TrendingUp, Database, Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Helmet } from "react-helmet-async";
import emailjs from '@emailjs/browser';

// Import screenshots
import dashboardImg from '../../assets/dashboard.png';
import storageAnalyticsImg from '../../assets/storage.png';
import fileManagerImg from '../../assets/file.png';
import logo from '../../assets/logo2.png';
import logo2 from '../../assets/logo.png';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'preview', label: 'Preview' },
  { id: 'why', label: 'Why ElgoraX' },
  { id: 'plans', label: 'Plans' },
  { id: 'security', label: 'Security' },
  { id: 'features', label: 'Features' },
  { id: 'status', label: 'Status' },
  { id: 'faq', label: 'FAQs' }
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Can I migrate files from my current storage solution to ElgoraX Drive?',
    answer: 'Yes! ElgoraX Drive supports seamless migration from popular cloud storage services. You can import your files directly or upload them manually. Our migration tool maintains your folder structure and file metadata.'
  },
  {
    question: 'How much storage do I get with ElgoraX Drive?',
    answer: 'We offer flexible storage options: Free Plan (2GB), Silver Plan (10GB), Gold Plan (100GB - Most Popular), and Platinum Plan (1TB). Each plan is designed to meet different user needs from casual users to power users.'
  },
  {
    question: 'What\'s different about the business version of ElgoraX Drive?',
    answer: 'The Platinum plan includes enterprise-grade features like zero-knowledge encryption, advanced sharing permissions, audit logs, team collaboration tools, priority support, and multi-device access for up to 10+ devices.'
  },
  {
    question: 'Is my data secure with ElgoraX Drive?',
    answer: 'Absolutely. We use military-grade encryption, zero-knowledge architecture (Platinum plan), secure authentication, and privacy-focused file access controls. Your data is encrypted both in transit and at rest.'
  },
  {
    question: 'Can I access my files offline?',
    answer: 'Yes! Silver plan and above include offline file access. You can mark files for offline availability and access them without an internet connection. Changes sync automatically when you reconnect.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, mobile wallets (JazzCash, Easypaisa), and bank transfers. All payments are processed securely through our payment partners.'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [email, setEmail] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandAllFAQs, setExpandAllFAQs] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();


  // Email Sending 
  useEffect(() => {
  emailjs.init("pIoaJ2UGEnXZCR247"); // ← paste your public key here
}, []);

  // Check if opened as PWA and redirect to login
  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone ||
                  document.referrer.includes('android-app://');
    
    if (isPWA) {
      // If opened as installed PWA app, redirect to login
      navigate('/auth');
    }
  }, [navigate]);

  // Show mobile app popup on page load
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('mobilePopupSeen');
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!hasSeenPopup && isMobile && !isPWA) {
      setTimeout(() => setShowMobilePopup(true), 2000);
    }
  }, []);

  // Intersection Observer for section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetHeight - 100;
        setIsNavSticky(window.scrollY > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email.trim() || !email.includes('@')) {
    toast.error("Please enter a valid email");
    return;
  }

  try {
    const currentTime = new Date().toLocaleString();

    // Base params matching your template placeholders
    const baseParams = {
      user_email: email,          // for {{user_email}} in both templates
      email: email,               // for {{email}} in thank-you template
      timestamp: currentTime,     // for {{timestamp}} in admin template
      from_name: "ElgoraX Waitlist",
      reply_to: email,
    };

    // 1. Send to YOU (admin notification) - override recipient
    await emailjs.send(
      "service_nyleqdt",
      "template_3964w4y",  // New Signup template
      {
        ...baseParams,
        to_email: "elgorax.info@gmail.com"  // force it here (even if dashboard has it)
      }
    );

    // 2. Send thank you to USER - provide the dynamic recipient
    await emailjs.send(
      "service_nyleqdt",
      "template_36b7x2d",  // Thank You template
      {
        ...baseParams,
        to_email: email,     // this matches {{email}} placeholder
      }
    );

    toast.success("Thank you! We'll notify you when we launch 🚀");
    setEmail('');
  } catch (err: any) {
    console.error("EmailJS full error:", err);
    toast.error("Failed to join waitlist – please try again.");
  }
};

  const closeMobilePopup = () => {
    setShowMobilePopup(false);
    sessionStorage.setItem('mobilePopupSeen', 'true');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  return (

    <>
    <Helmet>

<title>Secure Cloud Storage for Business & Personal Files | ElgoraX Drive</title>

<meta name="description" content="ElgoraX Drive is a secure privacy-first cloud storage platform for businesses, students, and professionals. Upload, organize, and share files safely with encrypted storage."/>

<meta name="keywords" content="secure cloud storage, encrypted file storage, cloud drive Pakistan, business cloud storage, google drive alternative"/>

<link rel="canonical" href="https://exdrive.durahoiltraders.com/" />

<meta property="og:title" content="ElgoraX Drive Secure Cloud Storage"/>
<meta property="og:description" content="Modern encrypted cloud storage built for privacy, organization, and secure sharing."/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://exdrive.durahoiltraders.com"/>

</Helmet>
    
    <div className="relative bg-white">
      {/* Mobile App Install Popup */}
      <AnimatePresence>
        {showMobilePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeMobilePopup}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeMobilePopup}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-xl border border-slate-100 overflow-hidden p-2">
                  <ImageWithFallback src={logo} alt="ElgoraX Logo" className="w-full h-full object-contain" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Get ElgoraX Drive App
                </h3>
                <p className="text-slate-600 mb-6">
                  Download our mobile app for the best experience with offline access and instant sync.
                </p>

                <button
                  onClick={() => {
                    toast.info('App coming soon to App Store & Play Store');
                    closeMobilePopup();
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all mb-3"
                >
                  Download App
                </button>
                
                <button
                  onClick={closeMobilePopup}
                  className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                >
                  Continue in Browser
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

     {/* Sticky Navigation - Hidden on mobile */}
<motion.nav
  ref={navRef}
  layout
  initial={false}
  animate={{
    bottom: isNavSticky ? 'auto' : 16,
    top: isNavSticky ? 0 : 'auto',
    y: 0,
    opacity: isNavSticky ? 1 : 1, // keep smooth even when hidden
  }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  className={cn(
    "z-50 hidden md:block", // ← THIS LINE hides it completely on mobile (< md)
    isNavSticky 
      ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100" 
      : "fixed bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-[95vw]"
  )}
>
  <div className={cn(
    "flex items-center gap-3",
    isNavSticky ? "justify-between max-w-7xl mx-auto px-6 py-3" : "bg-white/95 backdrop-blur-lg shadow-xl border border-slate-200 px-4 py-2 rounded-full"
  )}>
    {isNavSticky && (
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-100 p-1 shadow-sm overflow-hidden">
          <ImageWithFallback src={logo} alt="ElgoraX Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-bold text-slate-900 text-lg hidden sm:inline">ElgoraX</span>
      </div>
    )}

    <div className={cn(
      "flex items-center gap-1 overflow-x-auto no-scrollbar",
      isNavSticky ? "flex-1 justify-center mx-4" : "flex-nowrap"
    )}>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0",
            activeSection === section.id
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          {section.label}
        </button>
      ))}
    </div>

    {isNavSticky && (
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate('/auth')}
          className="hidden md:flex bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
        >
          Log In
        </button>
        <button
          onClick={() => navigate('/auth')}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
        >
          Get Started
        </button>
      </div>
    )}
  </div>
</motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Top Header for Mobile when nav is at bottom */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-center lg:justify-start z-20 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3  backdrop-blur-md px-5 py-2.5  pointer-events-auto"
          >
            <div className="w-10 h-10  rounded-xl flex items-center justify-center p-1 overflow-hidden">
              <ImageWithFallback src={logo} alt="ElgoraX Logo" className="w-full h-full object-contain" />
            </div>
            </motion.div>
        </div>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles size={16} />
              <span>Privacy-First Cloud Storage</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Secure Cloud Storage for Business<br />
              <span className="text-indigo-600"> Students & Professionals.</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl">
              ElgoraX Drive is a modern cloud platform designed to help individuals and organizations securely store, organize, and share their files with full control and privacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={() => navigate('/auth')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <Eye size={20} />
                View Demo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('status')}
                className="bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 px-8 rounded-xl shadow-lg border-2 border-slate-200 transition-all"
              >
                Join Waitlist
              </button>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-100 border border-slate-200 rounded-xl p-4 inline-block"
            >
              <p className="text-sm font-semibold text-slate-700 mb-2">🎯 Try Demo (Fully Functional)</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Email:</strong> demo@elgorax.com</p>
                <p><strong>Password:</strong> Demo@123</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 w-32 h-32 bg-indigo-500 rounded-2xl opacity-20 blur-xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 w-40 h-40 bg-blue-500 rounded-2xl opacity-20 blur-xl"
              />
              
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
                <img 
                  src={dashboardImg} 
                  alt="ElgoraX Drive Dashboard" 
                  className="w-full rounded-lg"
                />
              </div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-200"
              >
                <Shield className="w-8 h-8 text-indigo-600" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-200"
              >
                <Cloud className="w-8 h-8 text-blue-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="preview" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              See ElgoraX Drive in Action
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience a clean, powerful dashboard built for modern workflows. Organize files, manage folders, track versions, and control security — all from one intelligent workspace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            >
              <img src={fileManagerImg} alt="File Manager" className="w-full" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart File Manager</h3>
                <p className="text-slate-600">Organize with tags, collections, and advanced search filters.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            >
              <img src={storageAnalyticsImg} alt="Storage Analytics" className="w-full" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Storage Analytics</h3>
                <p className="text-slate-600">Track usage, find duplicates, and optimize your storage.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why ElgoraX Drive */}
      <section id="why" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose ElgoraX Drive
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Your files remain under your control', desc: 'Full ownership with zero-knowledge encryption' },
              { icon: Zap, title: 'Fast modern interface', desc: 'Lightning-fast performance on any device' },
              { icon: Folder, title: 'Smart organization system', desc: 'Tags, collections, and intelligent search' },
              { icon: Smartphone, title: 'Works on desktop & mobile', desc: 'Seamless experience across all platforms' },
              { icon: Users, title: 'Simple and power modes', desc: 'Perfect for beginners and power users' },
              { icon: Shield, title: 'Enterprise-grade security', desc: 'Military-level encryption and protection' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Flexible Plans for Everyone
            </h2>
            <p className="text-slate-600 text-lg">Start free. Upgrade only when you need more power.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900">₨0</span>
                <span className="text-slate-600">/month</span>
              </div>
              <p className="text-slate-600 mb-6">2GB secure storage for everyday files.</p>
              <ul className="space-y-3 mb-6">
                {['2GB Storage', 'Basic Upload', 'Basic Sharing', 'Community Support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check size={16} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-slate-100 text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-all">
                Get Started
              </button>
            </motion.div>

            {/* Silver Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Silver</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900">₨10</span>
                <span className="text-slate-600">/month</span>
              </div>
              <p className="text-slate-600 mb-6">Perfect for students and individuals.</p>
              <ul className="space-y-3 mb-6">
                {['10GB Storage', 'Version History', 'Tags & Collections', 'Offline Access', 'Email Support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check size={16} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all">
                Choose Silver
              </button>
            </motion.div>

            {/* Gold Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 border-2 border-indigo-500 shadow-2xl relative scale-105"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Gold</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">₨99</span>
                <span className="text-indigo-200">/month</span>
              </div>
              <p className="text-indigo-100 mb-6">For professionals and freelancers.</p>
              <ul className="space-y-3 mb-6">
                {['100GB Storage', 'Smart Collections', 'Advanced Sharing', 'Storage Analytics', 'Priority Support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white">
                    <Check size={16} className="text-yellow-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-all">
                Choose Gold
              </button>
            </motion.div>

            {/* Platinum Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-2 border-slate-700 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Platinum</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">₨299</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-300 mb-6">Enterprise-level security and features.</p>
              <ul className="space-y-3 mb-6">
                {['1TB Storage', 'Zero-Knowledge Encryption', 'Audit Logs', 'Team Sharing', 'WhatsApp Support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white">
                    <Check size={16} className="text-indigo-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-500 transition-all">
                Choose Platinum
              </button>
            </motion.div>
          </div>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Plans activate at official launch. Join waitlist for early access.
          </p>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Security Comes First
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              ElgoraX Drive is built with multiple layers of security, encrypted storage, protected authentication, and privacy-focused file access controls. Your data always remains protected.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'End-to-End Encryption', desc: 'Military-grade AES-256 encryption for all files' },
              { icon: Shield, title: 'Zero-Knowledge Architecture', desc: 'We never see your data, even on our servers' },
              { icon: Eye, title: 'Privacy Controls', desc: 'Advanced permissions and access management' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features Built for Modern Users
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, title: 'Smart Collections', color: 'indigo' },
              { icon: Clock, title: 'Version History', color: 'blue' },
              { icon: Download, title: 'Offline Access', color: 'green' },
              { icon: Search, title: 'Advanced Search', color: 'purple' },
              { icon: Share2, title: 'Secure Sharing', color: 'pink' },
              { icon: BarChart, title: 'Storage Analytics', color: 'orange' },
              { icon: Tag, title: 'Tag Management', color: 'teal' },
              { icon: TrendingUp, title: 'Sync Inspector', color: 'red' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                  `bg-${feature.color}-100`
                )}>
                  <feature.icon className={cn("w-6 h-6", `text-${feature.color}-600`)} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Status + Waitlist */}
      <section id="status" className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              ElgoraX Drive is currently in the final development stage. We are preparing for the official launch. Join the waiting list to get early access.
            </p>

            <form onSubmit={handleWaitlist} className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  Notify Me
                </button>
              </div>
            </form>

            <p className="text-sm text-slate-500">
              Join 1,000+ people waiting for launch
            </p>
          </motion.div>
        </div>
      </section>

      {/* About ElgoraX */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-28 h-28  rounded-2xl mb-6">
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="ElgoraX logo" className="w-24 h-24 rounded-lg object-cover" />
            
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Built by ElgoraX
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ElgoraX is a software development company focused on building modern automation systems, business software, ERP platforms, and secure digital solutions for organizations worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Curious about ElgoraX Drive?
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              Take a look at our FAQs to learn more.
            </p>
            <button
              onClick={() => setExpandAllFAQs(!expandAllFAQs)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-2 mx-auto"
            >
              {expandAllFAQs ? 'Collapse all' : 'Expand all'}
              <ChevronDown size={16} className={cn("transition-transform", expandAllFAQs && "rotate-180")} />
            </button>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isExpanded = expandAllFAQs || expandedFAQ === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(isExpanded ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
                  >
                    <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
                    <ChevronDown 
                      size={20} 
                      className={cn(
                        "text-slate-400 transition-transform flex-shrink-0",
                        isExpanded && "rotate-180"
                      )} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-5 text-slate-600 border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="hidden">
<h2>Secure Cloud Storage Platform</h2>

<p>
ElgoraX Drive provides encrypted cloud storage for businesses,
organizations, freelancers, and students needing secure file management,
document sharing, and privacy-focused online storage solutions.
</p>

</section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="ElgoraX logo" className="w-10 h-10 rounded-lg object-cover" />
                <span className="font-bold text-xl">ElgoraX Drive</span>
              </div>
              <p className="text-slate-400 text-sm">
                Privacy-first cloud storage built for modern users.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 ElgoraX Software Company. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm">
              elgorax.info@gmail.com
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
    </>
  );
}