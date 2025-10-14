// /firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

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

// Ensure clicks open/focus the intended route
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification?.data?.link || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clis => {
      for (const c of clis) {
        if (c.url.startsWith(self.location.origin)) { c.navigate(url); c.focus(); return; }
      }
      return clients.openWindow(url);
    })
  );
});
