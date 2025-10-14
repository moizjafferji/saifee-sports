importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBf2IarBF2qPQzlly6G3RUcBCj-QRqdQc4",
  authDomain: "mfl-app-1d2e9.firebaseapp.com",
  projectId: "mfl-app-1d2e9",
  messagingSenderId: "279758160799",
  appId: "1:279758160799:web:5731135ef7b1acd2ceb3aa",
});

const messaging = firebase.messaging();

// Optional: show a custom notification for *data* messages in background.
// (FCM will auto-show for "notification" messages; this won’t double-fire.)
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'Notification';
  const body  = (payload.notification && payload.notification.body)  || (payload.data && payload.data.body)  || '';
  const link  = (payload.data && payload.data.link) || '/';
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    data: { link }
  });
});

// Ensure clicks open your link
self.addEventListener('notificationclick', (event) => {
  const url = (event.notification && event.notification.data && event.notification.data.link) || '/';
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      for (const w of wins) {
        if ('focus' in w) return w.focus();
      }
      return clients.openWindow(url);
    })
  );
});
