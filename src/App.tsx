import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuditModal } from './components/AuditModal';
import { HomeView } from './components/views/HomeView';
import { ServicesView } from './components/views/ServicesView';
import { IndustriesView } from './components/views/IndustriesView';
import { AboutView } from './components/views/AboutView';
import { ResourcesView } from './components/views/ResourcesView';
import { ContactView } from './components/views/ContactView';
import { ClientFormsView } from './components/views/ClientFormsView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { fetchStats, verifyAdminSession } from './services/api';
import { FormSubmission, FormType } from './types/database';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [targetFormType, setTargetFormType] = useState<FormType>('contact');
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load database metrics if admin session is active
  const refreshStats = async () => {
    try {
      const isAuth = await verifyAdminSession();
      if (isAuth) {
        const stats = await fetchStats();
        setSubmissionsCount(stats.total);
      }
    } catch {
      // Backend auth required or warming up
    }
  };

  useEffect(() => {
    refreshStats();
  }, [currentTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleNavigate = (tab: string, formType?: string) => {
    if (tab === 'forms-database') {
      if (formType) {
        setCurrentTab('forms');
        setTargetFormType(formType as FormType);
      } else {
        setCurrentTab('admin-dashboard');
      }
    } else if (tab === 'forms') {
      setCurrentTab('forms');
      if (formType) {
        setTargetFormType(formType as FormType);
      }
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionSuccess = (submission: FormSubmission) => {
    showToast(`Request submitted to KILSTA database: ${submission.ref_code}`);
    refreshStats();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0a1430] text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-500/40 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuditModal={() => setAuditModalOpen(true)}
        submissionsCount={submissionsCount}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAuditModal={() => setAuditModalOpen(true)}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView
            onNavigate={handleNavigate}
            onOpenAuditModal={() => setAuditModalOpen(true)}
          />
        )}

        {currentTab === 'industries' && (
          <IndustriesView
            onNavigate={handleNavigate}
            onOpenAuditModal={() => setAuditModalOpen(true)}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenAuditModal={() => setAuditModalOpen(true)}
          />
        )}

        {currentTab === 'resources' && (
          <ResourcesView onNavigate={handleNavigate} />
        )}

        {currentTab === 'forms' && (
          <ClientFormsView
            initialFormType={targetFormType}
            onNavigateToAdmin={() => handleNavigate('admin-dashboard')}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardView
            onNavigateHome={() => handleNavigate('home')}
            onSubmissionsUpdated={(count) => setSubmissionsCount(count)}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView
            onNavigateToDb={() => handleNavigate('admin-dashboard')}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuditModal={() => setAuditModalOpen(true)}
      />

      {/* Global Systems Audit Booking Modal */}
      <AuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        onSuccess={handleSubmissionSuccess}
        onNavigateToDb={() => {
          setAuditModalOpen(false);
          handleNavigate('admin-dashboard');
        }}
      />
    </div>
  );
}
