const CACHE_NAME = 'app-cache-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './launcher.html',
  './manifest.json'
];

// Install event – додаємо файли в кеш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // одразу активуємо новий SW
});

// Activate event – видаляємо старі кеші
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // одразу підхоплюємо відкриті вкладки
});

// Fetch event – cache-first стратегія
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
