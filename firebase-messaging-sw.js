// /firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

// v9 – bump this string when you deploy
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));


firebase.initializeApp({
  apiKey: "AIzaSyBf2IarBF2qPQzlly6G3RUcBCj-QRqdQc4",
  projectId: "mfl-app-1d2e9",
  messagingSenderId: "279758160799",
  appId: "1:279758160799:web:5731135ef7b1acd2ceb3aa",
});

const messaging = firebase.messaging();

function show(data = {}) {
  const title = data.title || 'Saifee Sports';
  const body  = data.body  || '';
  const icon  = data.icon  || 'https://ss.meemjeem.com/favicon.ico';
  const badge = data.badge || 'https://ss.meemjeem.com/favicon.ico';
  const tag   = data.tag   || '';
  const link  = data.link  || '/';

  return self.registration.showNotification(title, {
    body, icon, badge, tag, data: { link }
  });
}

// 1) Firebase background handler (fires when page not focused)
messaging.onBackgroundMessage(payload => {
  // console.log('[SW] onBackgroundMessage', payload);
  // For v1 data-only, payload.data holds your fields.
  const data = payload?.data || {};
  return show(data);
});

// 2) Low-level push fallback (catches any push the compat layer misses)
self.addEventListener('push', event => {
  // console.log('[SW] push event', event);
  try {
    const json = event.data?.json?.() || {};
    const data = json.data || json.notification || json;
    event.waitUntil(show(data));
  } catch (e) {
    event.waitUntil(show({ title: 'Saifee Sports', body: 'New update' }));
  }
});

self.addEventListener('message', event => {
  const data = event.data || {};
  // Echo back to any open pages so we can see in-page logs
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(c => c.postMessage({ type: 'SW_ECHO', seen: true, data }));
  })());

  if (data.type === 'TEST_SHOW') {
    event.waitUntil((async () => {
      try {
        await self.registration.showNotification(data.title || 'SW OK', {
          body: data.body || 'This came from the service worker.',
          tag:  'sw-test',
          icon: '/favicon.ico',
        });
        // Tell page we displayed it
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clients.forEach(c => c.postMessage({ type: 'SW_SHOWN', ok: true }));
      } catch (err) {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clients.forEach(c => c.postMessage({ type: 'SW_SHOW_ERR', message: String(err) }));
      }
    })());
  }
});

// Optional: make notification clicks open the link if present
self.addEventListener('notificationclick', event => {
  const link = (event.notification && event.notification.data && event.notification.data.link) || '/';
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    const hit = all.find(c => new URL(c.url).pathname === new URL(link, self.location.origin).pathname);
    if (hit) return hit.focus();
    return self.clients.openWindow(link);
  })());
});
