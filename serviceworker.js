const CACHE_NAME = "auto-salone-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  "/icons/192.png",
  "/icons/512.png",
  "/favicon.ico", // Add favicon to cache list
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Handle favicon request specifically
  if (event.request.url.includes("favicon.ico")) {
    event.respondWith(
      // Try to return the icon from cache or redirect to our app icon
      caches
        .match("/icons/192.png")
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch("/icons/192.png");
        })
        .catch(() => {
          // Create a simple transparent favicon
          return new Response(
            new Blob(
              [
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==",
              ],
              { type: "image/png" }
            )
          );
        })
    );
    return;
  }

  // Don't cache PowerApps content - this is crucial for camera functionality
  if (event.request.url.includes("apps.powerapps.com")) {
    // Add credentials for cross-origin requests
    return fetch(event.request, {
      credentials: "include",
      mode: "cors",
    }).catch((err) => {
      console.error("Error fetching PowerApps content:", err);
      return fetch(event.request);
    });
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response because it's a one-time use stream
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle message events (useful for communication with the iframe)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Enable navigation preload
self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.navigationPreload.enable());
});
