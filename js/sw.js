const CACHE_NAME = "movium-cache-v1";
const urlsToCache = [
  '/',
  '/index.html',
  '/add.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});