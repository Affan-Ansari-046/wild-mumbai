import React, { useState } from 'react';
import { SAFETY_GUIDES_DATA } from '../data/safetyGuides';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Leaf, 
  Compass, 
  CloudRain, 
  CheckCircle2, 
  XCircle, 
  Info,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SafetyGuidePage: React.FC = () => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(SAFETY_GUIDES_DATA[0].id);
  const activeGuide = SAFETY_GUIDES_DATA.find(g => g.id === selectedGuideId) || SAFETY_GUIDES_DATA[0];

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#1b3425] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Official Safety Protocols</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
              Visitor Safety & Field Manuals
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Field-tested guidelines compiled in collaboration with wildlife biologists and the Maharashtra Forest Department.
            </p>
          </div>

          <Link
            to="/sos"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-amber-200" />
            <span>Open Live SOS Panel</span>
          </Link>
        </div>

        {/* Guide Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SAFETY_GUIDES_DATA.map((guide) => {
            const isSelected = guide.id === activeGuide.id;
            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-[#0b1610] text-neutral-300 border-[#1b3425] hover:bg-[#112419] hover:text-white'
                }`}
              >
                {guide.title.split(':')[0]}
              </button>
            );
          })}
        </div>

        {/* Selected Guide Details */}
        <div className="bg-[#0b1610] rounded-3xl border border-[#1b3425] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-800">
                Category: {activeGuide.category}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel']">
                {activeGuide.title}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#070e0a] p-4 rounded-xl border border-[#183123]">
            {activeGuide.summary}
          </p>

          {/* Action Steps vs Do Not Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Action Steps */}
            <div className="p-5 rounded-2xl bg-[#08120c] border border-emerald-900/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>What You MUST Do</span>
              </h3>
              <ul className="space-y-2 text-xs text-neutral-200">
                {activeGuide.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Do Not Steps */}
            <div className="p-5 rounded-2xl bg-[#140a0a] border border-red-900/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>What You MUST NOT Do</span>
              </h3>
              <ul className="space-y-2 text-xs text-neutral-200">
                {activeGuide.doNotSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Context Footer */}
          <div className="p-4 rounded-xl bg-[#060c08] border border-[#162c1f] text-xs text-neutral-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Ecological Context:</strong> {activeGuide.context}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
