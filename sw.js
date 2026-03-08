
const CACHE_NAME = 'my-guardian-v20-network-only';

// INSTALL: Force immediate takeover
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ACTIVATE: Delete ALL previous caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        console.log('[SW] Removing old cache', key);
        return caches.delete(key);
      }));
    }).then(() => self.clients.claim())
  );
});

// FETCH: Network Only (Bypass Cache to fix encoding/stale issues)
self.addEventListener('fetch', (event) => {
  // Always go to network
  event.respondWith(fetch(event.request));
});
