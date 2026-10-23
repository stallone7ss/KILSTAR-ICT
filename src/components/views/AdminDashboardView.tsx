import React, { useState, useEffect } from 'react';
import {
  fetchSubmissions,
  fetchStats,
  updateSubmission,
  deleteSubmission,
  reseedDatabase,
  getExportUrl,
  loginAdmin,
  verifyAdminSession,
  logoutAdmin,
  changeAdminPassword
} from '../../services/api';
import {
  FormSubmission,
  DatabaseStats,
  FormType,
  SubmissionStatus,
  SubmissionPriority
} from '../../types/database';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Database,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit3,
  Clock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  X,
  MessageSquare,
  AlertCircle,
  LogOut,
  UserCheck,
  CheckCircle2,
  Save,
  HelpCircle
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigateHome: () => void;
  onSubmissionsUpdated?: (count: number) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateHome,
  onSubmissionsUpdated,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Change Password Modal State
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [changePassMessage, setChangePassMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Dashboard Data State
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filters & Search
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Submission Detail Modal
  const [inspectedSubmission, setInspectedSubmission] = useState<FormSubmission | null>(null);
  const [internalNoteDraft, setInternalNoteDraft] = useState<string>('');
  const [updatingNote, setUpdatingNote] = useState<boolean>(false);
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);

  // Check existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const valid = await verifyAdminSession();
    setIsAuthenticated(valid);
    if (valid) {
      loadData();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!passwordInput.trim()) {
      setAuthError('Please enter the administrator password.');
      return;
    }

    setAuthLoading(true);
    try {
      await loginAdmin(passwordInput.trim());
      setIsAuthenticated(true);
      setPasswordInput('');
      await loadData();
    } catch (err: any) {
      setAuthError(err.message || 'Incorrect administrator password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setSubmissions([]);
    setStats(null);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassMessage(null);

    if (!currentPassInput || !newPassInput) {
      setChangePassMessage({ type: 'error', text: 'Please fill in both fields.' });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setChangePassMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassInput.length < 4) {
      setChangePassMessage({ type: 'error', text: 'Password must be at least 4 characters.' });
      return;
    }

    setChangePassLoading(true);
    try {
      await changeAdminPassword(currentPassInput, newPassInput);
      setChangePassMessage({ type: 'success', text: 'Password changed successfully! Keep your new password safe.' });
      setTimeout(() => {
        setChangePasswordModalOpen(false);
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
        setChangePassMessage(null);
      }, 2000);
    } catch (err: any) {
      setChangePassMessage({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setChangePassLoading(false);
    }
  };

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
      if (err.message === 'UNAUTHORIZED_ADMIN') {
        setIsAuthenticated(false);
      } else {
        setError(err.message || 'Failed to load client form requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [filterType, filterStatus, filterPriority, searchQuery]);

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

  const handleSaveInternalNote = async () => {
    if (!inspectedSubmission) return;
    setUpdatingNote(true);
    setNoteSuccess(false);
    try {
      const updated = await updateSubmission(inspectedSubmission.id, {
        internal_notes: internalNoteDraft,
      });
      setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setInspectedSubmission(updated);
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error saving internal note: ${err.message}`);
    } finally {
      setUpdatingNote(false);
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete form request #${id}? This will permanently remove the record from the database.`)) {
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

  const handleResetSampleData = async () => {
    if (!window.confirm('Restore authentic Milne Bay sample client requests in the database?')) {
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

  const handleOpenInspector = (submission: FormSubmission) => {
    setInspectedSubmission(submission);
    setInternalNoteDraft(submission.internal_notes || '');
    setNoteSuccess(false);
  };

  // Convert current table submissions into a downloadable CSV spreadsheet
  const handleExportToCSV = () => {
    if (!submissions || submissions.length === 0) {
      alert('There are no submissions in the current table to export. Try resetting or clearing your filters to display records.');
      return;
    }

    // Comprehensive CSV Spreadsheet Columns
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
      'Additional Custom Details'
    ];

    // RFC 4180 CSV escaping helper
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

    // Prepend UTF-8 BOM (\uFEFF) so Excel, Google Sheets, LibreOffice properly parse special symbols
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

  // ----------------------------------------------------------------------
  // VIEW A: ADMINISTRATOR PASSWORD LOGIN GATE
  // ----------------------------------------------------------------------
  if (isAuthenticated === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0a1430] text-white p-8 text-center space-y-3 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto flex items-center justify-center shadow-md border-2 border-cyan-400/40">
              <img
                src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                alt="KILSTA Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                KILSTA Administrator Portal
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Restricted Database Access · Client Forms & Inquiries
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="p-8 space-y-6">
            
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrator Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Hint Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Administrator Security Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Only the system administrator can access client records, audit bookings, and quotes.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Default password:</span>
                  <button
                    type="button"
                    onClick={() => setPasswordInput('kilsta2026')}
                    className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100"
                  >
                    kilsta2026
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Database Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                onClick={onNavigateHome}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                ← Return to Public Website
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Loading Session verification state
  if (isAuthenticated === null) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <div className="text-xs font-semibold text-slate-500">Checking administrator privileges...</div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW B: AUTHENTICATED ADMINISTRATOR DATABASE DASHBOARD
  // ----------------------------------------------------------------------
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Administrator Command Bar Header */}
        <div className="bg-[#0a1430] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-md border border-cyan-400/30 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                alt="KILSTA Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Administrator Authenticated</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-mono border border-blue-500/30">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SQLite Active</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Client Form Submissions & Database Dashboard
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl">
                Internal management portal for reviewing, filtering, tracking, and following up on all client inquiries, audit bookings, and training enrollments.
              </p>
            </div>
          </div>

          {/* Admin Quick Tools */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setChangePasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-800/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Analytics & Metrics Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Total Client Requests</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                Persistent In Database
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">New / Unread</div>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">
                {stats.byStatus['new'] || 0}
              </div>
              <div className="text-[11px] text-blue-600 font-medium mt-1">
                Pending Administrator Review
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Urgent / High Attention</div>
              <div className="text-2xl font-extrabold text-red-600 mt-1">
                {(stats.byPriority['urgent'] || 0) + (stats.byPriority['high'] || 0)}
              </div>
              <div className="text-[11px] text-red-500 font-medium mt-1">
                Prioritized Leads
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">IT Audits Booked</div>
              <div className="text-2xl font-extrabold text-teal-700 mt-1">
                {stats.byType['audit_booking'] || 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Free Systems Reviews
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Training & Quotes</div>
              <div className="text-2xl font-extrabold text-indigo-700 mt-1">
                {(stats.byType['training_registration'] || 0) + (stats.byType['service_quote'] || 0)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Commercial Pipeline
              </div>
            </div>
          </div>
        )}

        {/* Controls, Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name, organization, phone, ref..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Action Buttons: Export to CSV, JSON & Admin Tools */}
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
                title="Reload database records"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleResetSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 transition-colors"
                title="Reset database to authentic Milne Bay test records"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Reset Demo Samples</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Form:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="contact">Contact Message</option>
                <option value="audit_booking">IT Systems Audit</option>
                <option value="training_registration">Training Registration</option>
                <option value="service_quote">Service Quote</option>
                <option value="sme_advisory">SME & IPA Advisory</option>
                <option value="newsletter">Resource Download</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Status:</span>
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

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Priority:</span>
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
                Clear Filters
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

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Table Header Bar with Count and Export to CSV Action */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Client Submissions</span>
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
              <div className="font-bold text-slate-800">No client form submissions match your filter</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Clients filling forms on the website will instantly appear in this table.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tracking Code / Type</th>
                    <th className="py-3 px-4">Client / Organization</th>
                    <th className="py-3 px-4">Subject & Details</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Workflow Status</th>
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
                        {/* Ref Code & Type */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-xs text-blue-700">
                            {sub.ref_code}
                          </div>
                          <div className="text-[11px] text-slate-500 capitalize font-medium">
                            {sub.form_type.replace('_', ' ')}
                          </div>
                        </td>

                        {/* Client / Org */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{sub.full_name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[180px]">
                            {sub.organization || sub.email}
                          </div>
                        </td>

                        {/* Subject & Summary */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-medium text-xs text-slate-900 truncate">
                            {sub.subject || 'Client Inquiry'}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-[240px]">
                            {sub.message || 'No additional notes provided'}
                          </div>
                        </td>

                        {/* Date & Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                          <div>{new Date(sub.created_at).toLocaleDateString()}</div>
                          <div className="text-[11px] text-slate-400">{sub.location}</div>
                        </td>

                        {/* Status Dropdown */}
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

                        {/* Priority Dropdown */}
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
                              title="Inspect full client request"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete record"
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

        {/* ------------------------------------------------------------------ */}
        {/* CLIENT REQUEST INSPECTION MODAL                                    */}
        {/* ------------------------------------------------------------------ */}
        {inspectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Top Modal Header */}
              <div className="px-6 py-4 bg-[#0a1430] text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-bold bg-blue-600/30 text-cyan-400 px-2.5 py-1 rounded-md border border-blue-500/40">
                    {inspectedSubmission.ref_code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white capitalize">
                      {inspectedSubmission.form_type.replace('_', ' ')} Client Request
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID #{inspectedSubmission.id} · Logged {new Date(inspectedSubmission.created_at).toLocaleString()}
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
                
                {/* Status, Priority & Quick Client Contact Buttons */}
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

                  {/* Direct Contact Triggers */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${inspectedSubmission.email}?subject=RE: ${encodeURIComponent(inspectedSubmission.subject || 'KILSTA Consultation Inquiry')}`}
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

                {/* Client Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                      Client Details
                    </div>
                    <div>
                      <span className="text-slate-500">Full Name:</span>{' '}
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
                      <span className="text-slate-500">Location:</span>{' '}
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
                      <span className="text-slate-500">Category:</span>{' '}
                      <span className="capitalize font-medium text-slate-800">{inspectedSubmission.form_type.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Subject:</span>{' '}
                      <span className="font-medium text-slate-800">{inspectedSubmission.subject || 'Inquiry'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Service:</span>{' '}
                      <span className="font-medium text-slate-800">{inspectedSubmission.service_category || 'General'}</span>
                    </div>
                  </div>
                </div>

                {/* Client Message */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Client Request & Message
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {inspectedSubmission.message || 'No additional message provided.'}
                  </p>
                </div>

                {/* Custom Form Payload Specifics */}
                {inspectedSubmission.payload && Object.keys(inspectedSubmission.payload).length > 0 && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                      Custom Form Fields & Specifications
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

                {/* Internal Administrator Notes Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Administrator Internal Notes</span>
                    </label>
                    {noteSuccess && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saved to SQLite</span>
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={internalNoteDraft}
                    onChange={(e) => setInternalNoteDraft(e.target.value)}
                    placeholder="Enter private administrator follow-up notes, phone call logs, quotation amounts, or assigned staff member..."
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
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Note to Database</span>
                        </>
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

        {/* ------------------------------------------------------------------ */}
        {/* CHANGE PASSWORD MODAL                                              */}
        {/* ------------------------------------------------------------------ */}
        {changePasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#0a1430] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-base">Change Administrator Password</h3>
                </div>
                <button
                  onClick={() => setChangePasswordModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
                {changePassMessage && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    changePassMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {changePassMessage.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="Enter new admin password..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    placeholder="Confirm new password..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setChangePasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changePassLoading}
                    className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {changePassLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
