/* Dogo Service Worker — push notifications + offline */
const CACHE = 'dogo-v1';
const OFFLINE_URLS = ['/', '/manifest.json', '/icons/dogo-icon-192.png'];
const CACHEABLE_DESTINATIONS = new Set(['document', 'script', 'style', 'font', 'image', 'manifest']);

const shouldCache = request => (
  request.method === 'GET' &&
  request.url.startsWith(self.location.origin) &&
  CACHEABLE_DESTINATIONS.has(request.destination)
);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
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
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request).then(response => {
      if (response.ok && shouldCache(e.request)) {
        const copy = response.clone();
        e.waitUntil(caches.open(CACHE).then(cache => cache.put(e.request, copy)));
      }
      return response;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('/')))
  );
});

/* ── Push notification handling ── */
self.addEventListener('push', e => {
  if (!e.data) return;
  let data = {};
  try { data = e.data.json(); } catch { data = { title: 'Dogo', body: e.data.text() }; }

  const title = data.title || 'Dogo';
  const options = {
    body: data.body || '',
    icon: '/icons/dogo-icon-192.png',
    badge: '/icons/dogo-icon-96.png',
    dir: 'rtl',
    lang: 'he',
    tag: data.tag || 'dogo',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/LostFound' },
    actions: data.url ? [{ action: 'open', title: 'פתח' }] : [],
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url && c.url.startsWith(self.location.origin));
      if (existing) { existing.focus(); return existing.navigate(url); }
      return self.clients.openWindow(url);
    })
  );
});
