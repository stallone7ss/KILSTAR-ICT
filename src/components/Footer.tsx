import React from 'react';
import { COMPANY_DETAILS } from '../data/kilstaContent';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Database,
  ArrowRight,
  ExternalLink,
  Youtube,
  MessageSquare,
  Lock
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, formType?: string) => void;
  onOpenAuditModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuditModal }) => {
  return (
    <footer className="bg-[#0a1430] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-700/50 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <img
                  src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                  alt="KILSTA Emblem Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base tracking-tight">KILSTA</h3>
                <p className="text-xs text-slate-400 font-medium">Business & ICT Consultants</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              A locally owned Business & ICT consulting practice headquartered in Alotau, Milne Bay Province.
              Helping Papua New Guinea enterprises with official IPA incorporation, IRC tax clearance,
              structured network setup, CCTV security, and hands-on workforce computer training.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-teal-300 border border-slate-700 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                {COMPANY_DETAILS.ipaNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-blue-300 border border-slate-700 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                {COMPANY_DETAILS.tinNumber}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={COMPANY_DETAILS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 border border-slate-700 flex items-center justify-center text-slate-400 transition-colors"
                title="KILSTA on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${COMPANY_DETAILS.phoneRaw}?text=Hello%20KILSTA%2C%20I%20am%20inquiring%20about%20your%20services`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 flex items-center justify-center text-slate-400 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-900/60 hover:text-blue-300 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Consulting & Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('industries')}
                  className="hover:text-white transition-colors"
                >
                  Industries We Serve
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-white transition-colors"
                >
                  Guides & Templates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Form Types & Quick Fill */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forms & Records</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('forms', 'contact')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>General Contact Form</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('forms', 'audit_booking')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>Book Systems Audit Form</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('forms', 'training_registration')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>Training Enrollment Form</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('forms', 'service_quote')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>Project Quote Request</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('forms', 'sme_advisory')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>SME & IPA Compliance Request</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 pt-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Database Dashboard (Password)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Milne Bay Office</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${COMPANY_DETAILS.phoneRaw}`} className="hover:text-white font-medium">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-white">
                  {COMPANY_DETAILS.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.operatingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAuditModal}
                className="w-full py-2.5 px-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Book Free Systems Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {COMPANY_DETAILS.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Alotau · Milne Bay Province · Papua New Guinea</span>
            <span>Local Database Synced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
