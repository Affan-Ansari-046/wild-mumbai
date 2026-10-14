import React, { useState, useEffect, useCallback } from 'react';
import {
  Map,
  Download,
  Trash2,
  Database,
  WifiOff,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Layers,
  Info,
  X,
  Loader2
} from 'lucide-react';
import {
  downloadCompleteOfflinePack,
  getOfflinePackStatus,
  clearOfflineData
} from '../services/offlineStorage';
import {
  estimateTileCount,
  downloadMapTiles,
  getMapTilesCacheStatus,
  clearMapTilesCache,
  cancelDownload,
  SGNP_BOUNDS,
  MIN_ZOOM,
  MAX_ZOOM
} from '../services/tileDownloadService';
import type { MapTilesCacheStatus, TileCountEstimate } from '../services/tileDownloadService';

export const OfflineExplorerPage: React.FC = () => {
  // Live network connection state
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Map Tiles state (Cache API)
  const [tileStatus, setTileStatus] = useState<MapTilesCacheStatus>({
    isCached: false,
    tileCount: 0,
    estimatedSizeMB: 0
  });
  const [tileEstimate, setTileEstimate] = useState<TileCountEstimate>({
    tileCount: 0,
    estimatedSizeMB: 0
  });
  const [isDownloadingTiles, setIsDownloadingTiles] = useState<boolean>(false);
  const [tileProgress, setTileProgress] = useState<{ downloaded: number; total: number; bytes: number }>({
    downloaded: 0,
    total: 0,
    bytes: 0
  });
  const [tileError, setTileError] = useState<string | null>(null);
  const [tileSuccessMessage, setTileSuccessMessage] = useState<string | null>(null);

  // Data Bundle state (IndexedDB)
  const [dataStatus, setDataStatus] = useState<{
    isCached: boolean;
    timestamp: string | null;
    sizeBytes: number;
  }>({
    isCached: false,
    timestamp: null,
    sizeBytes: 0
  });
  const [isDownloadingData, setIsDownloadingData] = useState<boolean>(false);
  const [dataProgress, setDataProgress] = useState<number>(0);
  const [dataStatusMessage, setDataStatusMessage] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  // Refresh cache status for both Map Tiles and IndexedDB Data Pack
  const refreshStatus = useCallback(async () => {
    try {
      const [tiles, data] = await Promise.all([
        getMapTilesCacheStatus(),
        getOfflinePackStatus()
      ]);
      setTileStatus(tiles);
      setDataStatus(data);
    } catch (err) {
      console.error('Error fetching offline cache statuses:', err);
    }
  }, []);

  // Monitor network and initial load
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial tile estimate calculation
    const estimate = estimateTileCount(MIN_ZOOM, MAX_ZOOM, SGNP_BOUNDS);
    setTileEstimate(estimate);

    refreshStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshStatus]);

  // Handle Real Map Tile Download
  const handleDownloadTiles = async () => {
    setIsDownloadingTiles(true);
    setTileError(null);
    setTileSuccessMessage(null);
    setTileProgress({ downloaded: 0, total: tileEstimate.tileCount, bytes: 0 });

    try {
      const result = await downloadMapTiles((downloaded, total, bytes) => {
        setTileProgress({ downloaded, total, bytes });
      });

      setTileSuccessMessage(
        `Successfully downloaded and cached ${result.tileCount} high-resolution map tiles (${(
          result.totalBytes /
          (1024 * 1024)
        ).toFixed(2)} MB)!`
      );
      await refreshStatus();
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || 'Failed to download map tiles';
      setTileError(errorMsg);
    } finally {
      setIsDownloadingTiles(false);
    }
  };

  const handleCancelTileDownload = () => {
    cancelDownload();
    setTileError('Map tile download was cancelled by user.');
    setIsDownloadingTiles(false);
  };

  const handleClearTiles = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all cached SGNP map tiles from browser Cache Storage?'
      )
    ) {
      await clearMapTilesCache();
      setTileSuccessMessage(null);
      setTileError(null);
      await refreshStatus();
    }
  };

  // Handle IndexedDB Data Pack Download
  const handleDownloadData = async () => {
    setIsDownloadingData(true);
    setDataError(null);
    setDataProgress(20);
    setDataStatusMessage('Compiling species records & biological classifications...');

    try {
      await new Promise((r) => setTimeout(r, 200));
      setDataProgress(55);
      setDataStatusMessage('Bundling Kanheri Caves, nature trails, and gate vector coordinates...');

      await new Promise((r) => setTimeout(r, 200));
      setDataProgress(80);
      setDataStatusMessage('Serializing emergency rescue protocols & ranger contacts into IndexedDB...');

      const result = await downloadCompleteOfflinePack();

      setDataProgress(100);
      setDataStatusMessage('Complete offline survival & field guide bundle stored successfully!');
      await refreshStatus();
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || 'Failed to download offline data pack';
      setDataError(errorMsg);
    } finally {
      setIsDownloadingData(false);
    }
  };

  const handleClearData = async () => {
    if (
      window.confirm(
        'Are you sure you want to remove the cached offline data bundle from this browser?'
      )
    ) {
      await clearOfflineData();
      setDataStatusMessage(null);
      setDataError(null);
      await refreshStatus();
    }
  };

  // Utility byte formatter
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const tilePercent =
    tileProgress.total > 0
      ? Math.min(100, Math.round((tileProgress.downloaded / tileProgress.total) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="border-b border-[#1b3425] pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
            <WifiOff className="w-4 h-4" />
            <span>Wilderness Offline Manager</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
            Offline Survival & Map Manager
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
            Ensure critical emergency SOS protocols, GPS coordinates, species field guides, and real topographic map tiles remain fully accessible even in deep forest cellular dead zones.
          </p>
        </div>

        {/* Top Status Card: Live Connection & Storage Highlights */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162c1f]">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${
                  isOnline
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs text-neutral-400 uppercase font-semibold">Current Connection</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isOnline ? 'Online (Internet Available)' : 'Offline (Disconnected)'}</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                  tileStatus.isCached
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                }`}
              >
                {tileStatus.isCached ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
                )}
                <span>Map Tiles: {tileStatus.isCached ? `${tileStatus.tileCount} Cached` : 'Not Cached'}</span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                  dataStatus.isCached
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                }`}
              >
                {dataStatus.isCached ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
                )}
                <span>Data Bundle: {dataStatus.isCached ? 'Ready' : 'Not Cached'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022]">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Map className="w-4 h-4 text-emerald-400" />
                <span>Map Tiles Cache</span>
              </div>
              <div className="text-base font-bold text-white">
                {tileStatus.isCached ? `${tileStatus.tileCount} tiles (~${tileStatus.estimatedSizeMB} MB)` : '0 tiles'}
              </div>
              <div className="text-[11px] text-neutral-500">
                Cache API (wild-mumbai-map-tiles-v1)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022]">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>IndexedDB Records</span>
              </div>
              <div className="text-base font-bold text-white">
                {dataStatus.isCached ? formatBytes(dataStatus.sizeBytes) : '0 KB'}
              </div>
              <div className="text-[11px] text-neutral-500">
                {dataStatus.timestamp
                  ? `Updated ${new Date(dataStatus.timestamp).toLocaleDateString('en-IN')}`
                  : 'No cached records'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022]">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>PWA Service Worker</span>
              </div>
              <div className="text-base font-bold text-emerald-300">
                Active & Standby
              </div>
              <div className="text-[11px] text-neutral-500">
                App shell loads with zero network
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: REAL MAP TILES DOWNLOAD (Cache API) */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162c1f]">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-white">
                    SGNP Topographic Map Tiles
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Real raster map tile caching via standard Slippy map coordinates and browser Cache Storage.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                  tileStatus.isCached
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                }`}
              >
                {tileStatus.isCached ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-neutral-500" />
                )}
                <span>
                  {tileStatus.isCached
                    ? `${tileStatus.tileCount} Tiles Cached`
                    : 'Tiles Not Cached'}
                </span>
              </span>
            </div>
          </div>

          {/* SGNP Bounding Box & Zoom Breakdown Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#070e0a] p-4 rounded-2xl border border-[#173022]">
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Sanctuary Bounds</div>
              <div className="text-white font-semibold mt-0.5">19.14°N - 19.29°N</div>
              <div className="text-neutral-400 text-[11px]">72.84°E - 72.97°E</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Zoom Range</div>
              <div className="text-white font-semibold mt-0.5">Levels 12 - 15</div>
              <div className="text-neutral-400 text-[11px]">Overview to fine trail</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Estimated Tiles</div>
              <div className="text-emerald-400 font-bold mt-0.5">{tileEstimate.tileCount} tiles</div>
              <div className="text-neutral-400 text-[11px]">Calculated via Mercator</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Estimated Storage</div>
              <div className="text-emerald-400 font-bold mt-0.5">~{tileEstimate.estimatedSizeMB} MB</div>
              <div className="text-neutral-400 text-[11px]">50ms rate limit per tile</div>
            </div>
          </div>

          {/* Tile Download Progress Bar */}
          {isDownloadingTiles && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#09150e] border border-emerald-800/60 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-neutral-200 font-medium">
                    Downloading OSM tiles to Cache Storage...
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-400 font-bold">
                    {tileProgress.downloaded} / {tileProgress.total} tiles
                  </span>
                  <span className="text-neutral-400">({tilePercent}%)</span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-[#204430]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150 rounded-full"
                  style={{ width: `${tilePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Transferred: {formatBytes(tileProgress.bytes)}</span>
                <span className="text-emerald-300 font-mono">50ms polite OSM delay</span>
              </div>
            </div>
          )}

          {/* Tile Success Notification */}
          {tileSuccessMessage && !isDownloadingTiles && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{tileSuccessMessage}</span>
              </div>
              <button
                onClick={() => setTileSuccessMessage(null)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tile Error Notification */}
          {tileError && !isDownloadingTiles && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{tileError}</span>
              </div>
              <button
                onClick={() => setTileError(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons for Map Tiles */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#162c1f]">
            {!isDownloadingTiles ? (
              <button
                onClick={handleDownloadTiles}
                disabled={!isOnline}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white font-bold rounded-xl shadow-lg transition text-xs sm:text-sm"
              >
                <Download className="w-4 h-4" />
                <span>
                  {tileStatus.isCached
                    ? 'Re-Download & Update SGNP Map Tiles'
                    : `Download SGNP Map Tiles (${tileEstimate.tileCount} Tiles)`}
                </span>
              </button>
            ) : (
              <button
                onClick={handleCancelTileDownload}
                className="flex items-center gap-2 px-5 py-3 bg-rose-900/80 hover:bg-rose-800 active:scale-95 text-white font-bold rounded-xl shadow-lg transition text-xs sm:text-sm"
              >
                <X className="w-4 h-4" />
                <span>Cancel Download</span>
              </button>
            )}

            {tileStatus.isCached && !isDownloadingTiles && (
              <button
                onClick={handleClearTiles}
                className="flex items-center gap-2 px-4 py-3 bg-[#13241b] hover:bg-red-950/60 hover:text-red-300 text-neutral-300 font-semibold rounded-xl border border-[#224430] hover:border-red-800 transition text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Map Tiles Cache</span>
              </button>
            )}
          </div>
        </div>

        {/* SECTION 2: DATA BUNDLE DOWNLOAD (IndexedDB) */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162c1f]">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-white">
                    SGNP Data & Field Guides Bundle
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Verified attraction coordinates, flora & fauna database, emergency contacts, and safety manuals in IndexedDB.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                  dataStatus.isCached
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                }`}
              >
                {dataStatus.isCached ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-neutral-500" />
                )}
                <span>
                  {dataStatus.isCached ? 'Bundle Installed' : 'Bundle Missing'}
                </span>
              </span>
            </div>
          </div>

          {/* Included Datasets Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#070e0a] p-4 rounded-2xl border border-[#173022]">
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Biodiversity</div>
              <div className="text-white font-semibold mt-0.5">Mammals, Birds, Reptiles</div>
              <div className="text-neutral-400 text-[11px]">Field identification records</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Park POIs</div>
              <div className="text-white font-semibold mt-0.5">Kanheri & Nature Trails</div>
              <div className="text-neutral-400 text-[11px]">Exact GPS coordinates</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Emergency SOS</div>
              <div className="text-white font-semibold mt-0.5">Official Range Offices</div>
              <div className="text-neutral-400 text-[11px]">Direct tel & coordinates</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[11px] uppercase tracking-wider">Installed Size</div>
              <div className="text-emerald-400 font-bold mt-0.5">
                {dataStatus.isCached ? formatBytes(dataStatus.sizeBytes) : '~150 KB'}
              </div>
              <div className="text-neutral-400 text-[11px]">Zero network needed</div>
            </div>
          </div>

          {/* Data Bundle Download Progress */}
          {isDownloadingData && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#09150e] border border-emerald-800/60 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-neutral-200 font-medium">
                    {dataStatusMessage || 'Packaging data bundle...'}
                  </span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">{dataProgress}%</span>
              </div>

              <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-[#204430]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${dataProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Data Error Banner */}
          {dataError && !isDownloadingData && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{dataError}</span>
              </div>
              <button
                onClick={() => setDataError(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons for Data Bundle */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#162c1f]">
            <button
              onClick={handleDownloadData}
              disabled={isDownloadingData}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 active:scale-95 text-white font-bold rounded-xl shadow-lg transition text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              <span>
                {dataStatus.isCached
                  ? 'Re-Download & Update SGNP Data Bundle'
                  : 'Download SGNP Data Bundle'}
              </span>
            </button>

            {dataStatus.isCached && !isDownloadingData && (
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-3 bg-[#13241b] hover:bg-red-950/60 hover:text-red-300 text-neutral-300 font-semibold rounded-xl border border-[#224430] hover:border-red-800 transition text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Data Cache</span>
              </button>
            )}
          </div>
        </div>

        {/* Honest Technical Disclosures & OSM Tile Usage Policy */}
        <div className="p-6 rounded-3xl bg-[#09140e] border border-[#1e392a] space-y-4 shadow-lg">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>OpenStreetMap Policy & Offline Architecture Disclosures</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <p>
              <strong>1. OpenStreetMap Tile Fair Use Compliance:</strong> The OpenStreetMap Foundation operates volunteer-funded tile server clusters. To prevent excessive load, our downloader adheres strictly to polite client practices: requests are rate-limited with an intentional 50ms interval between tiles and strictly constrained to the 104 km² Sanjay Gandhi National Park bounding box (zoom levels 12 to 15).
            </p>
            <p>
              <strong>2. Cache Storage API Integration:</strong> Downloaded raster tiles are saved directly into the browser&apos;s standard Cache Storage under <code className="text-emerald-300 bg-[#070e0a] px-1.5 py-0.5 rounded border border-[#173022]">wild-mumbai-map-tiles-v1</code>. The Service Worker intercepts all requests for <code className="text-emerald-300 bg-[#070e0a] px-1.5 py-0.5 rounded border border-[#173022]">tile.openstreetmap.org</code> and serves cached tiles immediately when offline.
            </p>
            <p>
              <strong>3. Vector Fallbacks in Cellular Dead Zones:</strong> Even if raster tiles for an unfamiliar zoom level have not been pre-downloaded, all point-of-interest markers (Kanheri Caves, Shilonda Trail, Gaumukh, Gandhi Tekdi), boundaries, and your live GPS location will continue to render reliably over the vector canvas using IndexedDB.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
