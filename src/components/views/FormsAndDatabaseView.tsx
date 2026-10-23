import React, { useState, useEffect } from 'react';
import {
  fetchSubmissions,
  fetchStats,
  submitForm,
  updateSubmission,
  deleteSubmission,
  reseedDatabase,
  getExportUrl
} from '../../services/api';
import {
  FormSubmission,
  SubmissionInput,
  DatabaseStats,
  FormType,
  SubmissionStatus,
  SubmissionPriority
} from '../../types/database';
import {
  Database,
  PlusCircle,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  RotateCcw,
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
  ExternalLink,
  Trash2,
  Edit3,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Eye,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface FormsAndDatabaseViewProps {
  initialSubTab?: 'fill' | 'database';
  initialFormType?: FormType;
  onSubmissionsUpdated?: (count: number) => void;
}

export const FormsAndDatabaseView: React.FC<FormsAndDatabaseViewProps> = ({
  initialSubTab = 'fill',
  initialFormType = 'contact',
  onSubmissionsUpdated,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'fill' | 'database'>(initialSubTab);
  const [selectedFormType, setSelectedFormType] = useState<FormType>(initialFormType);

  // Database State
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Submission for Detail Modal
  const [inspectedSubmission, setInspectedSubmission] = useState<FormSubmission | null>(null);
  const [internalNoteDraft, setInternalNoteDraft] = useState<string>('');
  const [updatingNote, setUpdatingNote] = useState<boolean>(false);

  // Form State
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formLocation, setFormLocation] = useState('Alotau, Milne Bay');
  const [formSubject, setFormSubject] = useState('');
  const [formServiceCategory, setFormServiceCategory] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formPriority, setFormPriority] = useState<SubmissionPriority>('normal');
  const [formCustomPayload, setFormCustomPayload] = useState<Record<string, any>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessRecord, setFormSuccessRecord] = useState<FormSubmission | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Load Submissions & Stats
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resSubmissions, resStats] = await Promise.all([
        fetchSubmissions({
          form_type: filterType,
          status: filterStatus,
          priority: filterPriority,
          search: searchQuery,
        }),
        fetchStats(),
      ]);
      setSubmissions(resSubmissions.submissions);
      setStats(resStats);
      if (onSubmissionsUpdated) {
        onSubmissionsUpdated(resStats.total);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load database records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterType, filterStatus, filterPriority, searchQuery]);

  // When initialFormType prop changes
  useEffect(() => {
    if (initialFormType) {
      setSelectedFormType(initialFormType);
    }
  }, [initialFormType]);

  // Quick Demo Fill generators for each form type
  const handleQuickDemoFill = (type: FormType) => {
    setFormError(null);
    setFormSuccessRecord(null);

    switch (type) {
      case 'contact':
        setFormFullName('Kester Bwaga');
        setFormEmail('k.bwaga@suautrading.com.pg');
        setFormPhone('+675 7344 1122');
        setFormOrg('Suau Island Retail & Trading');
        setFormLocation('Fife Bay / Suau Coast, Milne Bay');
        setFormSubject('General Inquiry: Starlink Setup & Solar Inverter Integration');
        setFormServiceCategory('ICT Infrastructure & Hardware');
        setFormMessage('Good morning KILSTA team. We run a retail store and fuel depot on Suau Island. We just received a Starlink dish and need advice on setting up a long-range Wi-Fi link to our staff quarters and connecting our invoice computer to solar power.');
        setFormPriority('normal');
        setFormCustomPayload({
          preferredContact: 'WhatsApp',
          urgency: 'Within this week',
          hasExistingSolar: true
        });
        break;

      case 'audit_booking':
        setFormFullName('Hellen Kaia');
        setFormEmail('hkaia@mbc-enterprises.pg');
        setFormPhone('+675 7190 8821');
        setFormOrg('Milne Bay Cocoa Growers Association');
        setFormLocation('Alotau Port District');
        setFormSubject('Systems Audit: Cooperative Inventory & Member Payouts');
        setFormServiceCategory('ICT Systems Audit');
        setFormMessage('Our cooperative represents 140 smallholder cocoa farmers. We need a complete audit of our weighbridge tally software, paper bookkeeping vouchers, and backup systems before audits by the Cocoa Board.');
        setFormPriority('high');
        setFormCustomPayload({
          preferredDate: '2026-11-12',
          teamSize: '12 administrative staff',
          auditFocus: 'Bookkeeping reconciliation, Excel ledgers, network data backup',
          currentSetup: '4 desktop PCs, multiple flash drives with inconsistent file versions'
        });
        break;

      case 'training_registration':
        setFormFullName('Solomon Vaira');
        setFormEmail('svaira@kiriwina-high.edu.pg');
        setFormPhone('+675 8251 9044');
        setFormOrg('Losuia Community High School');
        setFormLocation('Kiriwina Island, Trobriand Islands');
        setFormSubject('Enrollment: Microsoft Excel & Student Marks Ledger Training');
        setFormServiceCategory('ICT Training');
        setFormMessage('We wish to enroll 4 teachers in your Microsoft Excel for Business & Administration masterclass. We want them to automate termly student report cards and calculate marks accurately.');
        setFormPriority('normal');
        setFormCustomPayload({
          courseName: 'Microsoft Excel Masterclass for Business',
          participantCount: 4,
          cohort: 'Cohort Nov-2026 (Weekend intensive)',
          skillLevel: 'Beginner to Intermediate',
          needsAccommodationAdvice: true
        });
        break;

      case 'service_quote':
        setFormFullName('Doreen Maladina');
        setFormEmail('doreen@eastcapelodge.com.pg');
        setFormPhone('+675 7611 3490');
        setFormOrg('East Cape Coastal Bungalows & Dive');
        setFormLocation('East Cape, MBP');
        setFormSubject('Quotation Request: 8-Camera 4K CCTV & Guest Mesh Wi-Fi');
        setFormServiceCategory('ICT Services & Surveillance');
        setFormMessage('We are upgrading our tourist accommodation with 6 beachfront chalets and a central dining deck. We require outdoor weatherproof IP CCTV cameras covering the boat jetty and parking lot, plus guest Wi-Fi access.');
        setFormPriority('high');
        setFormCustomPayload({
          budgetRange: 'K15,000 - K25,000 PGK',
          projectTimeline: 'Within 3-4 weeks',
          cameraCount: 8,
          guestRooms: 6,
          includesMaintenancePlan: true
        });
        break;

      case 'sme_advisory':
        setFormFullName('Marcus Tom');
        setFormEmail('marcustom.tours@gmail.com');
        setFormPhone('+675 7450 1209');
        setFormOrg('Milne Bay Island Hopping & Dinghy Charters');
        setFormLocation('Sandbank, Alotau');
        setFormSubject('SME Startup: IPA Business Name Registration & IRC TIN Setup');
        setFormServiceCategory('Business Advisory & Compliance');
        setFormMessage('I have been running tourist charters with two banana boats for 2 years. I now want to register my official business name with IPA and get an IRC TIN so I can bill international cruise ship tour agents and open a BSP SME bank account.');
        setFormPriority('urgent');
        setFormCustomPayload({
          registrationType: 'IPA Business Name Registration',
          hasExistingTIN: false,
          needsBankAssistance: true,
          targetLaunchDate: '2026-11-01'
        });
        break;

      case 'newsletter':
        setFormFullName('Alice Gari');
        setFormEmail('agari@alotau-retail.com.pg');
        setFormPhone('+675 7001 2345');
        setFormOrg('Gari General Supplies');
        setFormLocation('Town Market, Alotau');
        setFormSubject('Download: PNG SME IPA & IRC Tax Compliance Guide 2026');
        setFormServiceCategory('Resources & Publications');
        setFormMessage('Requested free download of the 2026 Papua New Guinea SME compliance roadmap.');
        setFormPriority('low');
        setFormCustomPayload({
          resourceName: 'PNG SME IPA & IRC Tax Compliance Guide 2026',
          subscribedNewsletter: true
        });
        break;
    }
  };

  // Reset form inputs
  const handleResetForm = () => {
    setFormFullName('');
    setFormEmail('');
    setFormPhone('');
    setFormOrg('');
    setFormSubject('');
    setFormServiceCategory('');
    setFormMessage('');
    setFormCustomPayload({});
    setFormSuccessRecord(null);
    setFormError(null);
  };

  // Handle Form Submission to Backend SQLite Database
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formFullName.trim() || !formEmail.trim()) {
      setFormError('Please enter your full name and valid email address.');
      return;
    }

    setFormSubmitting(true);
    try {
      const input: SubmissionInput = {
        form_type: selectedFormType,
        full_name: formFullName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        organization: formOrg.trim(),
        location: formLocation.trim() || 'Milne Bay Province',
        subject: formSubject.trim() || `${selectedFormType.replace('_', ' ').toUpperCase()} Submission`,
        service_category: formServiceCategory.trim() || 'General Consulting',
        message: formMessage.trim(),
        priority: formPriority,
        payload: formCustomPayload,
      };

      const result = await submitForm(input);
      setFormSuccessRecord(result);
      await loadData(); // refresh database records
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit form to database.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Status update handler
  const handleStatusChange = async (id: number, newStatus: SubmissionStatus) => {
    try {
      const updated = await updateSubmission(id, { status: newStatus });
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      if (inspectedSubmission && inspectedSubmission.id === id) {
        setInspectedSubmission(updated);
      }
      const newStats = await fetchStats();
      setStats(newStats);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Priority update handler
  const handlePriorityChange = async (id: number, newPriority: SubmissionPriority) => {
    try {
      const updated = await updateSubmission(id, { priority: newPriority });
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      if (inspectedSubmission && inspectedSubmission.id === id) {
        setInspectedSubmission(updated);
      }
      const newStats = await fetchStats();
      setStats(newStats);
    } catch (err: any) {
      alert(`Error updating priority: ${err.message}`);
    }
  };

  // Save internal staff note
  const handleSaveInternalNote = async () => {
    if (!inspectedSubmission) return;
    setUpdatingNote(true);
    try {
      const updated = await updateSubmission(inspectedSubmission.id, {
        internal_notes: internalNoteDraft,
      });
      setSubmissions((prev) => (prev.map((s) => (s.id === updated.id ? updated : s))));
      setInspectedSubmission(updated);
    } catch (err: any) {
      alert(`Error saving internal note: ${err.message}`);
    } finally {
      setUpdatingNote(false);
    }
  };

  // Delete submission handler
  const handleDeleteSubmission = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete submission #${id}? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (inspectedSubmission?.id === id) {
        setInspectedSubmission(null);
      }
      const newStats = await fetchStats();
      setStats(newStats);
    } catch (err: any) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  // Reset & Re-seed Sample Database
  const handleResetSampleData = async () => {
    if (!window.confirm('Reset database to authentic Milne Bay sample records? Existing custom additions will be refreshed.')) {
      return;
    }
    setLoading(true);
    try {
      await reseedDatabase(true);
      await loadData();
    } catch (err: any) {
      alert(`Reset error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open inspector
  const handleOpenInspector = (submission: FormSubmission) => {
    setInspectedSubmission(submission);
    setInternalNoteDraft(submission.internal_notes || '');
  };

  // Convert current table submissions into a downloadable CSV spreadsheet
  const handleExportToCSV = () => {
    if (!submissions || submissions.length === 0) {
      alert('There are no submissions in the current table to export. Try clearing your filters to display records.');
      return;
    }

    const headers = [
      'Reference Code',
      'Form Type',
      'Full Name',
      'Email',
      'Phone',
      'Organization / Business',
      'Location',
      'Subject',
      'Service Category',
      'Status',
      'Priority',
      'Submitted Date',
      'Internal Admin Notes',
      'Client Requirements / Message',
      'Additional Details'
    ];

    const escapeCsvField = (value: any): string => {
      if (value === null || value === undefined) return '""';
      const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = submissions.map((sub) => [
      escapeCsvField(sub.ref_code),
      escapeCsvField(sub.form_type.replace(/_/g, ' ')),
      escapeCsvField(sub.full_name),
      escapeCsvField(sub.email),
      escapeCsvField(sub.phone || ''),
      escapeCsvField(sub.organization || 'Individual'),
      escapeCsvField(sub.location || 'Alotau, Milne Bay'),
      escapeCsvField(sub.subject || 'Client Inquiry'),
      escapeCsvField(sub.service_category || 'General ICT & Business'),
      escapeCsvField(sub.status.toUpperCase()),
      escapeCsvField(sub.priority.toUpperCase()),
      escapeCsvField(new Date(sub.created_at).toLocaleString()),
      escapeCsvField(sub.internal_notes || ''),
      escapeCsvField(sub.message || ''),
      escapeCsvField(sub.payload ? JSON.stringify(sub.payload) : '')
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const filterTags = [
      filterType !== 'all' ? filterType : null,
      filterStatus !== 'all' ? filterStatus : null,
      filterPriority !== 'all' ? filterPriority : null,
      searchQuery.trim() ? 'filtered' : null
    ].filter(Boolean).join('_');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `kilstar_table_submissions_${filterTags ? `${filterTags}_` : ''}${timestamp}.csv`;

    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${submissions.length} table ${submissions.length === 1 ? 'submission' : 'submissions'} to spreadsheet (${filename})`);
    setTimeout(() => {
      setExportNotice(null);
    }, 5000);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-cyan-500" />
              <span>Full-Stack Form System & SQLite Database</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              KILSTA Form Submission & Database Center
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Fill out and test real business forms for KILSTA services, or manage, filter, and inspect all form records stored persistently in the database.
            </p>
          </div>

          {/* Sub-Tab Navigation Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300">
            <button
              onClick={() => setActiveSubTab('fill')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'fill'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Fill Up Forms</span>
            </button>
            <button
              onClick={() => setActiveSubTab('database')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'database'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Live Database Records</span>
              {stats && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeSubTab === 'database' ? 'bg-cyan-400 text-slate-900' : 'bg-slate-300 text-slate-800'
                }`}>
                  {stats.total}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUB-TAB 1: FILL UP FORMS                                       */}
        {/* ============================================================== */}
        {activeSubTab === 'fill' && (
          <div className="space-y-6">
            
            {/* Form Type Picker Tabs */}
            <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-1 pb-2">
                Select Form Type to Fill & Store
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { id: 'contact' as FormType, label: 'General Contact', icon: MessageSquare, badge: 'Inquiry' },
                  { id: 'audit_booking' as FormType, label: 'IT Systems Audit', icon: Calendar, badge: 'Free Assessment' },
                  { id: 'training_registration' as FormType, label: 'Training Enrollment', icon: GraduationCap, badge: 'Courses' },
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
                        setFormSuccessRecord(null);
                        setFormError(null);
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

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Form Card Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-white capitalize">
                      {selectedFormType.replace('_', ' ')} Submission Form
                    </h2>
                    <p className="text-xs text-slate-300">
                      Submissions write directly to the persistent SQLite database
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
                    onClick={handleResetForm}
                    className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-slate-800 transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {/* Form Card Body */}
              <div className="p-6">
                
                {formSuccessRecord ? (
                  <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-extrabold text-slate-900">Form Successfully Recorded!</h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto">
                        Your submission has been verified, assigned a tracking code, and stored into the KILSTA database.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-lg mx-auto text-left text-xs space-y-2.5">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Record Reference ID:</span>
                        <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                          {formSuccessRecord.ref_code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Form Category:</span>
                        <span className="font-semibold text-slate-800 capitalize">{formSuccessRecord.form_type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Contact Person:</span>
                        <span className="font-semibold text-slate-800">{formSuccessRecord.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Organization:</span>
                        <span className="font-semibold text-slate-800">{formSuccessRecord.organization || 'Individual'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Status in Database:</span>
                        <span className="font-semibold text-emerald-700 capitalize">{formSuccessRecord.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Recorded Timestamp:</span>
                        <span className="font-mono text-slate-600">{new Date(formSuccessRecord.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                      <button
                        onClick={() => {
                          setActiveSubTab('database');
                          handleOpenInspector(formSuccessRecord);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-sm"
                      >
                        <Database className="w-4 h-4" />
                        <span>View in Live Database Explorer</span>
                      </button>
                      <button
                        onClick={handleResetForm}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                      >
                        Fill Out Another Form
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Common Contact Fields */}
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        1. Contact & Organization Details
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formFullName}
                            onChange={(e) => setFormFullName(e.target.value)}
                            placeholder="e.g. Stallone Yabom"
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
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="e.g. client@domain.com.pg"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
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
                            value={formOrg}
                            onChange={(e) => setFormOrg(e.target.value)}
                            placeholder="e.g. Alotau Enterprise Co."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Milne Bay District / Location
                          </label>
                          <input
                            type="text"
                            value={formLocation}
                            onChange={(e) => setFormLocation(e.target.value)}
                            placeholder="e.g. Alotau Urban, Samarai, Suau, Esaala"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Urgency / Priority
                          </label>
                          <select
                            value={formPriority}
                            onChange={(e) => setFormPriority(e.target.value as SubmissionPriority)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="low">Low Priority</option>
                            <option value="normal">Normal Priority</option>
                            <option value="high">High Priority</option>
                            <option value="urgent">Urgent Attention</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Form-Specific Customized Fields */}
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        2. {selectedFormType.replace('_', ' ').toUpperCase()} Scope & Specifications
                      </div>

                      {/* Type: Contact */}
                      {selectedFormType === 'contact' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Subject / Service Inquired *
                            </label>
                            <input
                              type="text"
                              required
                              value={formSubject}
                              onChange={(e) => setFormSubject(e.target.value)}
                              placeholder="e.g. Starlink Wi-Fi Setup & Solar Backup"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Preferred Follow-up Method
                            </label>
                            <select
                              value={formCustomPayload.preferredContact || 'Email'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, preferredContact: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="Email">Email response</option>
                              <option value="Phone Call">Phone Call during business hours</option>
                              <option value="WhatsApp">WhatsApp message</option>
                              <option value="Office Visit">Visit our Alotau office</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Type: Audit Booking */}
                      {selectedFormType === 'audit_booking' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Target Audit Date
                            </label>
                            <input
                              type="date"
                              value={formCustomPayload.preferredDate || ''}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, preferredDate: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Staff & Device Count
                            </label>
                            <select
                              value={formCustomPayload.teamSize || '5-15 employees'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, teamSize: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="1-5 staff / PCs">1-5 staff / PCs</option>
                              <option value="5-15 employees">5-15 employees</option>
                              <option value="15-30 employees">15-30 employees</option>
                              <option value="30+ enterprise scale">30+ enterprise scale</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Audit Focus Area
                            </label>
                            <select
                              value={formCustomPayload.auditFocus || 'ICT Infrastructure, Network & Backup'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, auditFocus: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="ICT Infrastructure, Network & Backup">ICT Infrastructure & Backup</option>
                              <option value="CCTV Security & Surveillance">CCTV Security & Surveillance</option>
                              <option value="IPA & IRC Statutory Compliance">IPA & IRC Statutory Compliance</option>
                              <option value="Bookkeeping & Accounting Software">Bookkeeping & Software</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Type: Training Registration */}
                      {selectedFormType === 'training_registration' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Select Training Course *
                            </label>
                            <select
                              value={formCustomPayload.courseName || 'Microsoft Excel Masterclass for Business'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, courseName: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                              Number of Candidates / Attendees
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={formCustomPayload.participantCount || 1}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, participantCount: Number(e.target.value) })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Cohort / Timing Preference
                            </label>
                            <select
                              value={formCustomPayload.cohort || 'November 2026 Cohort'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, cohort: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="November 2026 Cohort (Evening)">November 2026 (Evening)</option>
                              <option value="November 2026 Cohort (Weekend)">November 2026 (Weekend)</option>
                              <option value="December 2026 Intensive">December 2026 Intensive</option>
                              <option value="On-Site Corporate (Flexible Dates)">On-Site Corporate (Flexible)</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Type: Service Quote */}
                      {selectedFormType === 'service_quote' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Budget Range (PGK Kina)
                            </label>
                            <select
                              value={formCustomPayload.budgetRange || 'K5,000 - K15,000 PGK'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, budgetRange: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="Under K2,500 PGK">Under K2,500 PGK</option>
                              <option value="K2,500 - K5,000 PGK">K2,500 - K5,000 PGK</option>
                              <option value="K5,000 - K15,000 PGK">K5,000 - K15,000 PGK</option>
                              <option value="K15,000 - K35,000 PGK">K15,000 - K35,000 PGK</option>
                              <option value="K35,000+ Major Enterprise Project">K35,000+ Major Project</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Desired Timeline
                            </label>
                            <select
                              value={formCustomPayload.projectTimeline || 'Within 30 days'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, projectTimeline: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="Immediate / Emergency">Immediate / Emergency</option>
                              <option value="Within 14 days">Within 14 days</option>
                              <option value="Within 30 days">Within 30 days</option>
                              <option value="Planning for Next Quarter">Planning for Next Quarter</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Site Inspection Required?
                            </label>
                            <select
                              value={formCustomPayload.needsSiteSurvey ? 'Yes' : 'No'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, needsSiteSurvey: e.target.value === 'Yes' })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="Yes">Yes, site inspection in Milne Bay</option>
                              <option value="No">No, quote based on scope document</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Type: SME Advisory */}
                      {selectedFormType === 'sme_advisory' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Entity Registration Type
                            </label>
                            <select
                              value={formCustomPayload.registrationType || 'IPA Business Name (Sole Trader)'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, registrationType: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="IPA Business Name (Sole Trader / Partnership)">IPA Business Name</option>
                              <option value="IPA Company Limited by Shares">Private Company (Ltd)</option>
                              <option value="IPA Association or Cooperative Society">Cooperative / Association</option>
                              <option value="Annual Returns Update & Penalty Waiver">Annual Returns Overdue Filing</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              IRC Tax Status
                            </label>
                            <select
                              value={formCustomPayload.taxStatus || 'Needs New TIN'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, taxStatus: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="Needs New TIN">Needs New TIN</option>
                              <option value="Has TIN, needs COC for tender">Has TIN, needs COC for tender</option>
                              <option value="Needs GST / SWT registration">Needs GST / SWT setup</option>
                              <option value="Already Tax Compliant">Already Tax Compliant</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Bank Account & Loans Support
                            </label>
                            <select
                              value={formCustomPayload.bankAssistance || 'BSP SME Account'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, bankAssistance: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="BSP SME Account">BSP SME Account Support</option>
                              <option value="Kina Bank SME">Kina Bank SME Account</option>
                              <option value="NDB / Women Micro-Bank Loan Plan">NDB / Micro-Bank Loan Profile</option>
                              <option value="Not Required">Not Required</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Type: Newsletter */}
                      {selectedFormType === 'newsletter' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Resource Guide Requested
                            </label>
                            <select
                              value={formCustomPayload.resourceName || 'PNG SME IPA & IRC Tax Compliance Guide 2026'}
                              onChange={(e) =>
                                setFormCustomPayload({ ...formCustomPayload, resourceName: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="PNG SME IPA & IRC Tax Compliance Guide 2026">PNG SME IPA & IRC Tax Compliance Guide 2026</option>
                              <option value="Small Business Cybersecurity & Phishing Prevention Guide">Small Business Cybersecurity Handbook</option>
                              <option value="Milne Bay Hardware & Solar Backup Setup Checklist">Milne Bay Hardware & Solar Backup Checklist</option>
                              <option value="Monthly KILSTA Business & ICT Dispatch">Monthly KILSTA Business & ICT Dispatch</option>
                            </select>
                          </div>
                          <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formCustomPayload.subscribedNewsletter ?? true}
                                onChange={(e) =>
                                  setFormCustomPayload({ ...formCustomPayload, subscribedNewsletter: e.target.checked })
                                }
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                              />
                              <span>Receive monthly email updates on Milne Bay tenders & ICT tips</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message / Details textarea */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detailed Description / Requirements *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Provide details about your requirements, specific systems, deadlines, or questions..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Data is stored securely on KILSTA SQLite database.</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleQuickDemoFill(selectedFormType)}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Fill Sample Data
                        </button>
                        <button
                          type="submit"
                          disabled={formSubmitting}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold shadow-sm transition-all"
                        >
                          {formSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Saving to Database...</span>
                            </>
                          ) : (
                            <>
                              <Database className="w-4 h-4" />
                              <span>Save to Database</span>
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
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 2: LIVE DATABASE MANAGEMENT EXPLORER                   */}
        {/* ============================================================== */}
        {activeSubTab === 'database' && (
          <div className="space-y-6">
            
            {/* Database Metrics Row */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Total In Database</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Persistent SQLite
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">New / Unread</div>
                  <div className="text-2xl font-extrabold text-blue-700 mt-1">
                    {stats.byStatus['new'] || 0}
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium mt-1">
                    Awaiting initial action
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Systems Audits</div>
                  <div className="text-2xl font-extrabold text-teal-700 mt-1">
                    {stats.byType['audit_booking'] || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Booked audits
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Training Enrollments</div>
                  <div className="text-2xl font-extrabold text-indigo-700 mt-1">
                    {stats.byType['training_registration'] || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Registered candidates
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">SME / Quotes</div>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">
                    {(stats.byType['sme_advisory'] || 0) + (stats.byType['service_quote'] || 0)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Commercial inquiries
                  </div>
                </div>
              </div>
            )}

            {/* Filter & Search Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, organization, email, ref code..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Toolbar Buttons: Export to CSV & Reset */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportToCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white transition-all shadow-xs hover:shadow"
                    title={`Convert and download ${submissions.length} current table records to a CSV spreadsheet`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                    <span>Export to CSV</span>
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-emerald-700 text-[10px] text-emerald-100 font-mono">
                      {submissions.length}
                    </span>
                  </button>
                  <a
                    href={getExportUrl('json')}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                    title="Download JSON backup"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export JSON</span>
                  </a>
                  <button
                    type="button"
                    onClick={loadData}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                    title="Reload data"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={handleResetSampleData}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 transition-colors"
                    title="Re-seed authentic Milne Bay sample records"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Re-seed Samples</span>
                  </button>
                </div>
              </div>

              {/* Segmented Filter Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
                
                {/* Form Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Type:</span>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="all">All Form Types</option>
                    <option value="contact">Contact Inquiry</option>
                    <option value="audit_booking">IT Systems Audit</option>
                    <option value="training_registration">Training Registration</option>
                    <option value="service_quote">Service Quote</option>
                    <option value="sme_advisory">SME & IPA Advisory</option>
                    <option value="newsletter">Resource Download</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in_review">In Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Priority:</span>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {(filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setFilterStatus('all');
                      setFilterPriority('all');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline ml-auto"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Export Notification Toast / Banner */}
            {exportNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{exportNotice}</span>
                </div>
                <button
                  onClick={() => setExportNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-sm font-bold px-2 py-0.5 rounded hover:bg-emerald-100"
                >
                  ×
                </button>
              </div>
            )}

            {/* Submissions Table & Cards */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              {/* Table Header Bar with Count and Export to CSV Action */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">Database Records</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[11px]">
                    {submissions.length} {submissions.length === 1 ? 'record' : 'records'}
                  </span>
                  {(filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
                    <span className="text-slate-400 text-[11px] italic">
                      (Filtered view)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleExportToCSV}
                  disabled={submissions.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors"
                  title="Download current table records as a CSV spreadsheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export to CSV</span>
                </button>
              </div>
              {loading ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  <div className="text-sm font-medium">Querying SQLite Database...</div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <Database className="w-8 h-8 mx-auto text-slate-400" />
                  <div className="font-bold text-slate-800">No matching submissions found</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing your search query or filters, or fill out a new form in the "Fill Up Forms" tab above.
                  </p>
                  <button
                    onClick={() => handleResetSampleData()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Seed Sample Data</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Ref / Type</th>
                        <th className="py-3 px-4">Contact / Organization</th>
                        <th className="py-3 px-4">Subject & Message</th>
                        <th className="py-3 px-4">Date & Location</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => {
                        const statusColors: Record<string, string> = {
                          new: 'bg-blue-50 text-blue-700 border-blue-200',
                          in_review: 'bg-amber-50 text-amber-700 border-amber-200',
                          contacted: 'bg-purple-50 text-purple-700 border-purple-200',
                          scheduled: 'bg-teal-50 text-teal-700 border-teal-200',
                          completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          archived: 'bg-slate-100 text-slate-600 border-slate-200',
                        };

                        const priorityColors: Record<string, string> = {
                          urgent: 'bg-red-50 text-red-700 border-red-200',
                          high: 'bg-orange-50 text-orange-700 border-orange-200',
                          normal: 'bg-slate-100 text-slate-700 border-slate-200',
                          low: 'bg-slate-50 text-slate-500 border-slate-200',
                        };

                        return (
                          <tr
                            key={sub.id}
                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            onClick={() => handleOpenInspector(sub)}
                          >
                            {/* Ref & Type */}
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-xs text-blue-700">
                                {sub.ref_code}
                              </div>
                              <div className="text-[11px] text-slate-500 capitalize font-medium">
                                {sub.form_type.replace('_', ' ')}
                              </div>
                            </td>

                            {/* Contact / Org */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{sub.full_name}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[180px]">
                                {sub.organization || sub.email}
                              </div>
                            </td>

                            {/* Subject & Summary */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="font-medium text-xs text-slate-900 truncate">
                                {sub.subject || 'Inquiry'}
                              </div>
                              <div className="text-xs text-slate-500 truncate max-w-[240px]">
                                {sub.message || 'No description provided'}
                              </div>
                            </td>

                            {/* Date & Location */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                              <div>{new Date(sub.created_at).toLocaleDateString()}</div>
                              <div className="text-[11px] text-slate-400">{sub.location}</div>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={sub.status}
                                onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-md border capitalize focus:outline-none cursor-pointer ${
                                  statusColors[sub.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="contacted">Contacted</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>

                            {/* Priority Selector */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={sub.priority}
                                onChange={(e) => handlePriorityChange(sub.id, e.target.value as SubmissionPriority)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-md border uppercase focus:outline-none cursor-pointer ${
                                  priorityColors[sub.priority] || 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenInspector(sub)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                  title="View full record"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubmission(sub.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                                  title="Delete submission"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUBMISSION INSPECTION DRAWER / MODAL                           */}
        {/* ============================================================== */}
        {inspectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Top Header */}
              <div className="px-6 py-4 bg-[#0a1430] text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-bold bg-blue-600/30 text-cyan-400 px-2.5 py-1 rounded-md border border-blue-500/40">
                    {inspectedSubmission.ref_code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white capitalize">
                      {inspectedSubmission.form_type.replace('_', ' ')} Record Details
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID #{inspectedSubmission.id} · Recorded {new Date(inspectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedSubmission(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Status & Priority Bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600">Status:</span>
                      <select
                        value={inspectedSubmission.status}
                        onChange={(e) => handleStatusChange(inspectedSubmission.id, e.target.value as SubmissionStatus)}
                        className="font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white capitalize text-slate-800"
                      >
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600">Priority:</span>
                      <select
                        value={inspectedSubmission.priority}
                        onChange={(e) => handlePriorityChange(inspectedSubmission.id, e.target.value as SubmissionPriority)}
                        className="font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white uppercase text-slate-800"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${inspectedSubmission.email}?subject=RE: ${encodeURIComponent(inspectedSubmission.subject || 'KILSTA Consultation')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Client</span>
                    </a>
                    {inspectedSubmission.phone && (
                      <a
                        href={`https://wa.me/${inspectedSubmission.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                      Contact Information
                    </div>
                    <div>
                      <span className="text-slate-500">Name:</span>{' '}
                      <strong className="text-slate-900 text-sm">{inspectedSubmission.full_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>{' '}
                      <a href={`mailto:${inspectedSubmission.email}`} className="text-blue-600 hover:underline font-medium">
                        {inspectedSubmission.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone:</span>{' '}
                      <span className="text-slate-900 font-medium">{inspectedSubmission.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Milne Bay Location:</span>{' '}
                      <span className="text-slate-900 font-medium">{inspectedSubmission.location || 'Alotau'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                      Business & Category
                    </div>
                    <div>
                      <span className="text-slate-500">Organization:</span>{' '}
                      <strong className="text-slate-900">{inspectedSubmission.organization || 'Individual'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Form Category:</span>{' '}
                      <span className="capitalize font-medium text-slate-800">{inspectedSubmission.form_type.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Subject:</span>{' '}
                      <span className="font-medium text-slate-800">{inspectedSubmission.subject || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Service Area:</span>{' '}
                      <span className="font-medium text-slate-800">{inspectedSubmission.service_category || 'General'}</span>
                    </div>
                  </div>
                </div>

                {/* Message / Request Body */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Detailed Request / Description
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {inspectedSubmission.message || 'No additional message provided.'}
                  </p>
                </div>

                {/* Form-Specific Payload Attributes */}
                {inspectedSubmission.payload && Object.keys(inspectedSubmission.payload).length > 0 && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                      Form Custom Payload Attributes
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {Object.entries(inspectedSubmission.payload).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-400 capitalize block text-[10px] font-mono">{k}</span>
                          <span className="font-semibold text-slate-800 text-xs">
                            {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Notes Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Internal Staff Notes
                    </label>
                    <span className="text-[11px] text-slate-400">Stored in SQLite database</span>
                  </div>
                  <textarea
                    rows={3}
                    value={internalNoteDraft}
                    onChange={(e) => setInternalNoteDraft(e.target.value)}
                    placeholder="Add operational notes, consultation follow-ups, invoice references, or phone log details..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-slate-50/50"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveInternalNote}
                      disabled={updatingNote}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50 transition-colors"
                    >
                      {updatingNote ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Note...</span>
                        </>
                      ) : (
                        <span>Save Internal Note</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleDeleteSubmission(inspectedSubmission.id)}
                  className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Record</span>
                </button>

                <button
                  onClick={() => setInspectedSubmission(null)}
                  className="px-5 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
