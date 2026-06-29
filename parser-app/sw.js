// Service Worker для Парсер розкладу PWA
const CACHE = 'parser-v1';
const STATIC = ['/', '/index.html', '/pwa-install.js', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // API запити — тільки через мережу
  if (e.request.url.includes('/api/')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Інше — кеш з fallback на мережу
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
