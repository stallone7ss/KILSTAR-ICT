import React from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ResourcesViewProps {
  onNavigate: (tab: string, formType?: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onNavigate }) => {
  const resources = [
    {
      id: 'ipa-irc-guide',
      title: 'PNG SME IPA & IRC Tax Compliance Guide 2026',
      desc: 'A step-by-step roadmap for Milne Bay entrepreneurs on registering a business name, obtaining an IRC TIN, filing annual returns, and securing a Certificate of Compliance (COC).',
      format: 'PDF Guide (18 Pages)',
      downloads: '180+ downloads',
      category: 'Business & Regulatory',
      badge: 'Most Popular'
    },
    {
      id: 'cyber-handbook',
      title: 'Small Business Cybersecurity & Mobile Money Safety Handbook',
      desc: 'Practical strategies to prevent WhatsApp scams, phishing email attachments, unauthorized internet banking transfers, and ransomware in office environments.',
      format: 'PDF Checklist (12 Pages)',
      downloads: '140+ downloads',
      category: 'ICT & Security',
      badge: 'Essential'
    },
    {
      id: 'hardware-solar-checklist',
      title: 'Milne Bay Hardware, Starlink & Solar Backup Checklist',
      desc: 'Technical specs and recommendations for purchasing ruggedized laptops, solar UPS inverters, and setting up Starlink Wi-Fi for island and rural maritime locations.',
      format: 'PDF Technical Sheet (8 Pages)',
      downloads: '95+ downloads',
      category: 'Infrastructure',
    },
    {
      id: 'excel-cashflow-template',
      title: 'SME Daily Cash Flow & Petty Cash Excel Template',
      desc: 'Pre-formatted, formula-driven Microsoft Excel template for tracking daily retail sales, cash disbursements, and bank deposits with automated end-of-month summaries.',
      format: 'Excel Spreadsheet (.xlsx)',
      downloads: '210+ downloads',
      category: 'Templates',
      badge: 'Free Template'
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Knowledge Center & Downloads
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Business, ICT & Regulatory Guides
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Download practical templates, compliance roadmaps, and cybersecurity checklists prepared specifically for Milne Bay operators.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {res.category}
                  </span>
                  {res.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {res.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{res.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">{res.format} · {res.downloads}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Free Instant Access</span>
                </span>
                <button
                  onClick={() => onNavigate('forms-database', 'newsletter')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download & Register</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Training Calendar Banner */}
        <div className="bg-[#0a1430] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Training Sessions</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Enroll in Upcoming Computer Workshops in Alotau
            </h3>
            <p className="text-xs text-slate-300">
              Weekend and evening cohorts filling up for Microsoft Excel Masterclass and Core Digital Literacy.
            </p>
          </div>

          <button
            onClick={() => onNavigate('forms-database', 'training_registration')}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
          >
            Enroll Candidate in Form Hub
          </button>
        </div>

      </div>
    </div>
  );
};
