import React, { useState, useEffect } from 'react';
import { X, LogIn, LogOut, User as UserIcon, FileText, CheckCircle2, Loader2, Clock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ isOpen, onClose }) => {
  const { user, token, loading, signInWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'quotes' | 'inquiries'>('quotes');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user && token) {
      loadData();
    }
  }, [isOpen, user, token]);

  const loadData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    setError(null);
    try {
      const [quotesRes, contactsRes] = await Promise.all([
        fetch('/api/quotes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (quotesRes.ok) {
        const qData = await quotesRes.json();
        setQuotes(qData);
      }
      if (contactsRes.ok) {
        const cData = await contactsRes.json();
        setContacts(cData);
      }
    } catch {
      setError('Unable to load client records.');
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#081930] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kilstar Client Portal</h3>
              <p className="text-xs text-slate-400">Account & Submission Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
              <p className="text-sm">Authenticating...</p>
            </div>
          ) : !user ? (
            <div className="py-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Welcome to Client Sign-In</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Sign in securely with Google to view the real-time status of your ICT quotes, consultation inquiries, and corporate proposals.
              </p>
              <button
                onClick={() => signInWithGoogle().catch(() => {})}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          ) : (
            <div>
              {/* User Bar */}
              <div className="bg-[#020b18] border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-teal-500/40" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{user.displayName || 'Enterprise User'}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Submissions Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'quotes'
                      ? 'bg-[#00a3a6] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quote Requests ({quotes.length})
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-[#00a3a6] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  General Inquiries ({contacts.length})
                </button>
              </div>

              {isLoadingData ? (
                <div className="py-8 flex justify-center text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                </div>
              ) : activeTab === 'quotes' ? (
                quotes.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No quote requests recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {quotes.map((q) => (
                      <div key={q.id} className="bg-[#020b18] border border-slate-800 rounded-xl p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-white">{q.projectScope}</h5>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {q.status || 'pending'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Client: {q.clientName} | Budget: {q.estimatedBudget || 'N/A'}</p>
                        {q.createdAt && (
                          <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(q.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : contacts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No consultation inquiries recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c) => (
                    <div key={c.id} className="bg-[#020b18] border border-slate-800 rounded-xl p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-white">{c.name} ({c.service || 'General'})</h5>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          {c.status || 'new'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{c.message}</p>
                      {c.createdAt && (
                        <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
