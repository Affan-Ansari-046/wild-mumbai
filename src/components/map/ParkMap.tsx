import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ATTRACTIONS_DATA } from '../../data/attractions';
import type { Attraction, AttractionCategory } from '../../types';
import { 
  getCurrentBrowserPosition, 
  calculateDistanceKm, 
  formatCoordinates, 
  getGoogleMapsUrl, 
  getOpenStreetMapUrl 
} from '../../services/geolocationService';
import { toggleSavedPlace, getSavedPlacesIds } from '../../services/offlineStorage';
import { 
  Compass, 
  Navigation, 
  Search, 
  Bookmark, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  X
} from 'lucide-react';

interface ParkMapProps {
  initialSelectedId?: string | null;
  onSelectAttraction?: (attraction: Attraction | null) => void;
  className?: string;
  showFullControls?: boolean;
}

// SGNP Approximate Sanctuary Boundary Coordinates (Basalt ridgeline boundary)
const SGNP_BOUNDARY_COORDS: [number, number][] = [
  [19.2550, 72.8600], // Northwest (Borivali / Dahisar hills)
  [19.2700, 72.8900], // North (Kashimira ridge)
  [19.2600, 72.9300], // Northeast (Nagla block)
  [19.2400, 72.9650], // East (Yeoor hills)
  [19.1950, 72.9550], // Southeast (Mulund / Bhandup hills)
  [19.1450, 72.9150], // South (Vihar lake boundary)
  [19.1550, 72.8800], // Southwest (Aarey buffer)
  [19.2000, 72.8650], // West (Goregaon / Malad forest flank)
  [19.2285, 72.8584], // West gate (Borivali entrance)
  [19.2550, 72.8600]
];

const CATEGORY_COLORS: Record<AttractionCategory, string> = {
  caves: '#f59e0b', // Amber
  trails: '#10b981', // Emerald
  safaris: '#f97316', // Orange
  viewpoints: '#8b5cf6', // Violet
  facilities: '#06b6d4', // Cyan
  lakes: '#3b82f6', // Blue
  entrances: '#ec4899', // Pink
};

export const ParkMap: React.FC<ParkMapProps> = ({
  initialSelectedId,
  onSelectAttraction,
  className = 'h-[600px] w-full',
  showFullControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locatingError, setLocatingError] = useState<string | null>(null);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);
  const [tileLoadError, setTileLoadError] = useState<boolean>(false);

  // Load saved places IDs
  useEffect(() => {
    getSavedPlacesIds().then(setSavedPlaceIds);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on SGNP Central Core (Kanheri / Shilonda area)
    const map = L.map(mapContainerRef.current, {
      center: [19.2150, 72.8900],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap Tile Layer (matches offline Cache API keys)
    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors | SGNP Boundary data'
    });

    tileLayer.on('tileerror', () => {
      setTileLoadError(true);
    });

    tileLayer.addTo(map);

    // Add SGNP Sanctuary Perimeter Boundary Polygon
    const boundaryPolygon = L.polygon(SGNP_BOUNDARY_COORDS, {
      color: '#10b981',
      weight: 2,
      opacity: 0.7,
      dashArray: '6, 8',
      fillColor: '#059669',
      fillOpacity: 0.08
    }).addTo(map);

    boundaryPolygon.bindTooltip('Sanjay Gandhi National Park Reserve Boundary (~104 km²)', {
      sticky: true,
      className: 'bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs px-2 py-1 rounded shadow'
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Markers with Data and Filters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Filter attractions
    const filtered = ATTRACTIONS_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Create markers
    filtered.forEach((item) => {
      const color = CATEGORY_COLORS[item.category] || '#10b981';
      
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(item.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedAttraction(item);
        if (onSelectAttraction) onSelectAttraction(item);
        map.panTo(item.coordinates, { animate: true, duration: 0.6 });
      });

      marker.bindTooltip(item.name, {
        direction: 'top',
        offset: [0, -32],
        className: 'bg-neutral-900 text-neutral-100 border border-neutral-700 text-xs px-2 py-1 rounded shadow-md'
      });

      marker.addTo(map);
      markersRef.current[item.id] = marker;
    });

    // Check if initialSelectedId is provided
    if (initialSelectedId && markersRef.current[initialSelectedId]) {
      const match = ATTRACTIONS_DATA.find((a) => a.id === initialSelectedId);
      if (match) {
        setSelectedAttraction(match);
        map.setView(match.coordinates, 15, { animate: true });
      }
    }
  }, [selectedCategory, searchQuery, initialSelectedId, onSelectAttraction]);

  // Handle GPS Locate Action
  const handleLocateUser = async () => {
    setIsLocating(true);
    setLocatingError(null);
    try {
      const pos = await getCurrentBrowserPosition();
      setUserLocation({
        lat: pos.latitude,
        lng: pos.longitude,
        accuracy: pos.accuracy
      });

      const map = mapInstanceRef.current;
      if (map) {
        // Remove prior user markers
        if (userMarkerRef.current) userMarkerRef.current.remove();
        if (userAccuracyCircleRef.current) userAccuracyCircleRef.current.remove();

        // User Pulse Marker
        const userIcon = L.divIcon({
          className: 'user-gps-pin',
          html: `
            <div style="
              position: relative;
              width: 20px;
              height: 20px;
              background: #3b82f6;
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 15px #3b82f6;
            ">
              <span style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid #60a5fa;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></span>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([pos.latitude, pos.longitude], { icon: userIcon }).addTo(map);
        marker.bindPopup(`<b>Your Detected GPS Position</b><br>${formatCoordinates(pos.latitude, pos.longitude)}<br>Accuracy: ±${pos.accuracy}m`);
        userMarkerRef.current = marker;

        const circle = L.circle([pos.latitude, pos.longitude], {
          radius: pos.accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 1
        }).addTo(map);
        userAccuracyCircleRef.current = circle;

        map.setView([pos.latitude, pos.longitude], 15, { animate: true });
      }
    } catch (err: any) {
      setLocatingError(err.message || 'Unable to retrieve location.');
    } finally {
      setIsLocating(false);
    }
  };

  // Toggle Save Place
  const handleToggleSave = async (id: string) => {
    const isSaved = await toggleSavedPlace(id);
    if (isSaved) {
      setSavedPlaceIds(prev => [...prev, id]);
    } else {
      setSavedPlaceIds(prev => prev.filter(pId => pId !== id));
    }
  };

  // Calculate distance from user to selected attraction if location is available
  const distanceToSelected = (userLocation && selectedAttraction)
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, selectedAttraction.coordinates[0], selectedAttraction.coordinates[1])
    : null;

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden border border-[#1e362b] bg-[#09110d] ${className}`}>
      
      {/* Map Control Bar */}
      {showFullControls && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Search Kanheri, Shilonda, Safaris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#0e1913]/90 backdrop-blur-md border border-[#254636] rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 shadow-lg"
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

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 bg-[#0e1913]/90 backdrop-blur-md border border-[#254636] rounded-xl shadow-lg max-w-full">
            {[
              { id: 'all', label: 'All' },
              { id: 'caves', label: 'Caves' },
              { id: 'trails', label: 'Trails' },
              { id: 'safaris', label: 'Safaris' },
              { id: 'viewpoints', label: 'Vantage' },
              { id: 'lakes', label: 'Lakes' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'entrances', label: 'Gates' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-300 hover:bg-[#183124] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* GPS Locate Button */}
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            title="Locate my position in SGNP"
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-lg transition-all ml-auto"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      )}

      {/* Map Tile Layer Alert if Offline */}
      {tileLoadError && (
        <div className="absolute top-16 left-3 right-3 z-[999] bg-amber-950/90 border border-amber-800 text-amber-200 text-xs px-3 py-2 rounded-xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Map tiles are loading slowly or offline. All vector markers, coordinates, and attraction details remain fully interactive.</span>
          </div>
          <button onClick={() => setTileLoadError(false)} className="text-amber-400 font-bold ml-2">Dismiss</button>
        </div>
      )}

      {/* GPS Location Error Banner */}
      {locatingError && (
        <div className="absolute top-16 left-3 right-3 z-[999] bg-rose-950/90 border border-rose-800 text-rose-200 text-xs px-3 py-2 rounded-xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{locatingError}</span>
          </div>
          <button onClick={() => setLocatingError(null)} className="text-rose-400 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[300px]" />

      {/* Selected Location Bottom Drawer / Card */}
      {selectedAttraction && (
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-[420px] z-[1000] bg-[#0c1611]/95 backdrop-blur-xl border border-[#254636] rounded-2xl shadow-2xl p-4 text-neutral-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[selectedAttraction.category] }}
                />
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  {selectedAttraction.category}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#172c20] text-emerald-300 border border-[#244633]">
                  {selectedAttraction.difficulty}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mt-1">
                {selectedAttraction.name}
              </h3>
              <p className="text-xs text-neutral-400 font-serif">
                {selectedAttraction.marathiName}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedAttraction(null);
                if (onSelectAttraction) onSelectAttraction(null);
              }}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              aria-label="Close attraction details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 line-clamp-2 mb-3">
            {selectedAttraction.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 bg-[#070e0a] p-2.5 rounded-xl border border-[#1b3425] mb-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{selectedAttraction.hours.split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{selectedAttraction.distanceKmFromMainGate} km from gate</span>
            </div>
            {distanceToSelected !== null && (
              <div className="col-span-2 flex items-center gap-1.5 text-emerald-300 font-semibold border-t border-[#1b3425] pt-1 mt-0.5">
                <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{distanceToSelected.toFixed(2)} km from your current GPS position</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleSave(selectedAttraction.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                savedPlaceIds.includes(selectedAttraction.id)
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#152a1e] hover:bg-[#1b3627] text-neutral-200 border-[#2b503c]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedPlaceIds.includes(selectedAttraction.id) ? 'fill-amber-400' : ''}`} />
              {savedPlaceIds.includes(selectedAttraction.id) ? 'Saved' : 'Save Place'}
            </button>

            <a
              href={getGoogleMapsUrl(selectedAttraction.coordinates[0], selectedAttraction.coordinates[1])}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Google Maps
            </a>

            <a
              href={getOpenStreetMapUrl(selectedAttraction.coordinates[0], selectedAttraction.coordinates[1])}
              target="_blank"
              rel="noreferrer"
              title="Open in OpenStreetMap"
              className="p-2 bg-[#152a1e] hover:bg-[#1b3627] text-neutral-200 rounded-xl border border-[#2b503c] transition"
            >
              <span className="text-[10px] font-bold">OSM</span>
            </a>
          </div>
        </div>
      )}

      {/* Legend and Info Overlay */}
      <div className="absolute bottom-2 left-2 z-[990] hidden md:flex items-center gap-3 px-3 py-1.5 bg-[#09120c]/80 backdrop-blur-sm border border-[#1b3225] rounded-xl text-[11px] text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> Caves
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Trails
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316]"></span> Safaris
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span> Viewpoints
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Lakes
        </span>
      </div>
    </div>
  );
};
