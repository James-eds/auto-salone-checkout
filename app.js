document.addEventListener("DOMContentLoaded", function () {
  const iframe = document.getElementById("main-frame");

  // Ensure iframe has proper sizing (100% viewport height/width)
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  // Add CSS to ensure iframe covers the entire viewport
  const style = document.createElement("style");
  style.textContent = `
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    #main-frame {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Try both filenames to handle both local and Azure environments
    const serviceWorkerFile = "/service-worker.js";

    navigator.serviceWorker
      .register(serviceWorkerFile)
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
        // Try alternative filename as fallback
        navigator.serviceWorker
          .register("/serviceworker.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with alternate name"
            );
          })
          .catch((err) => {
            console.error("Both ServiceWorker registration attempts failed");
          });
      });
  });
}

// Add favicon link to prevent 404
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = "/icons/192.png"; // Use existing icon as favicon
document.head.appendChild(favicon);
