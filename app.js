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

// iOS PWA enhancements
// Prevent touchmove events on iOS to avoid gestures conflicting with iframe
document.addEventListener(
  "touchmove",
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

// Display PWA install prompt for iOS users
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isInStandaloneMode =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone;

// Show iOS install instructions if it's iOS and not already installed
if (isIOS && !isInStandaloneMode) {
  // Wait until the page is fully loaded
  window.addEventListener("load", () => {
    // We'll create and show a hint for iOS users after a short delay
    setTimeout(() => {
      const iosPrompt = document.createElement("div");
      iosPrompt.id = "ios-install-prompt";
      iosPrompt.innerHTML = `
                <div class="ios-prompt-container">
                    <div class="ios-prompt-header">
                        <span>Install this app on your iPhone</span>
                        <button id="close-ios-prompt">×</button>
                    </div>
                    <div class="ios-prompt-body">
                        <p>Tap <strong>Share</strong> <span class="share-icon">↑</span> then <strong>Add to Home Screen</strong> to install</p>
                    </div>
                </div>
            `;
      document.body.appendChild(iosPrompt);

      // Style the iOS prompt with standard Safari-like styling
      const style = document.createElement("style");
      style.innerHTML = `
                #ios-install-prompt {
                    position: fixed;
                    bottom: 20px;
                    left: 10px;
                    right: 10px;
                    background: rgba(248, 248, 248, 0.95);
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }
                .ios-prompt-container {
                    padding: 15px;
                }
                .ios-prompt-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .ios-prompt-header span {
                    font-weight: 600;
                    font-size: 16px;
                    color: #000000;
                }
                #close-ios-prompt {
                    background: none;
                    border: none;
                    font-size: 22px;
                    color: #8E8E93;
                    cursor: pointer;
                }
                .ios-prompt-body {
                    font-size: 14px;
                    color: #000000;
                }
                .share-icon {
                    display: inline-block;
                    margin: 0 5px;
                }
            `;
      document.head.appendChild(style);

      // Handle close button
      document
        .getElementById("close-ios-prompt")
        .addEventListener("click", () => {
          document.getElementById("ios-install-prompt").style.display = "none";
          // Remember this choice in session storage
          sessionStorage.setItem("ios-prompt-closed", "true");
        });

      // Don't show if user previously closed the prompt
      if (sessionStorage.getItem("ios-prompt-closed") === "true") {
        document.getElementById("ios-install-prompt").style.display = "none";
      }
    }, 2000);
  });
}
