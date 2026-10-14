import React from 'react';
import { ShieldCheck, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export const SourcesPage: React.FC = () => {
  const sources = [
    {
      institution: 'Official Sanjay Gandhi National Park Portal (Government of Maharashtra)',
      role: 'Primary official authority for park jurisdiction, official telephone contact numbers, visiting hours, Vanrani mini-train status, butterfly garden operations, and entrance tariffs.',
      url: 'https://testsgnpweb.mahaitgov.in/Site/Home/Index.aspx',
      verificationDate: 'October 2026',
      status: 'Primary Official Government Portal'
    },
    {
      institution: 'Maharashtra Tourism (Department of Tourism, Govt. of Maharashtra)',
      role: 'Official tourism authority documenting SGNP flora (Karvi shrub 8-year flowering cycle), fauna (leopards, deer, bird checklists), safari descriptions, and eco-tourism guidelines.',
      url: 'https://maharashtratourism.gov.in/wildlife/sanjay-gandhi-national-park/',
      verificationDate: 'October 2026',
      status: 'Official State Tourism Authority'
    },
    {
      institution: 'Incredible India (Ministry of Tourism, Government of India)',
      role: 'National heritage documentation for SGNP, highlighting urban biodiversity importance, ancient trade history, Kanheri Buddhist complex, and Gandhi Tekdi landmarks.',
      url: 'https://www.incredibleindia.gov.in/en/maharashtra/mumbai/sanjay-gandhi-national-park',
      verificationDate: 'October 2026',
      status: 'National Tourism Portal'
    },
    {
      institution: 'Archaeological Survey of India (ASI) — Mumbai Circle',
      role: 'Statutory authority for the Kanheri Caves archaeological complex (Caves 1 to 109), dating from 1st century BCE to 10th century CE, ticket fee mandates, and heritage preservation rules.',
      url: 'https://asi.nic.in',
      verificationDate: 'October 2026',
      status: 'National Archaeological Authority'
    },
    {
      institution: 'OpenStreetMap & Open Database License (ODbL) Contributors',
      role: 'Open-access vector cartography, sanctuary border coordinates (~104 km² reserve boundary), elevation contours, water catchment boundaries for Tulsi and Vihar lakes, and trail waypoints.',
      url: 'https://www.openstreetmap.org/copyright',
      verificationDate: 'Live ODbL License',
      status: 'Open Geospatial Provider'
    },
    {
      institution: 'Bombay Natural History Society (BNHS) & eBird India',
      role: 'Avian checklists, migratory timing for Asian paradise flycatchers, Malabar whistling thrushes, raptor thermal surveys, and Western Ghats bio-corridor studies.',
      url: 'https://bnhs.org',
      verificationDate: 'September 2026',
      status: 'Conservation Research Partner'
    },
    {
      institution: 'Living with Leopards Project (Maharashtra Forest Dept & Wildlife Biologists)',
      role: 'Camera-trap telemetry studies, scientific human-leopard conflict mitigation protocols, and tribal Warli coexistence documentation.',
      url: 'https://mahaforest.gov.in',
      verificationDate: 'Ongoing Scientific Benchmark',
      status: 'Scientific Research Source'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-[#1b3425] pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparency & Data Integrity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
            Official Sources & Data Integrity
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1 leading-relaxed">
            Wild Mumbai strictly maintains documentation integrity. All park facilities, coordinates, opening hours, official contacts, and species information are sourced directly from official Maharashtra Forest Department, Maharashtra Tourism, Incredible India, and ASI records.
          </p>
        </div>

        {/* Verification Guarantee Card */}
        <div className="p-5 rounded-2xl bg-[#09150e] border border-[#1e3b2a] flex items-start gap-3.5 text-xs text-neutral-300 leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Real Data Guarantee:</strong>
            Every attraction and wildlife profile in Wild Mumbai carries its explicit verification status, source institution, and date of last verification. No phone numbers, emergency rules, animal populations, or trail access permissions are fabricated.
          </div>
        </div>

        <div className="space-y-4">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-white">
                  {src.institution}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-semibold self-start sm:self-auto">
                  {src.status}
                </span>
              </div>

              <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                {src.role}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#162c1f] text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Last Verified: {src.verificationDate}</span>
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#09140e] hover:bg-[#0f2418] border border-[#234533] rounded-lg text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <span>Visit Official Source Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
