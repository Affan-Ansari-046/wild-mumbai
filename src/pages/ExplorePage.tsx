import React, { useState, useEffect } from 'react';
import { ParkMap } from '../components/map/ParkMap';
import { ATTRACTIONS_DATA } from '../data/attractions';
import type { Attraction } from '../types';
import { getSavedPlacesIds } from '../services/offlineStorage';
import { 
  MapPin, 
  List, 
  Map as MapIcon, 
  Bookmark, 
  Compass, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getGoogleMapsUrl } from '../services/geolocationService';

export const ExplorePage: React.FC = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [filterSavedOnly, setFilterSavedOnly] = useState<boolean>(false);

  useEffect(() => {
    getSavedPlacesIds().then(setSavedIds);
  }, []);

  const displayedAttractions = filterSavedOnly
    ? ATTRACTIONS_DATA.filter(a => savedIds.includes(a.id))
    : ATTRACTIONS_DATA;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#070c09] text-white">
      
      {/* Top Header & Sub-bar */}
      <div className="bg-[#0a140f] border-b border-[#1b3425] px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-emerald-400 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Sanjay Gandhi National Park Interactive Topography</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Verified coordinates for Kanheri Caves, permitted nature trails, water reservoirs, and park checkpoints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Saved Only Toggle */}
            <button
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                filterSavedOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#102217] text-neutral-300 border-[#224430] hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-amber-400' : ''}`} />
              <span>Saved Places ({savedIds.length})</span>
            </button>

            {/* Mobile View Toggle: Map vs List */}
            <div className="md:hidden flex items-center bg-[#102217] p-1 rounded-xl border border-[#224430]">
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  viewMode === 'map' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                }`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Full Leaflet Map */}
        <div className={`flex-1 flex flex-col ${viewMode === 'list' ? 'hidden md:flex' : 'flex'}`}>
          <ParkMap
            initialSelectedId={selectedAttraction?.id}
            onSelectAttraction={setSelectedAttraction}
            className="flex-1 min-h-[550px] w-full shadow-2xl"
          />
        </div>

        {/* Right Side: POI Explorer / Detail Drawer */}
        <div className={`w-full md:w-96 flex flex-col gap-4 ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-[#183424]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Park Locations ({displayedAttractions.length})
            </h2>
            <span className="text-[11px] text-neutral-400">Click to center map</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[600px] pr-1">
            {displayedAttractions.map((att) => {
              const isSelected = selectedAttraction?.id === att.id;
              const isSaved = savedIds.includes(att.id);

              return (
                <div
                  key={att.id}
                  onClick={() => {
                    setSelectedAttraction(att);
                    setViewMode('map');
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#152e20] border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-[#0b1610] border-[#1b3425] hover:bg-[#102419] hover:border-[#2a503a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {att.category}
                        </span>
                        <span className="text-[10px] text-neutral-400">•</span>
                        <span className="text-[10px] text-neutral-300">{att.distanceKmFromMainGate} km from gate</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {att.name}
                      </h3>
                      <div className="text-xs text-neutral-400 font-serif">
                        {att.marathiName}
                      </div>
                    </div>
                    {isSaved && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />}
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 mb-3">
                    {att.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#162c1f] text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Clock className="w-3 h-3" />
                      <span>{att.duration}</span>
                    </span>
                    <span className="flex items-center gap-1 text-neutral-300">
                      <span>{att.difficulty}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
