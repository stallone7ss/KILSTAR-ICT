import React from 'react';
import { COMPANY_DETAILS } from '../../data/kilstaContent';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Award,
  Users,
  Target,
  ArrowRight,
  Heart
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (tab: string, formType?: string) => void;
  onOpenAuditModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenAuditModal }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            About KILSTA Business & ICT Consultants
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Rooted in Milne Bay. Driven by Excellence.
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bridging the digital divide and enabling commercial formalization for small businesses, cooperatives, schools, and health facilities in Papua New Guinea.
          </p>
        </div>

        {/* Story & Background Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Incorporated {COMPANY_DETAILS.founded} · Alotau, MBP</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Why We Started KILSTA
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For years, entrepreneurs and organizations in Milne Bay Province faced a double barrier: technical IT support was either unavailable locally or prohibitively expensive, requiring consultants to fly in from Port Moresby. At the same time, local SMEs struggled with complex IPA corporate filings and IRC tax procedures, locking them out of tenders and bank finance.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                KILSTA Business & ICT Consultants was founded to provide dependable, affordable, and permanent technical and advisory capacity right in Alotau. We believe every local entrepreneur, cocoa farmer, lodge owner, and school teacher deserves access to reliable technology and clean business records.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-900 text-sm">100% Local Presence</div>
                  <div className="text-slate-500 mt-0.5">On-site in Alotau, quick response across maritime districts.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-900 text-sm">Full Statutory Registration</div>
                  <div className="text-slate-500 mt-0.5">{COMPANY_DETAILS.ipaNumber} · {COMPANY_DETAILS.tinNumber}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#0a1430] to-[#162a5b] text-white p-7 rounded-3xl shadow-xl space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                    alt="KILSTA Official Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-mono text-xs text-teal-300 uppercase tracking-wider font-bold">
                    Official Registered Entity
                  </div>
                  <div className="text-white font-extrabold text-sm">
                    KILSTA Business & ICT
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">IPA Registration Number</div>
                  <div className="font-mono font-bold text-white text-sm">{COMPANY_DETAILS.ipaNumber}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">IRC Tax Identification Number (TIN)</div>
                  <div className="font-mono font-bold text-white text-sm">{COMPANY_DETAILS.tinNumber}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">Principal Office</div>
                  <div className="font-semibold text-white">{COMPANY_DETAILS.address}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">Direct Inquiries Phone</div>
                  <div className="font-semibold text-white">{COMPANY_DETAILS.phone}</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAuditModal}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Schedule Initial Consultation
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Practical & Jargon-Free</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We explain computer systems and tax compliance in clear, understandable language. No confusing acronyms, just solutions that work.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Integrity & Confidentiality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We handle sensitive company financial records, tax disclosures, and student data with strict professional confidentiality.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Community Empowerment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every training session and ICT deployment reinvests skills and resilience back into Milne Bay communities and youth.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
