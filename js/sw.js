const CACHE_NAME = 'movium-cache-v1';
const urlsToCache = [
  'index.html',
  'add.html',
  'manifest.json',
  'css/style.css',
  'js/app.js',
  'js/db.js',
  'icons/11.png',
  'icons/22.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
  return cache.addAll(urlsToCache);
      })
      .catch(err => console.warn('Cache gagal:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});
