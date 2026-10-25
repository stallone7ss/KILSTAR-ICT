import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { AlertBanner } from './AlertBanner';
import { AlertState, ApiResponse } from '../types/database';
import { useAuth } from '../context/AuthContext';

interface ContactFormProps {
  onSuccess?: (data: any) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const { token, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    service: 'Enterprise ICT Infrastructure',
    message: '',
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

      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        setAlert({
          type: 'success',
          title: 'Inquiry Submitted Successfully',
          message: result.message || 'Thank you! Your consultation inquiry has been recorded. Our team will contact you shortly.',
          id: result.id || undefined,
        });

        setFormData({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          company: '',
          service: 'Enterprise ICT Infrastructure',
          message: '',
        });

        if (onSuccess) onSuccess(result);
      } else {
        setAlert({
          type: 'error',
          title: 'Submission Issue',
          message: result.error || 'Could not process your inquiry. Please try again.',
        });
      }
    } catch {
      setAlert({
        type: 'error',
        title: 'Communication Error',
        message: 'Could not connect to the server. Please check your internet connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-form" className="bg-[#081930]/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="pb-6 mb-6 border-b border-slate-800">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          General Inquiries
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Consultation & Business Inquiries
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Have questions regarding our ICT deployments, regulatory compliance, or enterprise security? Reach out directly.
        </p>
      </div>

      {alert && (
        <div className="mb-6">
          <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />
        </div>
      )}

      <form
        action="/api/contacts"
        method="POST"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name <span className="text-teal-400">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. John Kila"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address <span className="text-teal-400">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@organization.com"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Phone / Mobile
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+675 82545274"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-company" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Organization / Company
            </label>
            <input
              id="contact-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company or Department Name"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Service Required
          </label>
          <select
            id="contact-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
          >
            <option value="Enterprise ICT Infrastructure">Enterprise ICT Infrastructure & Systems</option>
            <option value="Strategic Business Transformation">Strategic Business Transformation & Advisory</option>
            <option value="Secure Network & CCTV Integration">Secure Network Integration & Threat Management</option>
            <option value="IPA Registration & IRC Compliance">IPA Registration & IRC Tax Compliance</option>
            <option value="Workforce Computer Training">Workforce Computer & Productivity Training</option>
            <option value="Other Advisory">Other Strategic ICT Consultation</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Inquiry Details <span className="text-teal-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Please describe your requirements, challenges, or goals..."
            className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors resize-y"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            All inquiries are protected under professional corporate confidentiality.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 bg-[#00a3a6] hover:bg-[#008f91] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Sending Inquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
