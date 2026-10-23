import React, { useState } from 'react';
import { submitForm } from '../services/api';
import { FormSubmission } from '../types/database';
import {
  X,
  Calendar,
  CheckCircle2,
  Sparkles,
  Loader2,
  Database,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: FormSubmission) => void;
  onNavigateToDb: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateToDb,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('Alotau, Milne Bay');
  const [preferredDate, setPreferredDate] = useState('');
  const [teamSize, setTeamSize] = useState('5-15 employees');
  const [auditFocus, setAuditFocus] = useState('ICT Infrastructure, Network & Backup');
  const [currentSetup, setCurrentSetup] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<FormSubmission | null>(null);

  if (!isOpen) return null;

  const handleQuickFill = () => {
    setFullName('Albert Didymus');
    setEmail('a.didymus@alotauwharf.com.pg');
    setPhone('+675 7234 5678');
    setOrganization('Alotau Coastal Logistics & Shipping');
    setLocation('Main Wharf, Alotau Urban');
    setPreferredDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setTeamSize('10-25 workstations');
    setAuditFocus('Network Cabling, IP CCTV Surveillance & Solar UPS Backup');
    setCurrentSetup('8 desktop computers, slow mobile hotspot, frequently affected by local power outages. We need 24/7 CCTV and reliable inventory syncing.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !organization.trim()) {
      setError('Please provide your name, email, and organization.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitForm({
        form_type: 'audit_booking',
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        location: location.trim(),
        subject: `IT & Business Audit Request: ${organization.trim()}`,
        service_category: 'ICT Systems Audit',
        message: currentSetup.trim() || `Requested systems audit focusing on ${auditFocus}.`,
        priority: 'high',
        payload: {
          preferredDate,
          teamSize,
          auditFocus,
          currentSetup,
          source: 'Website Audit Modal'
        }
      });

      setSubmittedRecord(result);
      onSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to submit audit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRecord(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setCurrentSetup('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#0a1430] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-cyan-400/40 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <img
                src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                alt="KILSTA Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Book an IT & Business Systems Audit</h3>
              <p className="text-xs text-slate-300">Milne Bay Province · Stored directly to KILSTA Database</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedRecord ? (
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-slate-900">Audit Request Logged in Database!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{submittedRecord.full_name}</strong>. Your audit booking for <strong className="text-slate-900">{submittedRecord.organization}</strong> has been saved directly to our system.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Database Reference:</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{submittedRecord.ref_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-700 capitalize">{submittedRecord.status.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Focus:</span>
                  <span className="font-medium text-slate-800">{submittedRecord.payload?.auditFocus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Milne Bay Location:</span>
                  <span className="font-medium text-slate-800">{submittedRecord.location}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    onNavigateToDb();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1430] hover:bg-slate-800 text-cyan-300 text-xs font-bold shadow-sm border border-slate-700"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Database Portal</span>
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  Done & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Fill Button Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-medium">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Testing? Pre-fill with realistic Milne Bay enterprise details.</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shrink-0 transition-colors"
                >
                  Quick Fill Demo
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Kovea"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Samarai Traders Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@business.com.pg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +675 7123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Milne Bay District / Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Alotau Urban, East Cape, Samarai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Audit Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Team Size / Workstations
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="1-5 employees / PCs">1-5 employees / PCs</option>
                    <option value="5-15 employees / PCs">5-15 employees / PCs</option>
                    <option value="15-30 employees / PCs">15-30 employees / PCs</option>
                    <option value="30+ enterprise scale">30+ enterprise scale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Audit Focus
                  </label>
                  <select
                    value={auditFocus}
                    onChange={(e) => setAuditFocus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="ICT Infrastructure, Network & Backup">ICT Infrastructure, Network & Backup</option>
                    <option value="IP CCTV Surveillance & Physical Security">IP CCTV Surveillance & Security</option>
                    <option value="IPA & IRC Statutory Compliance Review">IPA & IRC Statutory Compliance Review</option>
                    <option value="Accounting & Financial Software Transition">Accounting Software Transition</option>
                    <option value="Full Comprehensive 360° Systems Audit">Full Comprehensive 360° Systems Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Pain Points / Specific Challenges
                </label>
                <textarea
                  rows={3}
                  value={currentSetup}
                  onChange={(e) => setCurrentSetup(e.target.value)}
                  placeholder="Describe your current computers, slow internet, frequent outages, or bookkeeping bottlenecks..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-bold shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Submit & Save to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
