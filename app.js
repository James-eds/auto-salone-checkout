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
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}
