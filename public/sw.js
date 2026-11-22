// Minimal static app-shell cache for the MilkLink PWA prototype.
// This is not the farmer/collector offline write queue or an API synchronization engine.
const CACHE = 'milklink-app-shell-v2';
const BOOT = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(BOOT)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin || new URL(request.url).pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => { if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put('/index.html',copy));} return response; }).catch(async () => (await caches.match('/index.html')) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && (request.destination === 'script' || request.destination === 'style' || request.destination === 'image')) caches.open(CACHE).then(c=>c.put(request,response.clone()));
    return response;
  })));
});
