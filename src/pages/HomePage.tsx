import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  TreePine, 
  Calendar, 
  WifiOff, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Eye,
  Camera,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { SPECIES_DATA } from '../data/species';
import { ATTRACTIONS_DATA } from '../data/attractions';
import { CONSERVATION_STORIES } from '../data/conservationStories';
import { ParkMap } from '../components/map/ParkMap';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const HomePage: React.FC = () => {
  // Get featured wildlife
  const featuredSpecies = SPECIES_DATA.slice(0, 4);
  const featuredAttractions = ATTRACTIONS_DATA.slice(0, 3);
  const mainStory = CONSERVATION_STORIES[0];

  return (
    <div className="min-h-screen bg-[#070c09] text-white">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Forest Image with Layered Shadows */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85')`,
          }}
        >
          {/* Deep dark forest vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070c09] via-[#070c09]/70 to-[#070c09]/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070c09]/60 to-[#070c09]" />
        </div>

        {/* Subtle Atmospheric Mist */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="mist-layer absolute -bottom-20 -left-20 w-[140%] h-[300px] bg-gradient-to-t from-emerald-950/60 to-transparent blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Sanjay Gandhi National Park • Mumbai, India
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-['Cinzel'] leading-[1.1] drop-shadow-2xl">
            Beyond the City. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-lime-400 bg-clip-text text-transparent">
              Into the Wild.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed drop-shadow">
            Explore 104 square kilometers of primeval rainforest, 2,000-year-old Buddhist rock caves, and the world's most remarkable human-leopard coexistence — thriving inside Mumbai's urban heart.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/map"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/40 transition-all text-sm sm:text-base"
            >
              <MapPin className="w-5 h-5 text-emerald-200" />
              <span>Open Interactive Map</span>
            </Link>

            <Link
              to="/planner"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#122319]/90 hover:bg-[#1a3325] active:scale-95 text-neutral-200 hover:text-white font-semibold rounded-2xl border border-[#274836] shadow-lg backdrop-blur-md transition-all text-sm sm:text-base"
            >
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Plan Your Visit</span>
            </Link>

            <Link
              to="/sos"
              className="flex items-center gap-2 px-5 py-3.5 bg-red-950/80 hover:bg-red-900/90 text-red-200 hover:text-white font-bold rounded-2xl border border-red-700/60 shadow-lg backdrop-blur-md transition-all text-sm sm:text-base"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
              <span>SOS / Need Help?</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-400 text-xs pointer-events-none">
          <span className="text-[11px] uppercase tracking-widest text-emerald-500/80 font-semibold">Scroll to Discover</span>
          <div className="w-5 h-8 rounded-full border-2 border-emerald-500/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SGNP FACT CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#13281c]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1d3827] shadow-lg hover:border-emerald-500/50 transition">
            <div className="text-3xl font-extrabold text-emerald-400 font-['Cinzel'] mb-1">
              104 km²
            </div>
            <div className="text-sm font-semibold text-white mb-1">Protected Wilderness</div>
            <div className="text-xs text-neutral-400 leading-snug">
              One of the largest national parks in the world enclosed within city limits.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1d3827] shadow-lg hover:border-emerald-500/50 transition">
            <div className="text-3xl font-extrabold text-emerald-400 font-['Cinzel'] mb-1">
              109 Caves
            </div>
            <div className="text-sm font-semibold text-white mb-1">Ancient Kanheri Complex</div>
            <div className="text-xs text-neutral-400 leading-snug">
              Basalt rock-cut Buddhist chaityas, viharas, and 2,000-year-old rain cisterns.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1d3827] shadow-lg hover:border-emerald-500/50 transition">
            <div className="text-3xl font-extrabold text-emerald-400 font-['Cinzel'] mb-1">
              40+ Leopards
            </div>
            <div className="text-sm font-semibold text-white mb-1">Dense Predator Density</div>
            <div className="text-xs text-neutral-400 leading-snug">
              Coexisting harmoniously through traditional Warli ethics and modern science.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1d3827] shadow-lg hover:border-emerald-500/50 transition">
            <div className="text-3xl font-extrabold text-emerald-400 font-['Cinzel'] mb-1">
              250+ Birds
            </div>
            <div className="text-sm font-semibold text-white mb-1">Western Ghats Endemics</div>
            <div className="text-xs text-neutral-400 leading-snug">
              Malabar whistling thrushes, hornbills, raptors, and vibrant winter migrants.
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE MAP PREVIEW SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <Compass className="w-4 h-4" />
              <span>Real Topographic Map</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-['Cinzel'] text-white">
              Navigate Sanjay Gandhi National Park
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mt-1">
              Live OpenStreetMap vector markers for caves, trails, safari zones, viewpoints, and park facilities with real browser GPS distance calculation.
            </p>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-600 text-white font-semibold text-xs transition border border-emerald-500/40"
          >
            <span>Launch Fullscreen Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Leaflet Map Component Preview */}
        <ParkMap className="h-[480px] w-full shadow-2xl" showFullControls={true} />
      </section>

      {/* 4. FEATURED WILDLIFE & BIODIVERSITY HIGHLIGHTS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#13281c]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <Eye className="w-4 h-4" />
              <span>Ecology & Wildlife</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-['Cinzel'] text-white">
              Denizens of the Canopy & Ravines
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mt-1">
              Verified resident wildlife surveyed by the Maharashtra Forest Department and documented in the Western Ghats bio-corridor.
            </p>
          </div>
          <Link
            to="/biodiversity"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition"
          >
            <span>Explore All Species & Food Web</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpecies.map((sp) => (
            <Link
              key={sp.id}
              to={`/biodiversity/${sp.id}`}
              className="group flex flex-col bg-[#0b1610] rounded-2xl overflow-hidden border border-[#1b3425] hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-950/40 transition duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-neutral-900">
                <ImageWithFallback
                  src={sp.image}
                  alt={sp.commonName}
                  fallbackTitle={sp.commonName}
                  fallbackSubtitle={sp.scientificName}
                  categoryBadge={sp.group}
                  attribution={sp.imageAttribution}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] uppercase font-semibold text-emerald-300 border border-emerald-500/30 z-10">
                  {sp.group}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-[10px] font-semibold text-emerald-300 border border-emerald-800 z-10">
                  {sp.iucnStatus}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {sp.commonName}
                  </h3>
                  <div className="text-xs text-neutral-400 italic mb-2">
                    {sp.scientificName}
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-2">
                    {sp.ecologicalRole}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#162c1f] flex items-center justify-between text-[11px] text-emerald-400">
                  <span>{sp.marathiName}</span>
                  <span className="font-semibold flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TOP ATTRACTIONS PREVIEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#13281c]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <TreePine className="w-4 h-4" />
              <span>Destinations & Trails</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-['Cinzel'] text-white">
              Landmarks & Permitted Trails
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mt-1">
              From 1st-century Buddhist rock carvings to guided rainforest streams.
            </p>
          </div>
          <Link
            to="/attractions"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition"
          >
            <span>View All Attractions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAttractions.map((att) => (
            <div
              key={att.id}
              className="bg-[#0b1610] rounded-2xl overflow-hidden border border-[#1b3425] flex flex-col justify-between shadow-lg"
            >
              <div className="relative h-52 overflow-hidden bg-neutral-900">
                <ImageWithFallback
                  src={att.image}
                  alt={att.name}
                  fallbackTitle={att.name}
                  fallbackSubtitle={att.marathiName}
                  categoryBadge={att.category}
                  attribution={att.imageAttribution}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[11px] font-semibold text-emerald-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30">
                    {att.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {att.name}
                  </h3>
                  <div className="text-xs text-neutral-400 font-serif mb-2">
                    {att.marathiName}
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-3 mb-4">
                    {att.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#183123] pt-3 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Duration:</span>
                    <span className="font-medium text-white">{att.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Difficulty:</span>
                    <span className="font-medium text-emerald-300">{att.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONSERVATION & WARLI COEXISTENCE SPOTLIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#13281c]">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0e1d15] to-[#08120c] border border-[#234533] p-8 md:p-12 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-4">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Indigenous Heritage & Ecology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Cinzel'] text-white mb-4">
              {mainStory.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
              {mainStory.summary}
            </p>
            <div className="p-4 rounded-xl bg-[#060e09]/70 border border-[#1a3826] text-xs italic text-emerald-200/90 mb-6 font-serif">
              "{mainStory.quote.text}" — <span className="font-sans font-semibold text-neutral-300">{mainStory.quote.author}</span>
            </div>
            <Link
              to="/conservation"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition"
            >
              <span>Read Conservation Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. OFFLINE ACCESS EXPLAINER & DOWNLOAD BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#13281c]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 rounded-3xl bg-[#09140e] border border-[#1e392a]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <WifiOff className="w-4 h-4" />
              <span>Offline Forest Readiness</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel'] mb-3">
              No Cellular Coverage in the Ravines? You're Still Protected.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
              Dense basalt canyons behind Kanheri often lose cell reception. Wild Mumbai utilizes browser IndexedDB and Service Workers to store all species guides, emergency numbers, map coordinates, and safety manuals locally on your device.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Vector Coordinates Saved</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Offline Emergency Manuals</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Browser GPS Functions Without Data</span>
            </div>
          </div>

          <Link
            to="/offline"
            className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg border border-emerald-400/40 transition active:scale-95 text-xs sm:text-sm"
          >
            <WifiOff className="w-4 h-4" />
            <span>Open Offline Manager</span>
          </Link>
        </div>
      </section>

    </div>
  );
};
