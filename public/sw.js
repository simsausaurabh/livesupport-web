// LiveSupport Service Worker
// Handles: offline caching, push notifications for new conversations

const CACHE_NAME = 'livesupport-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard/conversations',
  '/offline.html',
];

// ── Install ────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API or socket requests
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io')) return;

  // Network-first for HTML navigation; cache-first for static
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached ?? fetch(request))
  );
});

// ── Push notifications ─────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { return; }

  const { title = 'New message', body = '', url = '/dashboard/conversations' } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'livesupport-message',
      renotify: true,
      data: { url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/dashboard/conversations';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      const existing = clientList.find(c => c.url.includes(url) && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
