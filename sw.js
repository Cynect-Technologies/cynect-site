// Retirement worker. The app is no longer published on this domain; this unregisters the
// previous service worker and clears its caches so no browser keeps serving the old app.
self.addEventListener('install', (e) => { self.skipWaiting() })
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k)
    await self.registration.unregister()
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url)
  })())
})
