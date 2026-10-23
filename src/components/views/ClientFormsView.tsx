import React, { useState, useEffect } from 'react';
import { submitForm } from '../../services/api';
import { FormSubmission, SubmissionInput, FormType, SubmissionPriority } from '../../types/database';
import {
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  MessageSquare,
  AlertCircle,
  Lock
} from 'lucide-react';

interface ClientFormsViewProps {
  initialFormType?: FormType;
  onNavigateToAdmin: () => void;
  onSubmissionSuccess?: (sub: FormSubmission) => void;
}

export const ClientFormsView: React.FC<ClientFormsViewProps> = ({
  initialFormType = 'contact',
  onNavigateToAdmin,
  onSubmissionSuccess,
}) => {
  const [selectedFormType, setSelectedFormType] = useState<FormType>(initialFormType);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('Alotau, Milne Bay');
  const [subject, setSubject] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<SubmissionPriority>('normal');
  const [customPayload, setCustomPayload] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successRecord, setSuccessRecord] = useState<FormSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFormType) {
      setSelectedFormType(initialFormType);
    }
  }, [initialFormType]);

  const handleQuickDemoFill = (type: FormType) => {
    setError(null);
    setSuccessRecord(null);

    switch (type) {
      case 'contact':
        setFullName('Kester Bwaga');
        setEmail('k.bwaga@suautrading.com.pg');
        setPhone('+675 7344 1122');
        setOrganization('Suau Island Retail & Trading');
        setLocation('Fife Bay / Suau Coast, Milne Bay');
        setSubject('Starlink Integration & Solar Backup Support');
        setServiceCategory('ICT Infrastructure & Hardware');
        setMessage('Good morning KILSTA team. We run a retail store and fuel depot on Suau Island. We just received a Starlink dish and need advice on setting up a long-range Wi-Fi link to our staff quarters and connecting our invoice computer to solar power.');
        setPriority('normal');
        setCustomPayload({
          preferredContact: 'WhatsApp',
          urgency: 'Within this week',
          hasExistingSolar: true,
        });
        break;

      case 'audit_booking':
        setFullName('Hellen Kaia');
        setEmail('hkaia@mbc-enterprises.pg');
        setPhone('+675 7190 8821');
        setOrganization('Milne Bay Cocoa Growers Association');
        setLocation('Alotau Port District');
        setSubject('Systems Audit: Cooperative Inventory & Member Payouts');
        setServiceCategory('ICT Systems Audit');
        setMessage('Our cooperative represents 140 smallholder cocoa farmers. We need a complete audit of our weighbridge tally software, paper bookkeeping vouchers, and backup systems before audits by the Cocoa Board.');
        setPriority('high');
        setCustomPayload({
          preferredDate: '2026-11-12',
          teamSize: '12 administrative staff',
          auditFocus: 'Bookkeeping reconciliation, Excel ledgers, network data backup',
          currentSetup: '4 desktop PCs, multiple flash drives with inconsistent file versions',
        });
        break;

      case 'training_registration':
        setFullName('Solomon Vaira');
        setEmail('svaira@kiriwina-high.edu.pg');
        setPhone('+675 8251 9044');
        setOrganization('Losuia Community High School');
        setLocation('Kiriwina Island, Trobriand Islands');
        setSubject('Enrollment: Microsoft Excel & Student Marks Ledger Training');
        setServiceCategory('ICT Training');
        setMessage('We wish to enroll 4 teachers in your Microsoft Excel for Business & Administration masterclass. We want them to automate termly student report cards and calculate marks accurately.');
        setPriority('normal');
        setCustomPayload({
          courseName: 'Microsoft Excel Masterclass for Business',
          participantCount: 4,
          cohort: 'Cohort Nov-2026 (Weekend intensive)',
          skillLevel: 'Beginner to Intermediate',
          needsAccommodationAdvice: true,
        });
        break;

      case 'service_quote':
        setFullName('Doreen Maladina');
        setEmail('doreen@eastcapelodge.com.pg');
        setPhone('+675 7611 3490');
        setOrganization('East Cape Coastal Bungalows & Dive');
        setLocation('East Cape, MBP');
        setSubject('Quotation Request: 8-Camera 4K CCTV & Guest Mesh Wi-Fi');
        setServiceCategory('ICT Services & Surveillance');
        setMessage('We are upgrading our tourist accommodation with 6 beachfront chalets and a central dining deck. We require outdoor weatherproof IP CCTV cameras covering the boat jetty and parking lot, plus guest Wi-Fi access.');
        setPriority('high');
        setCustomPayload({
          budgetRange: 'K15,000 - K25,000 PGK',
          projectTimeline: 'Within 3-4 weeks',
          cameraCount: 8,
          guestRooms: 6,
          includesMaintenancePlan: true,
        });
        break;

      case 'sme_advisory':
        setFullName('Marcus Tom');
        setEmail('marcustom.tours@gmail.com');
        setPhone('+675 7450 1209');
        setOrganization('Milne Bay Island Hopping & Dinghy Charters');
        setLocation('Sandbank, Alotau');
        setSubject('SME Startup: IPA Business Name Registration & IRC TIN Setup');
        setServiceCategory('Business Advisory & Compliance');
        setMessage('I have been running tourist charters with two banana boats for 2 years. I now want to register my official business name with IPA and get an IRC TIN so I can bill international cruise ship tour agents and open a BSP SME bank account.');
        setPriority('urgent');
        setCustomPayload({
          registrationType: 'IPA Business Name Registration',
          hasExistingTIN: false,
          needsBankAssistance: true,
          targetLaunchDate: '2026-11-01',
        });
        break;

      case 'newsletter':
        setFullName('Alice Gari');
        setEmail('agari@alotau-retail.com.pg');
        setPhone('+675 7001 2345');
        setOrganization('Gari General Supplies');
        setLocation('Town Market, Alotau');
        setSubject('Download: PNG SME IPA & IRC Tax Compliance Guide 2026');
        setServiceCategory('Resources & Publications');
        setMessage('Requested free download of the 2026 Papua New Guinea SME compliance roadmap.');
        setPriority('low');
        setCustomPayload({
          resourceName: 'PNG SME IPA & IRC Tax Compliance Guide 2026',
          subscribedNewsletter: true,
        });
        break;
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setSubject('');
    setServiceCategory('');
    setMessage('');
    setCustomPayload({});
    setSuccessRecord(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full name and email address.');
      return;
    }

    setSubmitting(true);
    try {
      const input: SubmissionInput = {
        form_type: selectedFormType,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        location: location.trim() || 'Milne Bay Province',
        subject: subject.trim() || `${selectedFormType.replace('_', ' ').toUpperCase()} Submission`,
        service_category: serviceCategory.trim() || 'General Consultation',
        message: message.trim(),
        priority,
        payload: customPayload,
      };

      const result = await submitForm(input);
      setSuccessRecord(result);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(result);
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-1">
              <PlusCircle className="w-4 h-4 text-cyan-500" />
              <span>Official Request Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Submit a Business & ICT Request
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Fill out your service inquiry, systems audit booking, or training enrollment below. All requests are securely stored directly in the KILSTA database.
            </p>
          </div>

          {/* Administrator Login Link */}
          <button
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a1430] hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700 transition-colors shadow-xs"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Administrator Database Portal</span>
          </button>
        </div>

        {/* Form Type Picker Tabs */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-1 pb-2">
            Choose What You Would Like to Request
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'contact' as FormType, label: 'General Contact', icon: MessageSquare, badge: 'Inquiry' },
              { id: 'audit_booking' as FormType, label: 'IT Systems Audit', icon: Calendar, badge: 'Free Assessment' },
              { id: 'training_registration' as FormType, label: 'Training Enrollment', icon: GraduationCap, badge: 'Workshops' },
              { id: 'service_quote' as FormType, label: 'Service Quotation', icon: Briefcase, badge: 'Project Scope' },
              { id: 'sme_advisory' as FormType, label: 'SME & IPA Setup', icon: Building2, badge: 'Compliance' },
              { id: 'newsletter' as FormType, label: 'Resource Guide', icon: FileText, badge: 'Download' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = selectedFormType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedFormType(item.id);
                    setSuccessRecord(null);
                    setError(null);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 text-blue-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="text-[10px] text-slate-400 font-mono">{item.badge}</span>
                  </div>
                  <div className="font-bold text-xs mt-2">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Box */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Card Top Title Banner */}
          <div className="px-6 py-4 bg-[#0a1430] text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-cyan-400/40 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <img
                  src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                  alt="KILSTA Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-bold text-base text-white capitalize">
                  {selectedFormType.replace('_', ' ')} Online Request
                </h2>
                <p className="text-xs text-slate-300">
                  Submissions are encrypted and saved directly to the KILSTA database
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill(selectedFormType)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Fill Demo Data</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            {successRecord ? (
              <div className="py-10 text-center space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-extrabold text-slate-900">Request Recorded in Database!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{successRecord.full_name}</strong>. Your request has been routed to our administrator and saved securely under tracking code:
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Tracking Reference Code:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {successRecord.ref_code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Form Category:</span>
                    <span className="font-semibold text-slate-800 capitalize">{successRecord.form_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Client Organization:</span>
                    <span className="font-semibold text-slate-800">{successRecord.organization || 'Individual'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Logged Timestamp:</span>
                    <span className="font-mono text-slate-600">{new Date(successRecord.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm"
                  >
                    Submit Another Request
                  </button>
                  <button
                    onClick={onNavigateToAdmin}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Administrator Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 1: Contact Details */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    1. Contact Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
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
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +675 82545274"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Organization / Business Name
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Samarai Cocoa Co-op"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Milne Bay Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Alotau Urban, Suau, East Cape"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Urgency Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as SubmissionPriority)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="low">Low Priority</option>
                        <option value="normal">Normal Timeline</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent Attention</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Form Specifications */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    2. Specific Requirements & Scope
                  </div>

                  {selectedFormType === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subject of Message *
                        </label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Hardware upgrade quote"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Preferred Follow-up
                        </label>
                        <select
                          value={customPayload.preferredContact || 'Email'}
                          onChange={(e) => setCustomPayload({ ...customPayload, preferredContact: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Email">Email</option>
                          <option value="Phone Call">Phone Call</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedFormType === 'audit_booking' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Preferred Audit Date
                        </label>
                        <input
                          type="date"
                          value={customPayload.preferredDate || ''}
                          onChange={(e) => setCustomPayload({ ...customPayload, preferredDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Team Size / Workstations
                        </label>
                        <select
                          value={customPayload.teamSize || '5-15 employees'}
                          onChange={(e) => setCustomPayload({ ...customPayload, teamSize: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="1-5 staff / PCs">1-5 staff / PCs</option>
                          <option value="5-15 employees">5-15 employees</option>
                          <option value="15-30 employees">15-30 employees</option>
                          <option value="30+ enterprise">30+ enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Audit Focus Area
                        </label>
                        <select
                          value={customPayload.auditFocus || 'ICT Infrastructure, Network & Backup'}
                          onChange={(e) => setCustomPayload({ ...customPayload, auditFocus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="ICT Infrastructure, Network & Backup">ICT Infrastructure & Backup</option>
                          <option value="CCTV Security & Surveillance">CCTV Security & Surveillance</option>
                          <option value="IPA & IRC Statutory Compliance">IPA & IRC Statutory Compliance</option>
                          <option value="Bookkeeping & Accounting Software">Bookkeeping & Software</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedFormType === 'training_registration' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Training Course *
                        </label>
                        <select
                          value={customPayload.courseName || 'Microsoft Excel Masterclass for Business'}
                          onChange={(e) => setCustomPayload({ ...customPayload, courseName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Microsoft Excel Masterclass for Business">Microsoft Excel for Business</option>
                          <option value="Core Digital Literacy & Workplace Computing">Core Digital Literacy Basics</option>
                          <option value="Small Business Bookkeeping & Accounting Software">Accounting Software Starter</option>
                          <option value="Cybersecurity & Safe Online Practices">Cybersecurity & Safe Online</option>
                          <option value="Custom Corporate Group Workshop">Custom Corporate Workshop</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Number of Candidates
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={customPayload.participantCount || 1}
                          onChange={(e) => setCustomPayload({ ...customPayload, participantCount: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Cohort Preference
                        </label>
                        <select
                          value={customPayload.cohort || 'November 2026 (Evening)'}
                          onChange={(e) => setCustomPayload({ ...customPayload, cohort: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="November 2026 (Evening)">November 2026 (Evening)</option>
                          <option value="November 2026 (Weekend)">November 2026 (Weekend)</option>
                          <option value="December 2026 Intensive">December 2026 Intensive</option>
                          <option value="On-Site Corporate Workshop">On-Site Corporate Workshop</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedFormType === 'service_quote' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Budget Range (PGK Kina)
                        </label>
                        <select
                          value={customPayload.budgetRange || 'K5,000 - K15,000 PGK'}
                          onChange={(e) => setCustomPayload({ ...customPayload, budgetRange: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Under K2,500 PGK">Under K2,500 PGK</option>
                          <option value="K2,500 - K5,000 PGK">K2,500 - K5,000 PGK</option>
                          <option value="K5,000 - K15,000 PGK">K5,000 - K15,000 PGK</option>
                          <option value="K15,000 - K35,000 PGK">K15,000 - K35,000 PGK</option>
                          <option value="K35,000+ Major Enterprise">K35,000+ Major Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Project Timeline
                        </label>
                        <select
                          value={customPayload.projectTimeline || 'Within 30 days'}
                          onChange={(e) => setCustomPayload({ ...customPayload, projectTimeline: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Immediate / Emergency">Immediate / Emergency</option>
                          <option value="Within 14 days">Within 14 days</option>
                          <option value="Within 30 days">Within 30 days</option>
                          <option value="Next Quarter Planning">Next Quarter Planning</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Site Survey Required?
                        </label>
                        <select
                          value={customPayload.needsSiteSurvey ? 'Yes' : 'No'}
                          onChange={(e) => setCustomPayload({ ...customPayload, needsSiteSurvey: e.target.value === 'Yes' })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Yes">Yes, on-site in Milne Bay</option>
                          <option value="No">No, quote via email</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedFormType === 'sme_advisory' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Registration Type
                        </label>
                        <select
                          value={customPayload.registrationType || 'IPA Business Name'}
                          onChange={(e) => setCustomPayload({ ...customPayload, registrationType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="IPA Business Name (Sole Trader / Partnership)">IPA Business Name</option>
                          <option value="IPA Company Limited by Shares">Private Company (Ltd)</option>
                          <option value="IPA Association or Cooperative Society">Cooperative / Association</option>
                          <option value="Annual Returns Overdue Rectification">Annual Returns Overdue</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          IRC Tax Status
                        </label>
                        <select
                          value={customPayload.taxStatus || 'Needs New TIN'}
                          onChange={(e) => setCustomPayload({ ...customPayload, taxStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Needs New TIN">Needs New TIN</option>
                          <option value="Has TIN, needs COC for tender">Has TIN, needs COC for tender</option>
                          <option value="Needs GST / SWT registration">Needs GST / SWT registration</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Bank Loan Assistance
                        </label>
                        <select
                          value={customPayload.bankAssistance || 'BSP SME Account'}
                          onChange={(e) => setCustomPayload({ ...customPayload, bankAssistance: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="BSP SME Account">BSP SME Account</option>
                          <option value="Kina Bank SME">Kina Bank SME</option>
                          <option value="NDB Loan Proposal">NDB Loan Proposal</option>
                          <option value="Not Needed">Not Needed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedFormType === 'newsletter' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Resource Guide to Download
                        </label>
                        <select
                          value={customPayload.resourceName || 'PNG SME IPA & IRC Tax Compliance Guide 2026'}
                          onChange={(e) => setCustomPayload({ ...customPayload, resourceName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="PNG SME IPA & IRC Tax Compliance Guide 2026">PNG SME IPA & IRC Tax Compliance Guide 2026</option>
                          <option value="Small Business Cybersecurity & Phishing Prevention Guide">Cybersecurity & Phishing Prevention Handbook</option>
                          <option value="Milne Bay Hardware & Solar Backup Setup Checklist">Milne Bay Hardware & Solar Setup Checklist</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description / Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Details of Your Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project, current computer issues, number of participants, or specific questions..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your data is stored confidentially on the KILSTA database.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFill(selectedFormType)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                    >
                      Fill Demo Data
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          <span>Submit Request to Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
