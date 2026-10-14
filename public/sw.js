const CACHE_NAME = 'wild-mumbai-v1';
const MAP_TILE_CACHE = 'wild-mumbai-map-tiles-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== MAP_TILE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Map tile requests (CARTO & OSM): check MAP_TILE_CACHE -> fallback to CACHE_NAME -> network
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('basemaps.cartocdn.com')) {
    event.respondWith(
      caches.open(MAP_TILE_CACHE).then((tileCache) => {
        const canonicalUrl = `https://tile.openstreetmap.org${url.pathname}`;
        return tileCache.match(event.request).then((tileResponse) => {
          if (tileResponse) {
            return tileResponse;
          }
          return tileCache.match(canonicalUrl).then((canonicalResponse) => {
            if (canonicalResponse) {
              return canonicalResponse;
            }

          // Fall back to CACHE_NAME
          return caches.open(CACHE_NAME).then((appCache) => {
            return appCache.match(event.request).then((appCacheResponse) => {
              if (appCacheResponse) {
                return appCacheResponse;
              }

              // Fetch from network and cache into MAP_TILE_CACHE
              return fetch(event.request).then((networkResponse) => {
                if (
                  networkResponse &&
                  (networkResponse.status === 200 || networkResponse.type === 'opaque')
                ) {
                  const responseToCache = networkResponse.clone();
                  tileCache.put(event.request, responseToCache);
                }
                return networkResponse;
              });
            });
          });
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for application assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {
            // Network failure: cachedResponse will suffice
          });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache same-origin assets
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          url.origin === self.location.origin
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
