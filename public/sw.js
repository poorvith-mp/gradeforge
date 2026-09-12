// GradeForge Service Worker
const CACHE_NAME = 'gradeforge-v2.1.0-BUILD_HASH';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/calculator.html',
  '/about.html',
  '/docs.html',
  '/contact.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/logo-mark.svg',
  '/og.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  /* INJECT_PRECACHE_ASSETS */
];

const CANONICAL_FALLBACK = '/calculator.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('GradeForge SW precache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('gradeforge-')) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Cross-origin requests (e.g. fonts.googleapis.com, fonts.gstatic.com) -> network only, never cached
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Navigation requests -> Cache-first with network fallback to canonical root
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return caches.match(CANONICAL_FALLBACK).then((canonical) => {
          if (canonical) return canonical;
          return fetch(event.request).catch(() => caches.match(CANONICAL_FALLBACK));
        });
      }).catch(() => caches.match(CANONICAL_FALLBACK))
    );
    return;
  }

  // 3. Same-origin assets -> Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => null);

      return cached || fetchPromise;
    })
  );
});
