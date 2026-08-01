/**
 * Dogo SW push notification handler — A-OPS-04
 *
 * This file is importScripts()'d by the Workbox-generated sw.js.
 * It handles push events and notification clicks separately from
 * Workbox's precaching/routing logic.
 *
 * Do NOT add caching or routing logic here — that belongs in vite.config.js
 * workbox.runtimeCaching configuration.
 */

/* ── Push notification handling ─────────────────────────────────────────── */
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

/* ── Notification click ──────────────────────────────────────────────────── */
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
