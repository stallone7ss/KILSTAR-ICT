import React, { useState } from 'react';
import { COMPANY_DETAILS } from '../../data/kilstaContent';
import { submitForm } from '../../services/api';
import { FormSubmission } from '../../types/database';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  Loader2,
  Sparkles,
  Database,
  MessageSquare,
  Building2,
  ArrowRight,
  Lock
} from 'lucide-react';

interface ContactViewProps {
  onNavigateToDb: () => void;
  onSubmissionSuccess?: (sub: FormSubmission) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigateToDb,
  onSubmissionSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('Alotau, Milne Bay');
  const [subject, setSubject] = useState('General Business & ICT Inquiry');
  const [serviceCategory, setServiceCategory] = useState('General Consultation');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState('Email');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSubmission, setSuccessSubmission] = useState<FormSubmission | null>(null);

  const handleQuickFill = () => {
    setFullName('Grace Aisi');
    setEmail('grace.aisi@alotaubakery.com.pg');
    setPhone('+675 8254 9910');
    setOrganization('Milne Bay Fresh Bakery & Cafe');
    setLocation('Town Market Commercial Area, Alotau');
    setSubject('Inquiry: POS Computer Setup & Staff Training');
    setServiceCategory('ICT Services & POS Setup');
    setMessage('Hello Stallone and KILSTA team. We are opening our second pastry shop in Alotau and need a dedicated point-of-sale desktop with a receipt printer and barcode scanner. Also need training for 2 cashiers.');
    setPreferredContact('Phone and WhatsApp');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitForm({
        form_type: 'contact',
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        location: location.trim(),
        subject: subject.trim(),
        service_category: serviceCategory.trim(),
        message: message.trim(),
        priority: 'normal',
        payload: {
          preferredContact,
          submittedVia: 'Contact Page Form'
        }
      });

      setSuccessSubmission(res);
      if (onSubmissionSuccess) onSubmissionSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit message to database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessSubmission(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setMessage('');
    setError(null);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact KILSTA in Alotau, Milne Bay
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have a question about IPA company registration, IRC tax compliance, CCTV installation, or computer training? Send us a message or reach us directly.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Alotau Head Office</h3>
                  <p className="text-xs text-slate-500 font-medium">Milne Bay Province, PNG</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Location</div>
                    <div className="text-slate-600">{COMPANY_DETAILS.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Direct Telephone</div>
                    <a href={`tel:${COMPANY_DETAILS.phoneRaw}`} className="text-blue-700 font-semibold hover:underline">
                      {COMPANY_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Official Email</div>
                    <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-blue-700 font-semibold hover:underline">
                      {COMPANY_DETAILS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Operating Hours</div>
                    <div className="text-slate-600">{COMPANY_DETAILS.operatingHours}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={`tel:${COMPANY_DETAILS.phoneRaw}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {COMPANY_DETAILS.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${COMPANY_DETAILS.phoneRaw}?text=Hi%20KILSTA%2C%20I%20would%20like%20to%20consult%20with%20you.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Official Credentials Box */}
            <div className="bg-[#0a1430] text-white rounded-3xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Legal Status</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                KILSTA is officially registered with the PNG Investment Promotion Authority (IPA) and Internal Revenue Commission (IRC).
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-teal-300">
                  {COMPANY_DETAILS.ipaNumber}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-blue-300">
                  {COMPANY_DETAILS.tinNumber}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Send us a message</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Forms marked with * are required. Directly logged to SQLite database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Demo Fill</span>
                </button>
              </div>

              {successSubmission ? (
                <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-slate-900">Message Logged to Database!</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Thank you, <strong className="text-slate-900">{successSubmission.full_name}</strong>. Your inquiry has been stored under reference:
                    </p>
                    <div className="inline-block font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200 text-sm mt-1">
                      {successSubmission.ref_code}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={onNavigateToDb}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1430] hover:bg-slate-800 text-cyan-300 text-xs font-bold shadow-sm border border-slate-700"
                    >
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Admin Portal (Password)</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Grace Aisi"
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
                        placeholder="e.g. grace@business.com.pg"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +675 8254 9910"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Organization / Business
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Milne Bay Fresh Bakery"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Location in Milne Bay
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Alotau Town, Samarai, Suau"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service Category
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="General Consultation">General Consultation</option>
                        <option value="IPA Business Registration">IPA Business Registration</option>
                        <option value="IRC Tax Setup & COC">IRC Tax Setup & COC</option>
                        <option value="Network & Wi-Fi Setup">Network & Wi-Fi Setup</option>
                        <option value="CCTV Security Surveillance">CCTV Security Surveillance</option>
                        <option value="ICT & Computer Training">ICT & Computer Training</option>
                        <option value="Hardware Repair & Upgrades">Hardware Repair & Upgrades</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief topic of your inquiry..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project, timeline, specific issues, or requirements..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Replies typically within 24 hours on business days.
                    </span>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send & Save to Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
