import React, { useState } from 'react';
import { Calculator, Send, Loader2 } from 'lucide-react';
import { AlertBanner } from './AlertBanner';
import { AlertState, ApiResponse } from '../types/database';
import { useAuth } from '../context/AuthContext';

interface QuoteFormProps {
  onSuccess?: (data: any) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSuccess }) => {
  const { token, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const [formData, setFormData] = useState({
    clientName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    businessType: 'SME / Private Company',
    projectScope: 'Enterprise-grade Wi-Fi & CCTV Security',
    estimatedBudget: 'PGK 5,000 - 15,000',
    timeline: 'Within 1 Month',
    additionalDetails: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        setAlert({
          type: 'success',
          title: 'Project Estimate Request Submitted',
          message: result.message || 'Thank you! Your quote request has been received. We will prepare a detailed proposal.',
          id: result.id || undefined,
        });

        setFormData({
          clientName: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          businessType: 'SME / Private Company',
          projectScope: 'Enterprise-grade Wi-Fi & CCTV Security',
          estimatedBudget: 'PGK 5,000 - 15,000',
          timeline: 'Within 1 Month',
          additionalDetails: '',
        });

        if (onSuccess) onSuccess(result);
      } else {
        setAlert({
          type: 'error',
          title: 'Submission Issue',
          message: result.error || 'Server rejected the quote request parameters.',
        });
      }
    } catch {
      setAlert({
        type: 'error',
        title: 'Communication Error',
        message: 'Could not connect to the server. Please verify your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="quote-form" className="bg-[#081930]/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="pb-6 mb-6 border-b border-slate-800">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <Calculator className="w-3.5 h-3.5" />
          Project Estimates
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Request an ICT or Strategic Project Estimate
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Receive a tailored quotation with transparent deliverables, equipment specifications, and timeline milestones.
        </p>
      </div>

      {alert && (
        <div className="mb-6">
          <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />
        </div>
      )}

      <form
        action="/api/quotes"
        method="POST"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quote-client-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Client / Business Name <span className="text-emerald-400">*</span>
            </label>
            <input
              id="quote-client-name"
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Your Name or Enterprise Name"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="quote-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address <span className="text-emerald-400">*</span>
            </label>
            <input
              id="quote-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="billing@organization.com"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quote-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Phone Contact
            </label>
            <input
              id="quote-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+675 82545274"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="quote-business-type" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Sector / Entity Type
            </label>
            <select
              id="quote-business-type"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
            >
              <option value="SME / Private Company">SME / Private Business</option>
              <option value="Provincial Government / Agency">Government Entity or Public Agency</option>
              <option value="NGO / Development Partner">NGO / International Development Body</option>
              <option value="Education / Healthcare Facility">Educational / Healthcare Institution</option>
              <option value="Sole Trader / New Venture">Sole Trader / Startup Enterprise</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="quote-project-scope" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Primary Scope of Engagement <span className="text-emerald-400">*</span>
          </label>
          <select
            id="quote-project-scope"
            name="projectScope"
            value={formData.projectScope}
            onChange={handleChange}
            className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
          >
            <option value="Enterprise-grade Wi-Fi & CCTV Security">Enterprise Wi-Fi & Commercial CCTV Surveillance</option>
            <option value="Automated Local & Cloud Backup Systems">Automated Cloud & Local Backup Architecture</option>
            <option value="IPA Business Registration & IRC Tax Filings">IPA Business Incorporation & IRC Tax Filing Support</option>
            <option value="Hands-on Computer Workforce Training">Hands-on Staff Computer & Digital Skills Training</option>
            <option value="Complete ICT Infrastructure Modernization">Complete Multi-Office ICT Infrastructure Overhaul</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quote-estimated-budget" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Estimated Budget Range
            </label>
            <select
              id="quote-estimated-budget"
              name="estimatedBudget"
              value={formData.estimatedBudget}
              onChange={handleChange}
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
            >
              <option value="Under PGK 5,000">Under PGK 5,000</option>
              <option value="PGK 5,000 - 15,000">PGK 5,000 – 15,000</option>
              <option value="PGK 15,000 - 50,000">PGK 15,000 – 50,000</option>
              <option value="PGK 50,000+">PGK 50,000+ (Enterprise Overhaul)</option>
            </select>
          </div>

          <div>
            <label htmlFor="quote-timeline" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Desired Completion Timeline
            </label>
            <select
              id="quote-timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
            >
              <option value="Immediate / Emergency">Immediate (Within 72 Hours)</option>
              <option value="Within 1 Month">Within 1 Month</option>
              <option value="1 - 3 Months">1 – 3 Months</option>
              <option value="Flexible / Planning Phase">Flexible / Fiscal Planning Phase</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="quote-details" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Additional Specifications
          </label>
          <textarea
            id="quote-details"
            name="additionalDetails"
            rows={3}
            value={formData.additionalDetails}
            onChange={handleChange}
            placeholder="Include square footage, number of workstations, camera count, or training cohort size..."
            className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors resize-y"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Formal formal itemized quotes are provided within 24–48 business hours.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 bg-[#00a3a6] hover:bg-[#008f91] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting Request...</span>
              </>
            ) : (
              <>
                <span>Request Project Proposal</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
