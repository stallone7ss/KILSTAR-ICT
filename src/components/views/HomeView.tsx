import React from 'react';
import {
  COMPANY_DETAILS,
  CORE_PILLARS,
  SERVICES_CATALOG,
  HOW_WE_WORK_STEPS,
  FOUNDING_OFFERS,
  FAQS
} from '../../data/kilstaContent';
import {
  ShieldCheck,
  Calendar,
  Database,
  ArrowRight,
  Server,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ChevronRight,
  Users,
  Award,
  Clock,
  Laptop,
  Search,
  FileText,
  Wrench,
  Compass,
  Rocket,
  PlusCircle
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string, formType?: string) => void;
  onOpenAuditModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAuditModal }) => {
  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* Hero & Welcoming Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060e22] via-[#0a173b] to-[#0a1430] text-white py-14 sm:py-18 lg:py-22 border-b border-slate-800">
        
        {/* Professional Business / Tech Backdrop Graphics: Digital network grid and stylized Alotau harbor shoreline motif */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 800">
            <defs>
              <pattern id="hero-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="0.75" />
                <circle cx="48" cy="0" r="1.5" fill="rgba(45, 212, 191, 0.4)" />
              </pattern>
              <linearGradient id="harbor-bay-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#0d9488" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
            {/* Alotau coastal harbor water line and network waves */}
            <path d="M0,520 Q280,430 620,550 T1200,470 L1200,800 L0,800 Z" fill="url(#harbor-bay-grad)" opacity="0.5" />
            <path d="M0,590 Q340,510 680,610 T1200,530 L1200,800 L0,800 Z" fill="#0a1430" opacity="0.6" />
          </svg>
        </div>

        {/* Ambient brand color glows (inspired by logo blue, teal, yellow, and red) */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              
              {/* Prominent Corporate Logo & Tagline Header Row */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md max-w-xl shadow-xl">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-amber-400/80 shrink-0 flex items-center justify-center">
                  <img
                    src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                    alt="Kilstar Business & ICT Consultants Official Logo"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm" title="Active & Officially Incorporated" />
                </div>
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                      KILSTAR SOLUTIONS
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      Alotau, PNG
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-medium text-amber-300 italic tracking-tight mt-0.5">
                    "Enhancing through business and ICT innovations"
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                    <span className="font-mono text-teal-400">{COMPANY_DETAILS.ipaNumber}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">{COMPANY_DETAILS.tinNumber}</span>
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Advancing Enterprises Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-300 to-amber-200">
                  Strategic Business & ICT Innovations
                </span>
              </h1>

              {/* Welcoming Message Block */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/85 to-blue-950/75 border border-blue-500/25 p-5 sm:p-6 shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Warm Welcome to Our Clients, Partners & Community</span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  Welcome to <strong className="text-white font-semibold">Kilstar Solutions</strong> (Kista Business & ICT Consultants) — your premier partner bridging business strategy, statutory compliance, and modern ICT infrastructure with proven technical excellence.
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Whether you are establishing a new enterprise requiring official IPA registration and IRC tax compliance, safeguarding your business with 4K CCTV surveillance and Starlink connectivity, or upskilling your personnel through hands-on computer workshops, our Alotau team is committed to advancing your operations with integrity, responsiveness, and technical excellence.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 border-t border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-teal-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Locally registered & physically present in Alotau</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Alotau, Milne Bay Province, Papua New Guinea</span>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={onOpenAuditModal}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>Book Free Systems Audit</span>
                </button>

                <button
                  onClick={() => onNavigate('forms')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-200" />
                  <span>Submit Request / Forms</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition-colors hover:bg-slate-800/60"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Key Quick Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-amber-300">100%</div>
                  <div className="text-slate-400 text-[11px] leading-tight mt-0.5">Locally Owned & Operated</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-teal-300">IPA & TIN</div>
                  <div className="text-slate-400 text-[11px] leading-tight mt-0.5">Officially Registered</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-cyan-300">Direct</div>
                  <div className="text-slate-400 text-[11px] leading-tight mt-0.5">Alotau On-Site Support</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/95 border border-slate-700/80 p-6 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Alotau Operations Center
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-teal-400 bg-teal-950/70 px-2 py-0.5 rounded border border-teal-800/60">
                    Active & Taking Inquiries
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Official IPA & IRC Support</div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        Business name reservation, certificates of incorporation, and tax identification numbers (TIN) for bank accounts and tender bidding.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                    <Server className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Managed ICT & Surveillance</div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        High-resolution 4K IP CCTV night-vision cameras, Starlink integration, Wi-Fi mesh, and automated data backups.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Hands-on Computer Academy</div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        Master Microsoft Excel, basic typing, invoice spreadsheets, and small business bookkeeping in practical Alotau workshops.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct quick action inside hero card */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onNavigate('forms-database', 'audit_booking')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                  >
                    <span>Request Initial Free Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-teal-400" />
                      <span>{COMPANY_DETAILS.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-teal-400" />
                      <span>{COMPANY_DETAILS.email}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Dedicated Introductory Sub-Section (Below Hero Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 p-6 sm:p-10 lg:p-12 transition-all">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Dedicated Milne Bay Service Hub</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Core Services in Alotau
            </h2>

            {/* Body Text in legible, slightly smaller secondary text font (0.95rem / 15px–16px) */}
            <p className="text-[0.95rem] sm:text-[15.5px] text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
              From official IPA business registration and IRC tax compliance to enterprise-grade Wi-Fi, CCTV security, data backup, and hands-on computer workforce training — right here in Alotau.
            </p>

            {/* Clean Service Category Snapshot Blocks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 pb-2 text-left">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">IPA & IRC Tax</div>
                  <div className="text-[11px] text-slate-500">Official registrations</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Server className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Enterprise Wi-Fi</div>
                  <div className="text-[11px] text-slate-500">Starlink & mesh routing</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">CCTV & Backup</div>
                  <div className="text-[11px] text-slate-500">4K surveillance & cloud</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Workforce Training</div>
                  <div className="text-[11px] text-slate-500">Excel & PC digital literacy</div>
                </div>
              </div>
            </div>

            {/* Clear Call-to-Action (CTA) Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/15 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Get in Touch</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Our Three Pillars of Excellence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Digital & Advisory Architecture for Milne Bay
          </h2>
          <p className="text-sm text-slate-600">
            We bridge the gap between formal Papua New Guinea regulatory compliance and daily operational efficiency with local support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORE_PILLARS.map((pillar) => {
            const Icon =
              pillar.id === 'business'
                ? Briefcase
                : pillar.id === 'ict'
                ? Server
                : GraduationCap;

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl p-7 shadow-xs border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.subtitle}</p>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    {pillar.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (pillar.id === 'training') onNavigate('forms-database', 'training_registration');
                      else if (pillar.id === 'business') onNavigate('forms-database', 'sme_advisory');
                      else onNavigate('forms-database', 'service_quote');
                    }}
                    className="w-full inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900 group"
                  >
                    <span>Inquire for {pillar.id === 'training' ? 'Training' : 'Service'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Audit Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0a1430] to-[#122659] text-white p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-400/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>Complimentary Milne Bay Systems Audit</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Not sure where your IT or business bottlenecks are?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Let KILSTA inspect your current computer hardware, network cabling, data backup resilience, and IPA / IRC regulatory status. We deliver an honest, plain-English roadmap without confusing technical jargon.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>No obligation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>On-site in Alotau or online review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Instant database reference</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={onOpenAuditModal}
                className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-colors text-center"
              >
                Book Systems Audit Now
              </button>
              <button
                onClick={() => onNavigate('forms-database', 'audit_booking')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors text-center"
              >
                Fill Detailed Form in Hub
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Services Quick Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Featured Solutions
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Services in Milne Bay
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_CATALOG.slice(0, 6).map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 capitalize">
                    {srv.category}
                  </span>
                  {srv.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {srv.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3">{srv.shortDesc}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{srv.priceEstimate}</span>
                <button
                  onClick={() => onNavigate('forms-database', srv.category === 'training' ? 'training_registration' : 'service_quote')}
                  className="font-bold text-blue-700 hover:text-blue-900"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Launch Process & How We Work (Replacing Client Testimonials) */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center justify-center gap-2">
              <Rocket className="w-3.5 h-3.5 text-teal-600" />
              <span>Newly Launched in Milne Bay</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Service Commitment: How We Work With You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              As a new local practice, your success and trust build our foundation. Here is our step-by-step approach to every engagement.
            </p>
          </div>

          {/* 4-Step Process Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_WE_WORK_STEPS.map((step) => {
              const StepIcon =
                step.iconName === 'Search'
                  ? Search
                  : step.iconName === 'FileText'
                  ? FileText
                  : step.iconName === 'Wrench'
                  ? Wrench
                  : ShieldCheck;

              return (
                <div
                  key={step.step}
                  className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Step {step.step}
                      </span>
                      <StepIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Guaranteed standard</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Founding Client Welcome Program */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span>Founding Client Welcome Program</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Partner with KILSTA as We Launch in Alotau
                </h3>
              </div>
              <button
                onClick={onOpenAuditModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm self-start md:self-auto transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Join Introductory Program</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FOUNDING_OFFERS.map((offer, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900">{offer.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{offer.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (i === 0) onOpenAuditModal();
                      else if (i === 1) onNavigate('forms-database', 'service_quote');
                      else onNavigate('contact');
                    }}
                    className="pt-2 text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 self-start"
                  >
                    <span>{offer.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Clear Answers
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-sm text-slate-900">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a1430] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to upgrade your Milne Bay business operations?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Contact KILSTA today or fill out any of our interactive service forms. All submissions are safely logged to our database for prompt follow-up.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
            >
              Contact Alotau Office
            </button>
            <button
              onClick={() => onNavigate('forms')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
            >
              Submit Online Request
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
