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

// Show a notification for data-only messages
messaging.onBackgroundMessage(({ data }) => {
  const title = data?.title || 'Saifee Sports';
  const body  = data?.body  || '';
  const icon  = data?.icon  || '/favicon.ico';
  const badge = data?.badge || '/favicon.ico';
  const tag   = data?.tag   || '';
  const link  = data?.link  || '/';
  self.registration.showNotification(title, { body, icon, badge, tag, data: { link } });
});

// Ensure clicks open/focus the app at the intended URL
self.addEventListener('notificationclick', (event) => {
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
