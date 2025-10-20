import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB7PsNygzotWygOyhA7ETcMgxQeuNbmNhw",
  authDomain: "sandy-macram.firebaseapp.com",
  projectId: "sandy-macram",
  storageBucket: "sandy-macram.firebasestorage.app",
  messagingSenderId: "296629723655",
  appId: "1:296629723655:web:4de1fdc6ed619acf5a40a2",
};

const VAPID_KEY =
  "BIehciCsaRK1R00btDy_X7MYQYhWrgK08EeEo5KBxq5NOXlfjVONA4FbobGst-_wzJ6d8kulIZWYgA6AhnFVsM8";

const app = initializeApp(firebaseConfig);

let messaging = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.warn("Messaging not supported in this browser");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No registration token available");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};

export const onMessageListener = (callback) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);

    if (Notification.permission === "granted") {
      const notificationTitle = payload.notification?.title || "إشعار جديد";
      const notificationOptions = {
        body: payload.notification?.body || "",
        icon: payload.notification?.icon || "/logo.png",
        badge: "/logo.png",
        tag: payload.data?.type || "default",
        requireInteraction: true,
      };

      new Notification(notificationTitle, notificationOptions);
    }

    if (callback) callback(payload);
  });
};

export { messaging };
export default app;
