import React, { useState, useEffect } from 'react';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Wifi,
  FileText,
  Users,
  HardDrive,
  Calendar,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { ContactForm } from './components/ContactForm';
import { QuoteForm } from './components/QuoteForm';
import { UnifiedSubmissionForm } from './components/UnifiedSubmissionForm';
import { NewsletterForm } from './components/NewsletterForm';
import { ClientPortalModal } from './components/ClientPortalModal';
import { AlertBanner } from './components/AlertBanner';
import { AlertState } from './types/database';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user } = useAuth();
  const [activeFormTab, setActiveFormTab] = useState<'unified' | 'contact' | 'quote'>('unified');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [globalAlert, setGlobalAlert] = useState<AlertState | null>(null);

  // Check URL query parameters for native browser form POST redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const module = params.get('module');
    const submissionId = params.get('submission_id') || params.get('id');
    const error = params.get('error');

    if (status === 'success') {
      const moduleName = module === 'quotes' ? 'Quote Request' : module === 'subscribers' ? 'Newsletter Subscription' : 'Inquiry';
      setGlobalAlert({
        type: 'success',
        title: `${moduleName} Confirmed`,
        message: 'Your submission has been successfully processed and recorded. Our team will review your requirements.',
        id: submissionId || undefined,
      });

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (status === 'error') {
      setGlobalAlert({
        type: 'error',
        title: 'Submission Issue',
        message: error || 'The request could not be processed. Please try again.',
      });
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020b18] text-slate-100 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* -------------------------------------------------------------------
          1. TOP UTILITY BAR
          ------------------------------------------------------------------- */}
      <div className="bg-[#030d1a] border-b border-slate-800/80 text-xs text-slate-400 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              Alotau, Papua New Guinea
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="tel:+67582545274" className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              +675 82545274
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="mailto:kilsta2023@gmail.com" className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              kilsta2023@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              IPA Registration: <span className="text-teal-300 font-mono">6-129295384</span>
            </span>
            <button
              onClick={() => setIsPortalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
            >
              <UserIcon className="w-3 h-3 text-teal-400" />
              <span>{user ? (user.displayName || 'Client Portal') : 'Client Sign In'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          2. MAIN HEADER & NAVIGATION (Near Logo Tagline)
          ------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#020b18]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Sub-tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-extrabold text-lg tracking-wider">
              K
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">KILSTAR</span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-400 border-l border-slate-700 pl-2">
                  Business & ICT Consultants
                </span>
              </div>
              <p className="text-[11px] text-teal-400 font-medium tracking-wide">
                Enhancing through business and ICT innovations
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('hero')} className="hover:text-teal-400 transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="hover:text-teal-400 transition-colors cursor-pointer">
              Core Services
            </button>
            <button onClick={() => { setActiveFormTab('contact'); scrollToSection('forms-section'); }} className="hover:text-teal-400 transition-colors cursor-pointer">
              Inquiries
            </button>
            <button onClick={() => { setActiveFormTab('quote'); scrollToSection('forms-section'); }} className="hover:text-teal-400 transition-colors cursor-pointer">
              Get Quote
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveFormTab('quote'); scrollToSection('forms-section'); }}
              className="inline-flex items-center gap-1.5 bg-[#00a3a6] hover:bg-[#008f91] text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Audit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Alert Notification Banner */}
      {globalAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <AlertBanner alert={globalAlert} onDismiss={() => setGlobalAlert(null)} />
        </div>
      )}

      {/* -------------------------------------------------------------------
          3. MAIN HERO BANNER SECTION
          ------------------------------------------------------------------- */}
      <section id="hero" className="relative pt-14 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Kinetic Gradient Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,163,166,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.1),transparent_50%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-up">
          {/* Incorporation Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300 mb-6 shadow-md">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Locally Incorporated | IPA 6-129295384</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-teal-300 font-medium">Enterprise Cloud Infrastructure</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
            Advancing Businesses Through <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200">
              Strategic Technology & Advisory
            </span>
          </h1>

          {/* Welcoming Message */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white">Kilstar</strong>. We bridge high-performance technology infrastructure, corporate regulatory governance, and cybersecurity audits for ambitious public and private organizations.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => { setActiveFormTab('quote'); scrollToSection('forms-section'); }}
              className="inline-flex items-center gap-2 bg-[#00a3a6] hover:bg-[#008f91] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl transition-all hover:bg-teal-600 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>Book an ICT Audit</span>
            </button>

            <button
              onClick={() => { setActiveFormTab('contact'); scrollToSection('forms-section'); }}
              className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Submit General Inquiry</span>
              <ChevronRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60 text-left">
            <div className="bg-[#081930]/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-teal-400 font-bold text-xl sm:text-2xl font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">IPA & IRC Compliance</div>
            </div>
            <div className="bg-[#081930]/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-teal-400 font-bold text-xl sm:text-2xl font-mono">99.9%</div>
              <div className="text-xs text-slate-400 mt-0.5">Network Uptime SLA</div>
            </div>
            <div className="bg-[#081930]/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-teal-400 font-bold text-xl sm:text-2xl font-mono">24/7</div>
              <div className="text-xs text-slate-400 mt-0.5">Threat Monitoring</div>
            </div>
            <div className="bg-[#081930]/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-teal-400 font-bold text-xl sm:text-2xl font-mono">PGK</div>
              <div className="text-xs text-slate-400 mt-0.5">Transparent Project Pricing</div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          4. DEDICATED INTRODUCTORY SUB-SECTION (Below Hero)
          ------------------------------------------------------------------- */}
      <section id="services" className="py-16 px-4 sm:px-6 bg-[#030d1a]/80 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#081930] border border-slate-700/60 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                Specialized Enterprise Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 mb-3 tracking-tight">
                Our Core Services in Alotau
              </h2>
              <p className="text-[0.95rem] text-slate-300 leading-relaxed">
                From official IPA business registration and IRC tax compliance to enterprise-grade Wi-Fi, CCTV security, data backup, and hands-on computer workforce training — right here in Alotau.
              </p>
            </div>

            {/* Service Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-[#020b18] border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
                  <Wifi className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Wi-Fi & CCTV Security</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Campus-wide managed wireless network coverage, commercial IP surveillance, and access control.
                </p>
              </div>

              <div className="bg-[#020b18] border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-base">IPA & IRC Compliance</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Official Investment Promotion Authority business registrations, TIN filings, and tax advisory.
                </p>
              </div>

              <div className="bg-[#020b18] border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Data Backup & Recovery</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Automated local and cloud disaster recovery pipelines preventing data loss during power outages.
                </p>
              </div>

              <div className="bg-[#020b18] border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Workforce IT Training</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Practical computer skills, digital productivity tools, and cybersecurity hygiene for your staff.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Need customized terms or on-premise inspection? Submit an inquiry or project estimate below.
              </p>
              <button
                onClick={() => { setActiveFormTab('contact'); scrollToSection('forms-section'); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
              >
                <span>Explore Consultation Options</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          5. FORM SUBMISSIONS SECTION (Inquiries & Estimates)
          ------------------------------------------------------------------- */}
      <section id="forms-section" className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Connect With Our Consultants
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Select an option below to submit a project estimate request or a general advisory inquiry.
            </p>

            {/* Form Switcher Tabs */}
            <div className="inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 mt-6 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveFormTab('unified')}
                className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'unified'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Unified Portal (Neon Postgres)
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('contact')}
                className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'contact'
                    ? 'bg-[#00a3a6] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Direct Inquiries
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('quote')}
                className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'quote'
                    ? 'bg-[#00a3a6] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Project Estimate
              </button>
            </div>
          </div>

          {/* Form Render Container */}
          <div className="transition-all">
            {activeFormTab === 'unified' ? (
              <UnifiedSubmissionForm
                onSuccess={(refCode) => {
                  setGlobalAlert({
                    type: 'success',
                    title: 'Submission Confirmed',
                    message: `Logged into Neon Postgres under ticket reference ${refCode}.`,
                    ref_code: refCode,
                  });
                }}
              />
            ) : activeFormTab === 'contact' ? (
              <ContactForm
                onSuccess={(res) => {
                  setGlobalAlert({
                    type: 'success',
                    title: 'Inquiry Recorded',
                    message: res.message || 'Thank you! Your inquiry has been registered.',
                    id: res.id,
                  });
                }}
              />
            ) : (
              <QuoteForm
                onSuccess={(res) => {
                  setGlobalAlert({
                    type: 'success',
                    title: 'Quote Request Recorded',
                    message: res.message || 'Thank you! Your estimate request has been received.',
                    id: res.id,
                  });
                }}
              />
            )}
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------------
          6. CORPORATE FOOTER WITH NEWSLETTER MODULE
          ------------------------------------------------------------------- */}
      <footer className="mt-auto bg-[#030d1a] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                K
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">KILSTAR</span>
                <p className="text-[11px] text-teal-400 font-medium">Enhancing through business and ICT innovations</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              KILSTAR Business & ICT Consultants delivers enterprise technology architecture, cybersecurity threat management, and corporate regulatory compliance for organizations across Papua New Guinea.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              IPA Registration: 6-129295384 | Alotau Office
            </div>
          </div>

          {/* Navigation Directory */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="text-xs space-y-2">
              <li><button onClick={() => scrollToSection('hero')} className="hover:text-teal-400 transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-teal-400 transition-colors">Core Services</button></li>
              <li><button onClick={() => { setActiveFormTab('quote'); scrollToSection('forms-section'); }} className="hover:text-teal-400 transition-colors">Request Quote</button></li>
              <li><button onClick={() => setIsPortalOpen(true)} className="hover:text-teal-400 transition-colors">Client Portal</button></li>
            </ul>
          </div>

          {/* Newsletter Module */}
          <div className="md:col-span-5">
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KILSTAR Business & ICT Consultants. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPortalOpen(true)}
              className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{user ? user.email : 'Client Sign In'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Client Portal Modal */}
      <ClientPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
      />
    </div>
  );
}
