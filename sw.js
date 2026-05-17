const CACHE_NAME = 'euromilhoes-webapp-v1';
const ASSETS = [
  'Gestao_Pagamentos_Grupo.html',
  'manifest.json',
  'icon.svg',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === 'GET') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        return caches.match('Gestao_Pagamentos_Grupo.html');
      });
    })
  );
});
