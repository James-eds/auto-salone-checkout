// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
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

// Handle offline status
window.addEventListener("online", () => {
  document.getElementById("container").classList.remove("offline");
});

window.addEventListener("offline", () => {
  document.getElementById("container").classList.add("offline");
});
