// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Replace these with same config as src/firebase.js
firebase.initializeApp({
    apiKey: "AIzaSyCi61pDIUtbi7pvnxfFRNIpi8RjTHpFNxs",
    authDomain: "consultant-app-24ceb.firebaseapp.com",
    projectId: "consultant-app-24ceb",
    storageBucket: "consultant-app-24ceb.firebasestorage.app",
    messagingSenderId: "465295888006",
    appId: "1:465295888006:web:ae07e6f6667e0e6f838b07",
    measurementId: "G-9TD9Q1Q0PJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const title = payload.notification?.title || "New message";
    const options = {
        body: payload.notification?.body || "",
        icon: payload.notification?.icon || "/favicon.ico",
        data: payload.data || {}
    };
    self.registration.showNotification(title, options);
});
