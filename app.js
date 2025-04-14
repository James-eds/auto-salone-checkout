// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// You can add code here to control the iframe if needed
document.addEventListener("DOMContentLoaded", () => {
  // Example: Change iframe source
  // document.getElementById('main-frame').src = 'https://your-desired-url.com';
});
