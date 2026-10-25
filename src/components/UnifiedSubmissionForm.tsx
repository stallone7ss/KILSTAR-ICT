import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Send,
  Loader2,
  Calendar,
  Building2,
  Mail,
  User,
  Phone,
  FileText,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { SubmitApiResponse } from '../types/database';

export type FormType = 'contact' | 'audit_booking';

interface UnifiedSubmissionFormProps {
  initialType?: FormType;
  onSuccess?: (refCode: string, data: any) => void;
}

export const UnifiedSubmissionForm: React.FC<UnifiedSubmissionFormProps> = ({
  initialType = 'contact',
  onSuccess,
}) => {
  const [formType, setFormType] = useState<FormType>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    refCode: string;
    message: string;
    fullName: string;
    email: string;
    type: FormType;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    serviceCategory: 'Enterprise ICT Infrastructure',
    message: '',
    preferredDate: '',
    auditScope: 'Full ICT Infrastructure & Security Audit',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyRef = async () => {
    if (!submittedResult?.refCode) return;
    try {
      await navigator.clipboard.writeText(submittedResult.refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    setErrorMessage(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      serviceCategory: 'Enterprise ICT Infrastructure',
      message: '',
      preferredDate: '',
      auditScope: 'Full ICT Infrastructure & Security Audit',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      form_type: formType,
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      organization: formData.organization.trim() || undefined,
      service_category: formType === 'contact' ? formData.serviceCategory : undefined,
      message: formType === 'contact' ? formData.message.trim() : formData.message.trim() || undefined,
      preferred_date: formType === 'audit_booking' ? formData.preferredDate : undefined,
      audit_scope: formType === 'audit_booking' ? formData.auditScope : undefined,
      metadata: {
        interface_version: '2.0.0',
        environment: 'codespaces-vercel-neon',
      },
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: SubmitApiResponse = await response.json();

      if (!response.ok || !result.success || !result.ref_code) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      setSubmittedResult({
        refCode: result.ref_code,
        message: result.message || 'Submission successfully recorded in Neon database.',
        fullName: formData.fullName,
        email: formData.email,
        type: formType,
      });

      if (onSuccess) {
        onSuccess(result.ref_code, result.data);
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(
        err.message || 'An unexpected network error occurred while submitting. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Success Confirmation View
  // ---------------------------------------------------------------------------
  if (submittedResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto text-white">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <CheckCircle2 className="w-10 h-10 animate-in zoom-in-75 duration-300" />
          </div>

          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
            Database Confirmed • Neon PostgreSQL
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            {submittedResult.type === 'audit_booking'
              ? 'ICT Audit Consultation Reserved'
              : 'Consultation Inquiry Received'}
          </h3>

          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            {submittedResult.message}
          </p>

          {/* Reference Card Box */}
          <div className="my-6 p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 shadow-inner text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
                  Ticket Reference Code
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-wider">
                  {submittedResult.refCode}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
                title="Copy reference code to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              Keep this reference code for updates. An automated dispatch record has been indexed under{' '}
              <strong className="text-slate-200">{submittedResult.email}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors focus:ring-2 focus:ring-slate-500"
            >
              <RefreshCw className="w-4 h-4" />
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Submission Form View
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto text-white">
      {/* Type Selector Tabs */}
      <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-8">
        <button
          type="button"
          onClick={() => {
            setFormType('contact');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            formType === 'contact'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Mail className="w-4 h-4" />
          General Advisory
        </button>
        <button
          type="button"
          onClick={() => {
            setFormType('audit_booking');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            formType === 'audit_booking'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Book ICT Audit
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          {formType === 'audit_booking'
            ? 'Schedule an Enterprise ICT Systems Audit'
            : 'Initiate a Technology Consultation'}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          {formType === 'audit_booking'
            ? 'Comprehensive evaluation of network security, cloud topology, backup readiness, and hardware compliance.'
            : 'Get in touch with KILSTAR technical advisors for modern ICT solutions and digital infrastructure.'}
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Submission Error</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Samuel Kila"
                disabled={isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Business Email <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="samuel@company.com"
                disabled={isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Phone & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+675 7000 0000"
                disabled={isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Company / Organization
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization or Entity"
                disabled={isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Fields based on formType */}
        {formType === 'contact' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Service of Interest
            </label>
            <select
              name="serviceCategory"
              value={formData.serviceCategory}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 disabled:opacity-50 transition-colors"
            >
              <option value="Enterprise ICT Infrastructure">Enterprise ICT Infrastructure</option>
              <option value="Cybersecurity & Network Defense">Cybersecurity & Network Defense</option>
              <option value="Cloud Migration & Microsoft 365">Cloud Migration & Microsoft 365</option>
              <option value="Strategic Business & Tech Advisory">Strategic Business & Tech Advisory</option>
              <option value="Disaster Recovery & Redundancy">Disaster Recovery & Redundancy</option>
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Audit Scope Focus <span className="text-amber-400">*</span>
              </label>
              <select
                name="auditScope"
                value={formData.auditScope}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 disabled:opacity-50 transition-colors"
              >
                <option value="Full ICT Infrastructure & Security Audit">Full Infrastructure & Security Audit</option>
                <option value="Cybersecurity Vulnerability Assessment">Cybersecurity Vulnerability Assessment</option>
                <option value="Disaster Recovery & Data Backup Audit">Disaster Recovery & Data Backup Audit</option>
                <option value="Software Licensing & Cloud Systems">Software Licensing & Cloud Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Date / Window
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Message / Scope description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            {formType === 'contact' ? (
              <>
                Project Requirements / Details <span className="text-amber-400">*</span>
              </>
            ) : (
              'Scope Details & Infrastructure Description'
            )}
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <textarea
              name="message"
              required={formType === 'contact'}
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder={
                formType === 'contact'
                  ? 'Please describe your organization’s tech requirements, current pain points, or timeline...'
                  : 'Specify key locations, server count, remote offices, and special compliance considerations...'
              }
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Transmitting to Neon Postgres...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>
                {formType === 'audit_booking'
                  ? 'Confirm ICT Audit Booking'
                  : 'Transmit Consultation Inquiry'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
export default UnifiedSubmissionForm;
