import React from 'react';
import { INDUSTRIES_SERVED } from '../../data/kilstaContent';
import {
  Sprout,
  Palmtree,
  ShoppingBag,
  Building2,
  Anchor,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface IndustriesViewProps {
  onNavigate: (tab: string, formType?: string) => void;
  onOpenAuditModal: () => void;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({ onNavigate, onOpenAuditModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return Sprout;
      case 'Palmtree':
        return Palmtree;
      case 'ShoppingBag':
        return ShoppingBag;
      case 'Building2':
        return Building2;
      case 'Anchor':
        return Anchor;
      default:
        return Building2;
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Deep Local Context
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Industries & Sectors We Serve in Milne Bay
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Operating across an island maritime province requires resilient, solar-capable technology and statutory compliance. Here is how KILSTA solves real sectoral bottlenecks.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="space-y-8">
          {INDUSTRIES_SERVED.map((ind, index) => {
            const Icon = getIcon(ind.iconName);
            const isReversed = index % 2 === 1;

            return (
              <div
                key={ind.id}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs hover:border-blue-200 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Title & Description */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {ind.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ind.description}
                    </p>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                        Milne Bay Sector Focus
                      </div>
                      <p className="text-slate-600">{ind.milneBayExample}</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate('forms-database', 'service_quote')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
                      >
                        <span>Inquire for {ind.title.split(',')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Challenges vs Solutions */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Challenges Box */}
                    <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Common Sector Challenges</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {ind.challenges.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solutions Box */}
                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>KILSTA Custom Solutions</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {ind.solutions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
