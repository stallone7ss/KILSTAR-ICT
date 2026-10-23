import React, { useState } from 'react';
import { COMPANY_DETAILS } from '../data/kilstaContent';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Database,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Lock,
  PlusCircle
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, formType?: string) => void;
  onOpenAuditModal: () => void;
  submissionsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenAuditModal,
  submissionsCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'industries', label: 'Industries' },
    { id: 'about', label: 'About' },
    { id: 'resources', label: 'Resources' },
    { id: 'forms', label: 'Submit Request', highlight: true },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Notification Bar */}
      <div className="bg-[#0a1430] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{COMPANY_DETAILS.location}</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{COMPANY_DETAILS.ipaNumber}</span>
              <span className="text-slate-600">·</span>
              <span>{COMPANY_DETAILS.tinNumber}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_DETAILS.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>
            <a
              href={`mailto:${COMPANY_DETAILS.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{COMPANY_DETAILS.email}</span>
            </a>
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                currentTab === 'admin-dashboard'
                  ? 'bg-cyan-500 text-[#0a1430] border-cyan-400'
                  : 'bg-blue-900/70 text-cyan-300 hover:text-white hover:bg-blue-800 border-blue-700/60'
              }`}
              title="Administrator Database Dashboard (Password Protected)"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
              {submissionsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-teal-400 text-slate-900 rounded-full font-bold text-[10px]">
                  {submissionsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group shrink-0"
            title="Kilstar Solutions - Enhancing through business and ICT innovations"
          >
            <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full shadow-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 bg-white ring-2 ring-slate-100 group-hover:ring-teal-400 transition-all">
              <img
                src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                alt="Kilstar Solutions Logo"
                className="w-full h-full object-contain transform transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2 leading-none">
                <span>Kilstar Solutions</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  Milne Bay
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight mt-1 leading-snug">
                Enhancing through business and ICT innovations
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  } ${item.highlight ? 'border border-blue-200/80 text-blue-900 bg-blue-50/40' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.id === 'forms' && (
                      <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                currentTab === 'admin-dashboard'
                  ? 'bg-[#0a1430] text-cyan-300 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
              title="Access password-protected Administrator Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-blue-700" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={onOpenAuditModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white text-sm font-bold shadow-sm shadow-blue-900/10 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Audit</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px]">Admin</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.id === 'forms' && (
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                    )}
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-bold border transition-colors ${
                currentTab === 'admin-dashboard'
                  ? 'bg-[#0a1430] text-cyan-300 border-slate-800'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Admin Database Dashboard</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Password Protected
              </span>
            </button>

            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuditModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-700 text-white text-sm font-bold shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Free IT Audit</span>
              </button>
              <div className="text-xs text-slate-500 text-center pt-2">
                Milne Bay Hotline: <a href={`tel:${COMPANY_DETAILS.phoneRaw}`} className="font-semibold text-slate-800">{COMPANY_DETAILS.phone}</a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
