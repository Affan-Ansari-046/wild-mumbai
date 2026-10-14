import React, { useState, useEffect } from 'react';
import { ATTRACTIONS_DATA } from '../data/attractions';
import { toggleSavedPlace, getSavedPlacesIds } from '../services/offlineStorage';
import { 
  Search, 
  Bookmark, 
  Compass, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  X,
  ShieldCheck
} from 'lucide-react';
import { getGoogleMapsUrl, getOpenStreetMapUrl } from '../services/geolocationService';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const AttractionsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  useEffect(() => {
    getSavedPlacesIds().then(setSavedIds);
  }, []);

  const handleToggleSave = async (id: string) => {
    const isSaved = await toggleSavedPlace(id);
    if (isSaved) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const filteredAttractions = ATTRACTIONS_DATA.filter((att) => {
    const matchesCat = selectedCategory === 'all' || att.category === selectedCategory;
    const matchesFav = !favoritesOnly || savedIds.includes(att.id);
    const matchesSearch = 
      att.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesFav && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1b3425] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <Compass className="w-4 h-4" />
              <span>Sanjay Gandhi National Park Landmarks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
              Places & Permitted Attractions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              From the 2,000-year-old rock-cut Kanheri monastery to guided nature trails and high-elevation vistas over Mumbai.
            </p>
          </div>

          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              favoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[#12241b] text-neutral-200 border-[#244633] hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Saved Places ({savedIds.length})</span>
          </button>
        </div>

        {/* Dynamic Disclaimers */}
        <div className="p-4 rounded-2xl bg-[#09150e] border border-[#1c3826] flex items-start gap-3 text-xs text-neutral-300">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>Visiting Advisory:</strong> Kanheri Caves are closed on Mondays. General park gates are open daily from 07:30 AM to 05:30 PM. Wilderness trails (such as Shilonda and Jambhulmal) require mandatory official naturalist guides from the Nature Information Centre (NIC).
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#0b1610] p-4 rounded-2xl border border-[#1b3425] shadow-lg flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Search attractions, trails, caves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#070e0a] border border-[#1e3929] rounded-xl text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'caves', label: 'Caves' },
              { id: 'trails', label: 'Trails' },
              { id: 'safaris', label: 'Safaris' },
              { id: 'viewpoints', label: 'Vantage Points' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'lakes', label: 'Catchment Lakes' },
              { id: 'entrances', label: 'Entrances' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-[#070e0a] text-neutral-300 border border-[#1d3827] hover:bg-[#12241b]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAttractions.map((att) => {
            const isSaved = savedIds.includes(att.id);

            return (
              <div
                key={att.id}
                className="bg-[#0b1610] rounded-3xl overflow-hidden border border-[#1b3425] flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-neutral-900">
                    <ImageWithFallback
                      src={att.image}
                      alt={att.name}
                      fallbackTitle={att.name}
                      fallbackSubtitle={att.marathiName}
                      categoryBadge={att.category}
                      attribution={att.imageAttribution}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                      <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs uppercase font-bold text-emerald-300 border border-emerald-500/30">
                        {att.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-xs font-bold text-emerald-300 border border-emerald-700">
                        {att.operatingStatus}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleSave(att.id)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition z-10"
                      title={isSaved ? 'Remove from saved' : 'Save place'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h2 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel']">
                        {att.name}
                      </h2>
                      <div className="text-xs text-neutral-300 font-serif">
                        {att.marathiName} • {att.distanceKmFromMainGate} km from main gate
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {att.description}
                    </p>

                    {att.history && (
                      <div className="p-3.5 rounded-xl bg-[#070e0a] border border-[#183123] text-xs text-neutral-300">
                        <span className="font-semibold text-emerald-400 block mb-1">Historical Heritage:</span>
                        {att.history}
                      </div>
                    )}

                    {/* Operational Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#070e0a] p-4 rounded-xl border border-[#183123]">
                      <div>
                        <span className="text-neutral-400 block text-[11px] font-semibold">Visiting Hours</span>
                        <span className="text-white font-medium">{att.hours}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px] font-semibold">Estimated Duration</span>
                        <span className="text-emerald-300 font-medium">{att.duration}</span>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-[#14281c]">
                        <span className="text-neutral-400 block text-[11px] font-semibold">Fee Structure</span>
                        <span className="text-neutral-200">{att.entryFee}</span>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-[#14281c]">
                        <span className="text-neutral-400 block text-[11px] font-semibold">Accessibility & Terrain</span>
                        <span className="text-neutral-300 text-[11px]">{att.accessibility}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                        Key Highlights
                      </h3>
                      <ul className="space-y-1.5 text-xs text-neutral-300">
                        {att.highlights.map((hl, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rules */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                        Visitor Regulations
                      </h3>
                      <ul className="space-y-1 text-[11px] text-neutral-400">
                        {att.rules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-400">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Verified Source Citation */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#070e0a] border border-[#173022] text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{att.verificationStatus}</span>
                      </div>
                      <a
                        href={att.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline font-medium"
                      >
                        {att.sourceName} ({att.lastVerified})
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex items-center gap-3">
                  <a
                    href={getGoogleMapsUrl(att.coordinates[0], att.coordinates[1])}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Maps Directions</span>
                  </a>

                  <a
                    href={getOpenStreetMapUrl(att.coordinates[0], att.coordinates[1])}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center py-2.5 px-4 bg-[#12241b] hover:bg-[#183224] text-neutral-200 text-xs font-bold rounded-xl border border-[#244633] transition"
                  >
                    <span>OSM</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
