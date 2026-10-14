/**
 * Wild Mumbai - Sanjay Gandhi National Park (SGNP)
 * Real Offline Map Tile Download Service using the Cache Storage API.
 * 
 * Slippy map tile coordinate math converts lat/lng bounding box coordinates into
 * standard OSM tile addresses (x, y, zoom) and stores them in browser Cache API
 * respecting OpenStreetMap Foundation tile usage policies (rate limiting).
 */

export interface LatLngBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface TileCoordinate {
  z: number;
  x: number;
  y: number;
  url: string;
}

export interface TileCountEstimate {
  tileCount: number;
  estimatedSizeMB: number;
}

export interface MapTilesCacheStatus {
  isCached: boolean;
  tileCount: number;
  estimatedSizeMB: number;
}

// Sanjay Gandhi National Park Geographic Bounding Box (~104 sq km)
export const SGNP_BOUNDS: LatLngBounds = {
  minLat: 19.1415,
  maxLat: 19.2900,
  minLng: 72.8400,
  maxLng: 72.9700,
};

// Target zoom levels for offline exploration (overview to detailed trails)
export const MIN_ZOOM = 12;
export const MAX_ZOOM = 15;

export const TILE_CACHE_NAME = 'wild-mumbai-map-tiles-v1';
export const TILE_URL_TEMPLATE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// State flags for cancellation & abort control
let abortController: AbortController | null = null;
let isCancelled = false;

/**
 * Convert latitude and longitude to Slippy Map tile coordinates at a given zoom level.
 * Formula:
 * x = floor((lng + 180) / 360 * 2^zoom)
 * y = floor((1 - ln(tan(lat*pi/180) + 1/cos(lat*pi/180)) / pi) / 2 * 2^zoom)
 */
export function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

/**
 * Enumerate all tile coordinates for zoom levels minZoom to maxZoom across bounds.
 */
export function getAllTiles(
  minZoom: number = MIN_ZOOM,
  maxZoom: number = MAX_ZOOM,
  bounds: LatLngBounds = SGNP_BOUNDS
): TileCoordinate[] {
  const tiles: TileCoordinate[] = [];

  for (let z = minZoom; z <= maxZoom; z++) {
    // In Slippy maps, maxLat gives lower tile Y, minLat gives higher tile Y
    const nw = latLngToTile(bounds.maxLat, bounds.minLng, z);
    const se = latLngToTile(bounds.minLat, bounds.maxLng, z);

    const minX = Math.min(nw.x, se.x);
    const maxX = Math.max(nw.x, se.x);
    const minY = Math.min(nw.y, se.y);
    const maxY = Math.max(nw.y, se.y);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        tiles.push({
          z,
          x,
          y,
          url: `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
        });
      }
    }
  }

  return tiles;
}

/**
 * Estimates the number of tiles and projected download size in MB for zoom 12-15 over SGNP.
 * Average PNG raster tile size is estimated at ~25 KB.
 */
export function estimateTileCount(
  minZoom: number = MIN_ZOOM,
  maxZoom: number = MAX_ZOOM,
  bounds: LatLngBounds = SGNP_BOUNDS
): TileCountEstimate {
  let count = 0;

  for (let z = minZoom; z <= maxZoom; z++) {
    const nw = latLngToTile(bounds.maxLat, bounds.minLng, z);
    const se = latLngToTile(bounds.minLat, bounds.maxLng, z);

    const minX = Math.min(nw.x, se.x);
    const maxX = Math.max(nw.x, se.x);
    const minY = Math.min(nw.y, se.y);
    const maxY = Math.max(nw.y, se.y);

    count += (maxX - minX + 1) * (maxY - minY + 1);
  }

  // ~25 KB per tile on average
  const estimatedSizeMB = Number(((count * 25) / 1024).toFixed(2));

  return {
    tileCount: count,
    estimatedSizeMB
  };
}

/**
 * Downloads map tiles one by one with a 50ms delay to respect OSM server policies,
 * storing each response into Cache Storage ('wild-mumbai-map-tiles-v1').
 */
export async function downloadMapTiles(
  onProgress?: (downloaded: number, total: number, bytes: number) => void
): Promise<{ tileCount: number; totalBytes: number }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    throw new Error('Cache Storage API is not supported in this environment.');
  }

  isCancelled = false;
  abortController = new AbortController();

  const tiles = getAllTiles();
  const total = tiles.length;
  const cache = await caches.open(TILE_CACHE_NAME);

  let downloaded = 0;
  let totalBytes = 0;

  for (const tile of tiles) {
    if (isCancelled) {
      throw new Error('Tile download cancelled by user.');
    }

    try {
      const response = await fetch(tile.url, {
        signal: abortController.signal,
        headers: {
          'Accept': 'image/png,image/*;q=0.8'
        }
      });

      if (!response.ok) {
        console.warn(`Tile fetch returned ${response.status} for ${tile.url}`);
      } else {
        const blob = await response.blob();
        totalBytes += blob.size;

        // Store into Cache Storage as a fresh Response
        await cache.put(
          tile.url,
          new Response(blob, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          })
        );
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError' || isCancelled) {
        throw new Error('Tile download cancelled by user.');
      }
      console.warn(`Error fetching tile ${tile.url}:`, err);
    }

    downloaded++;
    if (onProgress) {
      onProgress(downloaded, total, totalBytes);
    }

    // 50ms courteous delay between tile downloads to respect OSM server policy
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return { tileCount: downloaded, totalBytes };
}

/**
 * Checks if the 'wild-mumbai-map-tiles-v1' cache exists and counts stored entries.
 */
export async function getMapTilesCacheStatus(): Promise<MapTilesCacheStatus> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { isCached: false, tileCount: 0, estimatedSizeMB: 0 };
  }

  try {
    const cacheNames = await caches.keys();
    if (!cacheNames.includes(TILE_CACHE_NAME)) {
      return { isCached: false, tileCount: 0, estimatedSizeMB: 0 };
    }

    const cache = await caches.open(TILE_CACHE_NAME);
    const requests = await cache.keys();
    const tileCount = requests.length;
    const estimatedSizeMB = Number(((tileCount * 25) / 1024).toFixed(2));

    return {
      isCached: tileCount > 0,
      tileCount,
      estimatedSizeMB
    };
  } catch (err) {
    console.error('Error querying map tiles cache status:', err);
    return { isCached: false, tileCount: 0, estimatedSizeMB: 0 };
  }
}

/**
 * Clears the 'wild-mumbai-map-tiles-v1' cache from Cache Storage.
 */
export async function clearMapTilesCache(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  await caches.delete(TILE_CACHE_NAME);
}

/**
 * Sets cancellation flag and aborts active network fetch if running.
 */
export function cancelDownload(): void {
  isCancelled = true;
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

/**
 * Generates and downloads a self-contained, standalone offline map file directly
 * onto the user's device (phone/PC). Can be opened in any browser with zero internet.
 */
export function downloadOfflineMapFile(
  attractions: Array<{ name: string; category: string; coordinates: [number, number]; [key: string]: any }>,
  emergencyContacts: Array<{ name: string; phone: string; role: string; [key: string]: any }>
): { filename: string; sizeBytes: number } {
  const attractionsJson = JSON.stringify(attractions);
  const emergencyJson = JSON.stringify(emergencyContacts);
  const boundaryJson = JSON.stringify([
    [19.2450, 72.8550], [19.2780, 72.8800], [19.2900, 72.9300], [19.2750, 72.9650],
    [19.2350, 72.9700], [19.1900, 72.9550], [19.1415, 72.9150], [19.1550, 72.8750],
    [19.1950, 72.8600], [19.2285, 72.8584], [19.2450, 72.8550]
  ]);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WILD MUMBAI — Offline Sanjay Gandhi National Park Map</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070c09; color: #f0f7f3; }
    #map { width: 100vw; height: 100vh; background: #0b140f; }
    .header-bar { position: absolute; top: 12px; left: 12px; right: 12px; z-index: 1000; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; pointer-events: none; }
    .header-pill { pointer-events: auto; background: rgba(11, 22, 16, 0.92); backdrop-filter: blur(8px); border: 1px solid #1b3425; padding: 8px 14px; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 8px; }
    .header-title { font-weight: 800; font-size: 14px; letter-spacing: 0.5px; color: #34d399; }
    .btn { pointer-events: auto; background: #059669; hover: background: #10b981; color: white; border: none; padding: 8px 14px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.4); }
    .btn:active { transform: scale(0.96); }
    .btn-sos { background: #dc2626; box-shadow: 0 4px 12px rgba(220,38,38,0.4); }
    .info-card { position: absolute; bottom: 20px; left: 12px; right: 12px; max-width: 420px; z-index: 1000; background: rgba(11, 22, 16, 0.95); backdrop-filter: blur(12px); border: 1px solid #2e5343; border-radius: 20px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); display: none; }
    .info-card.active { display: block; animation: slideUp 0.25s ease-out; }
    @keyframes slideUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .card-close { position: absolute; top: 12px; right: 12px; background: none; border: none; color: #8ca396; font-size: 18px; cursor: pointer; }
    .card-title { font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 4px; }
    .card-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #064e3b; color: #6ee7b7; border: 1px solid #047857; margin-bottom: 8px; }
    .card-desc { font-size: 12px; color: #d1ded7; line-height: 1.5; margin-bottom: 10px; }
    .card-meta { font-size: 11px; color: #8ca396; border-top: 1px solid #1e362b; padding-top: 8px; display: flex; justify-content: space-between; }
    .user-pulse { width: 18px; height: 18px; background: #3b82f6; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 14px #3b82f6; }
    .sos-modal { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; padding: 20px; }
    .sos-modal.active { display: flex; }
    .sos-content { background: #0f1c14; border: 1px solid #dc2626; border-radius: 20px; padding: 20px; max-width: 360px; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>

  <div class="header-bar">
    <div class="header-pill">
      <span style="font-size: 18px;">🌿</span>
      <div>
        <div class="header-title">WILD MUMBAI</div>
        <div style="font-size: 10px; color: #8ca396;">SGNP Standalone Offline Map</div>
      </div>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn" id="locateBtn" onclick="toggleGPS()">
        <span>📍</span> <span id="locateText">Track GPS</span>
      </button>
      <button class="btn btn-sos" onclick="toggleSOS(true)">
        <span>🚨</span> <span>SOS</span>
      </button>
    </div>
  </div>

  <div class="info-card" id="infoCard">
    <button class="card-close" onclick="closeCard()">&times;</button>
    <div class="card-badge" id="cardCategory">ATTRACTION</div>
    <div class="card-title" id="cardTitle">Title</div>
    <div class="card-desc" id="cardDesc">Description</div>
    <div class="card-meta">
      <span id="cardHours">Hours</span>
      <span id="cardFee">Fee</span>
    </div>
  </div>

  <div class="sos-modal" id="sosModal">
    <div class="sos-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="color: #ef4444; font-size: 16px;">SGNP Official Emergency SOS</h3>
        <button onclick="toggleSOS(false)" style="background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer;">&times;</button>
      </div>
      <p style="font-size: 12px; color: #ccc; margin-bottom: 12px;">Use direct phone dialer without internet connection:</p>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <a href="tel:+912228860360" style="display: block; padding: 10px; background: #1c2e22; color: #34d399; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px;">📞 SGNP Control Room: +91 22 2886 0360</a>
        <a href="tel:1926" style="display: block; padding: 10px; background: #1c2e22; color: #34d399; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px;">📞 Maharashtra Forest Helpline: 1926</a>
        <a href="tel:112" style="display: block; padding: 10px; background: #1c2e22; color: #ef4444; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px;">🚨 National Emergency: 112</a>
      </div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const attractions = ${attractionsJson};
    const boundary = ${boundaryJson};

    const map = L.map('map', {
      center: [19.2150, 72.8900],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18
    });

    // Basemap: Clean OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | SGNP'
    }).addTo(map);

    // SGNP Sanctuary Boundary Polygon
    L.polygon(boundary, {
      color: '#10b981',
      weight: 2,
      dashArray: '6, 8',
      fillColor: '#059669',
      fillOpacity: 0.08
    }).addTo(map);

    // Attraction Markers
    const categoryColors = {
      caves: '#f59e0b',
      trails: '#10b981',
      safaris: '#f97316',
      viewpoints: '#8b5cf6',
      facilities: '#06b6d4',
      lakes: '#3b82f6',
      entrances: '#ec4899'
    };

    attractions.forEach(item => {
      const color = categoryColors[item.category] || '#10b981';
      const icon = L.divIcon({
        className: 'custom-pin',
        html: '<div style="width:26px;height:26px;background:' + color + ';border:2px solid #ffffff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.5);font-size:12px;">📍</div>',
        iconSize: [26, 26],
        iconAnchor: [13, 26]
      });

      const m = L.marker(item.coordinates, { icon: icon }).addTo(map);
      m.on('click', () => {
        showCard(item);
        map.panTo(item.coordinates);
      });
      m.bindTooltip(item.name, { direction: 'top', offset: [0, -26] });
    });

    function showCard(item) {
      document.getElementById('cardTitle').innerText = item.name;
      document.getElementById('cardCategory').innerText = (item.category || 'Attraction').toUpperCase();
      document.getElementById('cardDesc').innerText = item.description || '';
      document.getElementById('cardHours').innerText = item.hours || '';
      document.getElementById('cardFee').innerText = item.entryFee || '';
      document.getElementById('infoCard').classList.add('active');
    }

    function closeCard() {
      document.getElementById('infoCard').classList.remove('active');
    }

    function toggleSOS(show) {
      document.getElementById('sosModal').classList.toggle('active', show);
    }

    // Live GPS tracking
    let watchId = null;
    let userMarker = null;

    function toggleGPS() {
      const btn = document.getElementById('locateText');
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        if (userMarker) userMarker.remove();
        btn.innerText = 'Track GPS';
        return;
      }

      if (!('geolocation' in navigator)) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      btn.innerText = 'Locating...';
      watchId = navigator.geolocation.watchPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          btn.innerText = 'GPS Active';
          if (!userMarker) {
            const uIcon = L.divIcon({
              className: 'user-pin',
              html: '<div class="user-pulse"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            });
            userMarker = L.marker([lat, lng], { icon: uIcon }).addTo(map);
            map.setView([lat, lng], 15);
          } else {
            userMarker.setLatLng([lat, lng]);
          }
        },
        err => {
          alert('GPS error: ' + err.message);
          btn.innerText = 'Track GPS';
          watchId = null;
        },
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const filename = 'wild-mumbai-sgnp-offline-map.html';

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);

  return { filename, sizeBytes: blob.size };
}
