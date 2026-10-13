const cacheName = "CreaJuego-Web-20261013155039";
const contentToCache = [
    "Build/creajuego-web.loader.js",
    "Build/creajuego-web.framework.js.unityweb",
    "Build/creajuego-web.data.unityweb",
    "Build/creajuego-web.wasm.unityweb",
    "TemplateData/style.css",
    "TemplateData/biblored-logo.svg",
    "TemplateData/gino-icon.png"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    self.skipWaiting();
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});


self.addEventListener('activate', function (e) {
    e.waitUntil((async function () {
      const names = await caches.keys();
      await Promise.all(names
        .filter(name => name.startsWith('CreaJuego-Web-') && name !== cacheName)
        .map(name => caches.delete(name)));
      await self.clients.claim();
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      const cache = await caches.open(cacheName);
      let response = await cache.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
