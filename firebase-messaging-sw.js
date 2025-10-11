// firebase-messaging-sw.js
/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// --- paste your Firebase config here ---
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

// Retrieve messaging
const messaging = firebase.messaging();

// Optional: handle data-only or custom notifications in the background
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Update';
  const body  = payload.notification?.body  || '';
  const link  = payload.fcmOptions?.link || payload.data?.link || '/';
  self.registration.showNotification(title, {
    body,
    data: { link },
  });
});

// Make notification clicks open your link
self.addEventListener('notificationclick', (event) => {
  const url = event.notification?.data?.link || '/';
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
