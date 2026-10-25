import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiResponse } from '../types/database';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email, fullName, source: 'footer_newsletter' }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setMessage(result.message || 'Subscribed successfully to Kilstar briefings!');
        setEmail('');
        setFullName('');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not connect to subscription service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-teal-400" />
        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
          ICT & Strategic Advisory Briefings
        </h4>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Stay updated on corporate regulatory changes (IPA/IRC), enterprise cybersecurity alerts, and local technology advisory insights.
      </p>

      <form
        action="/api/subscribers"
        method="POST"
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name (optional)"
            className="sm:w-1/3 bg-[#030d1a] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
          />

          <div className="flex-1 relative">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your business email"
              className="w-full bg-[#030d1a] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors pr-24"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-1 top-1 bottom-1 bg-[#00a3a6] hover:bg-[#008f91] text-white font-medium px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {status === 'success' && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-teal-950/60 border border-teal-500/40 text-teal-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};
