import React, { useState } from 'react';
import { SERVICES_CATALOG, TRAINING_COURSES, ServiceItem } from '../../data/kilstaContent';
import {
  Briefcase,
  Server,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (tab: string, formType?: string) => void;
  onOpenAuditModal: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onOpenAuditModal }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'business' | 'ict' | 'training'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = SERVICES_CATALOG.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fullDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Solutions Tailored for Papua New Guinea
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Business & ICT Services
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transparent pricing, formal statutory credentials, and dependable on-the-ground execution in Alotau and Milne Bay Province.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 w-full md:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveCategory('business')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'business'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Business & IPA
            </button>
            <button
              onClick={() => setActiveCategory('ict')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'ict'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ICT & Surveillance
            </button>
            <button
              onClick={() => setActiveCategory('training')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'training'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Training Academy
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or topics..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const isTraining = service.category === 'training';
            const isBusiness = service.category === 'business';

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {service.category === 'business'
                        ? 'Business Consulting'
                        : service.category === 'ict'
                        ? 'ICT Systems & Security'
                        : 'Certified ICT Training'}
                    </span>
                    {service.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-extrabold text-slate-900">{service.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{service.fullDesc}</p>

                  {/* Deliverables */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Deliverables
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {service.deliverables.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer specs & CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.estimatedTime}</span>
                    </div>
                    <div className="text-sm font-extrabold text-blue-900">
                      {service.priceEstimate}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isTraining) onNavigate('forms-database', 'training_registration');
                      else if (isBusiness) onNavigate('forms-database', 'sme_advisory');
                      else onNavigate('forms-database', 'service_quote');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Request Quotation / Fill Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Training Courses Deep Dive */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>KILSTA Computer Academy</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Workplace Ready Computer Training Courses
            </h2>
            <p className="text-xs text-slate-600">
              Conducted in Alotau with real workstations, practical exercises, and official completion certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAINING_COURSES.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">{course.level}</span>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.overview}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-[11px] text-slate-700">
                    <div className="font-bold text-slate-500 uppercase tracking-wider">Key Modules:</div>
                    {course.modules.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-600 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{m}</span>
                      </div>
                    ))}
                    {course.modules.length > 3 && (
                      <div className="text-[10px] text-slate-400 italic">
                        +{course.modules.length - 3} additional modules included
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Tuition</div>
                    <div className="font-extrabold text-sm text-slate-900">{course.costPerParticipant}</div>
                  </div>
                  <button
                    onClick={() => onNavigate('forms-database', 'training_registration')}
                    className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
                  >
                    Enroll Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
