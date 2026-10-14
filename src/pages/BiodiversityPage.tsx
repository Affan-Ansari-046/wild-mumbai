import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SPECIES_DATA } from '../data/species';
import { toggleSavedSpecies, getSavedSpeciesIds } from '../services/offlineStorage';
import { 
  Search, 
  Bookmark, 
  Leaf, 
  ChevronRight, 
  BarChart3,
  X,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const BiodiversityPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [endemicOnly, setEndemicOnly] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);

  useEffect(() => {
    getSavedSpeciesIds().then(setSavedIds);
  }, []);

  const handleToggleSave = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = await toggleSavedSpecies(id);
    if (isSaved) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(sId => sId !== id));
    }
  };

  // Filter Logic
  const filteredSpecies = SPECIES_DATA.filter((sp) => {
    const matchesGroup = selectedGroup === 'all' || sp.group === selectedGroup;
    const matchesStatus = selectedStatus === 'all' || sp.iucnStatus === selectedStatus;
    const matchesEndemic = !endemicOnly || sp.isWesternGhatsEndemic;
    const matchesFavorites = !favoritesOnly || savedIds.includes(sp.id);
    const matchesSearch = 
      sp.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.habitat.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGroup && matchesStatus && matchesEndemic && matchesFavorites && matchesSearch;
  });

  // Recharts Data for Taxa Breakdown
  const taxaData = [
    { name: 'Mammals', count: SPECIES_DATA.filter(s => s.group === 'mammals').length, color: '#f59e0b' },
    { name: 'Birds', count: SPECIES_DATA.filter(s => s.group === 'birds').length, color: '#10b981' },
    { name: 'Reptiles', count: SPECIES_DATA.filter(s => s.group === 'reptiles').length, color: '#06b6d4' },
    { name: 'Insects & Amphibians', count: SPECIES_DATA.filter(s => s.group === 'amphibians-insects').length, color: '#8b5cf6' },
    { name: 'Trees & Flora', count: SPECIES_DATA.filter(s => s.group === 'flora').length, color: '#ec4899' },
  ];

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1b3425] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <Leaf className="w-4 h-4" />
              <span>Sanjay Gandhi National Park Biodiversity Database</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
              Flora & Fauna of SGNP
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Documented species verified by the Maharashtra Forest Department and regional botanical institutions. Distinctly marking Western Ghats endemics and urban forest residents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#12241b] hover:bg-[#183224] text-neutral-200 text-xs font-semibold rounded-xl border border-[#244633] transition"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>{showChart ? 'Hide Taxa Chart' : 'View Biodiversity Analytics'}</span>
            </button>

            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                favoritesOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#12241b] text-neutral-200 border-[#244633] hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites ({savedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Optional Recharts Taxa Analytics */}
        {showChart && (
          <div className="p-6 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-xl animate-in fade-in duration-300">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">
              SGNP Taxonomic Representation in Database
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Breakdown across key botanical and zoological classes curated in this guide.
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taxaData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09130d', borderColor: '#244633', borderRadius: '12px' }}
                    labelStyle={{ color: '#34d399', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {taxaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-[#0b1610] p-4 rounded-2xl border border-[#1b3425] shadow-lg flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Search species by common name, scientific name, or Marathi name..."
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

          {/* Group Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Taxa' },
              { id: 'mammals', label: 'Mammals' },
              { id: 'birds', label: 'Birds' },
              { id: 'reptiles', label: 'Reptiles' },
              { id: 'amphibians-insects', label: 'Insects & Amphibians' },
              { id: 'flora', label: 'Flora & Trees' },
            ].map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedGroup === group.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-[#070e0a] text-neutral-300 border border-[#1d3827] hover:bg-[#12241b]'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Endemic Only Toggle */}
          <button
            onClick={() => setEndemicOnly(!endemicOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
              endemicOnly
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-[#070e0a] text-neutral-400 border-[#1d3827] hover:text-white'
            }`}
          >
            Western Ghats Endemics Only
          </button>
        </div>

        {/* Species Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((sp) => {
            const isSaved = savedIds.includes(sp.id);

            return (
              <Link
                key={sp.id}
                to={`/biodiversity/${sp.id}`}
                className="group flex flex-col bg-[#0b1610] rounded-2xl overflow-hidden border border-[#1b3425] hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-950/40 transition duration-300"
              >
                <div className="relative h-56 overflow-hidden bg-neutral-900">
                  <ImageWithFallback
                    src={sp.image}
                    alt={sp.commonName}
                    fallbackTitle={sp.commonName}
                    fallbackSubtitle={sp.scientificName}
                    categoryBadge={sp.group}
                    attribution={sp.imageAttribution}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold text-emerald-300 border border-emerald-500/30">
                      {sp.group}
                    </span>
                    {sp.isWesternGhatsEndemic && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-700">
                        Endemic
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleSave(e, sp.id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition z-10"
                    title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                      {sp.commonName}
                    </div>
                    <div className="text-xs text-neutral-300 italic">
                      {sp.scientificName}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-serif">{sp.marathiName}</span>
                      <span className="px-2 py-0.5 rounded bg-[#13271c] text-emerald-300 text-[10px] font-semibold border border-[#20422f]">
                        {sp.iucnStatus}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {sp.ecologicalRole}
                    </p>

                    {/* Sourced Reference Badge */}
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-[#152a1e]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{sp.verificationStatus}</span>
                      </span>
                      <span>Verified: {sp.lastVerified}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#173021] flex items-center justify-between text-xs text-neutral-400">
                    <span>Role: <strong className="text-emerald-400">{sp.dietCategory}</strong></span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Explore Species <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredSpecies.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0b1610] border border-[#1b3425]">
            <p className="text-neutral-300 text-sm mb-2">No species found matching your current filter criteria.</p>
            <button
              onClick={() => {
                setSelectedGroup('all');
                setSelectedStatus('all');
                setSearchQuery('');
                setEndemicOnly(false);
                setFavoritesOnly(false);
              }}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
