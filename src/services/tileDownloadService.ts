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
