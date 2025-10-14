// firebase-messaging-sw.js
/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBf2IarBF2qPQzlly6G3RUcBCj-QRqdQc4",
  authDomain: "mfl-app-1d2e9.firebaseapp.com",
  databaseURL: "https://mfl-app-1d2e9.firebaseio.com",
  projectId: "mfl-app-1d2e9",
  storageBucket: "mfl-app-1d2e9.firebasestorage.app",
  messagingSenderId: "279758160799",
  appId: "1:279758160799:web:5731135ef7b1acd2ceb3aa",
  measurementId: "G-4YV7LY1M8M"
});

const messaging = firebase.messaging();

// Show notifications when the page is in the background
messaging.onBackgroundMessage((payload) => {
  const title = (payload?.notification?.title) || 'Saifee Sports';
  const options = {
    body: (payload?.notification?.body) || '',
    icon: (payload?.notification?.icon) || '/icon-192.png',
    data: (payload?.fcmOptions?.link) ? { url: payload.fcmOptions.link } : undefined
  };
  self.registration.showNotification(title, options);
});

// Optional: click to focus/open
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
