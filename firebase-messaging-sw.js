// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBf2IarBF2qPQzlly6G3RUcBCj-QRqdQc4",
  authDomain: "mfl-app-1d2e9.firebaseapp.com",
  projectId: "mfl-app-1d2e9",
  messagingSenderId: "279758160799",
  appId: "1:279758160799:web:5731135ef7b1acd2ceb3aa"
});

const messaging = firebase.messaging();

// Optional: ensure new SW versions take over immediately
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

// ✅ Data-only handler (single toast). If a 'notification' sneaks in, ignore to avoid doubles.
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return; // safety: lets FCM's own toast show, avoids double

  const d = payload.data || {};
  const title = d.title || 'Saifee Sports';
  const body  = d.body  || '';
  const link  = d.link  || '/';
  const icon  = d.icon  || '/favicon.ico';     // or '/favicon.svg' (Chrome shows PNG/SVG best)
  const badge = d.badge || '/icons/icon-192.png';
  const tag   = d.tag   || undefined;               // collapse by event id if provided

  self.registration.showNotification(title, {
    body,
    icon,
    badge,
    tag,
    data: { link },
    renotify: false
  });
});

// Open/focus a tab to the deep link
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rel = (event.notification && event.notification.data && event.notification.data.link) || '/';
  const url = new URL(rel, self.location.origin).href;

  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      try {
        await client.focus();
        if (client.url !== url && 'navigate' in client) await client.navigate(url);
      } catch (_) {}
      return;
    }
    await clients.openWindow(url);
  })());
});
