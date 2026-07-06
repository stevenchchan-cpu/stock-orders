// Bumping CACHE_NAME (e.g. to v3, v4...) forces phones to fetch a fresh copy
// next time they have internet, otherwise they keep using the saved copy.
const CACHE_NAME = 'stock-orders-v9'
const FILES_TO_CACHE = ['./', './index.html', './manifest.json', './icon-192b.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: always serve the saved copy instantly. If a file isn't saved yet
// (e.g. a Google Font), fall back to the network, and don't fail if offline.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
