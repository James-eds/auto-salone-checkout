const CACHE_NAME = "auto-salone-checkout-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./app.js",
  "./styles.css",
  "./manifest.json",
  "./icons/192.png",
  "./icons/512.png",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
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

// Fetch event - serve from cache first, then network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request.clone()).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
        });

        return response;
      });
    })
  );
});
