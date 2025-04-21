const CACHE_NAME = "auto-salone-checkout-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icons/192.png",
  "/icons/512.png",
  "/offline.html",
];

// Install service worker and cache all assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the request is for the PowerApps iframe and we're offline
        if (event.request.url.includes("apps.powerapps.com")) {
          return caches.match("/offline.html");
        }

        return caches.match("/");
      });
    })
  );
});
