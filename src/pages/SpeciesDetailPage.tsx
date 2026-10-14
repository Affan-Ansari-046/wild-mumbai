import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SPECIES_DATA } from '../data/species';
import { toggleSavedSpecies, getSavedSpeciesIds } from '../services/offlineStorage';
import { 
  ArrowLeft, 
  Bookmark, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2, 
  ExternalLink,
  Info
} from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const SpeciesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const species = SPECIES_DATA.find((s) => s.id === id);

  useEffect(() => {
    getSavedSpeciesIds().then(setSavedIds);
  }, []);

  if (!species) {
    return (
      <div className="min-h-screen bg-[#070c09] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">Species Not Found</h2>
        <p className="text-neutral-400 text-sm mb-4">The requested wildlife profile does not exist in our SGNP database.</p>
        <Link to="/biodiversity" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold">
          Return to Biodiversity Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(species.id);

  const handleToggleSave = async () => {
    const saved = await toggleSavedSpecies(species.id);
    if (saved) {
      setSavedIds(prev => [...prev, species.id]);
    } else {
      setSavedIds(prev => prev.filter(sId => sId !== species.id));
    }
  };

  // Find related species in the same ecological group
  const relatedSpecies = SPECIES_DATA.filter(s => s.group === species.group && s.id !== species.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white bg-[#0e1b14] px-3 py-2 rounded-xl border border-[#1e3828] transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Species List</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              isSaved
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[#0e1b14] text-neutral-300 border-[#1e3828] hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isSaved ? 'Saved to Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0c1811] border border-[#203c2b] shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <ImageWithFallback
              src={species.image}
              alt={species.commonName}
              fallbackTitle={species.commonName}
              fallbackSubtitle={species.scientificName}
              categoryBadge={species.group}
              attribution={species.imageAttribution}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1811] via-[#0c1811]/40 to-transparent" />
            
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs uppercase font-bold text-emerald-300 border border-emerald-500/30">
                {species.group}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-xs font-bold text-emerald-300 border border-emerald-700">
                IUCN: {species.iucnStatus}
              </span>
              {species.isWesternGhatsEndemic && (
                <span className="px-3 py-1 rounded-lg bg-blue-950/80 backdrop-blur-md text-xs font-bold text-blue-300 border border-blue-700">
                  Western Ghats Endemic
                </span>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="text-2xl sm:text-4xl font-extrabold text-white font-['Cinzel']">
                {species.commonName}
              </div>
              <div className="text-sm sm:text-base text-neutral-300 italic font-mono mt-1">
                {species.scientificName} • <span className="font-serif not-italic text-emerald-400">{species.marathiName}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-t border-[#183123] bg-[#09140e] text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Ecological Role</span>
              <strong className="text-emerald-300">{species.dietCategory}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Best Season</span>
              <strong className="text-white">{species.bestSeason}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Peak Activity</span>
              <strong className="text-white">{species.bestTime}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Verification</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{species.verificationStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main 2 Cols: Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Identification Features */}
            <div className="p-6 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Identification Keys in the Field</span>
              </h2>
              <ul className="space-y-2.5">
                {species.identificationNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              {species.sizeWeight && (
                <div className="mt-4 pt-3 border-t border-[#183123] text-xs text-neutral-300">
                  <span className="text-neutral-400 font-semibold">Dimensions: </span>
                  {species.sizeWeight}
                </div>
              )}
            </div>

            {/* Habitat & Diet */}
            <div className="p-6 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Habitat & Ecological Niche
              </h2>
              
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase">Micro-Habitat in SGNP</h3>
                <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed">
                  {species.habitat}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase">Diet & Sustenance</h3>
                <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed">
                  {species.diet}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase">Ecosystem Impact</h3>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 leading-relaxed">
                  {species.ecologicalRole}
                </p>
              </div>
            </div>

            {/* Observation Guidance & Ethics */}
            <div className="p-6 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Ethical Field Observation Guidance</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed mb-4">
                {species.observationGuidance}
              </p>
              <div className="p-3.5 rounded-xl bg-[#060e0a] border border-[#1a3325] text-xs text-neutral-300 space-y-1">
                <div className="font-semibold text-emerald-300">Wild Watching Code:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400">
                  <li>Never play audio playback recordings to lure birds or territorial animals.</li>
                  <li>Do not use flash photography directly in the eyes of nocturnal species.</li>
                  <li>Stay inside designated trails to prevent trampling fragile micro-flora.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Right Col: Audio & Related Species */}
          <div className="space-y-6">
            
            {/* Audio Transcript / Vocalization Cue */}
            <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Vocalization & Calls</span>
              </h2>
              <p className="text-xs text-neutral-300 italic font-mono bg-[#060e0a] p-3 rounded-xl border border-[#183123] mb-2 leading-relaxed">
                "{species.audioDescription}"
              </p>
              <span className="text-[10px] text-neutral-400">
                Acoustic cues often disclose presence long before visual sightings in dense bamboo canopy.
              </span>
            </div>

            {/* Source Reference Link */}
            <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Authority & Source</span>
              </h2>
              <div className="text-xs text-white font-semibold mb-1">
                {species.sourceName}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mb-1">
                Status: {species.verificationStatus}
              </div>
              <div className="text-[11px] text-neutral-400 mb-3">
                Last Verified: {species.lastVerified}
              </div>
              <a
                href={species.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09150e] hover:bg-[#0e2216] border border-[#234533] rounded-xl text-xs text-emerald-300 hover:text-white font-semibold transition"
              >
                <span>View Official Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Related Species in Taxa */}
            <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
                Related {species.group}
              </h2>
              <div className="space-y-3">
                {relatedSpecies.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/biodiversity/${rel.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#12241b] transition group"
                  >
                    <img
                      src={rel.image}
                      alt={rel.commonName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                        {rel.commonName}
                      </div>
                      <div className="text-[11px] text-neutral-400 italic">
                        {rel.scientificName}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
