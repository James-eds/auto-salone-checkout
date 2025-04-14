document.addEventListener("DOMContentLoaded", () => {
  const powerAppFrame = document.getElementById("powerapp-frame");
  const loadingElement = document.getElementById("loading");

  // Function to request fullscreen mode
  function requestFullScreen() {
    const docElement = document.documentElement;

    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
      // Safari & Chrome
      docElement.webkitRequestFullscreen();
    } else if (docElement.mozRequestFullscreen) {
      // Firefox
      docElement.mozRequestFullscreen();
    } else if (docElement.msRequestFullscreen) {
      // IE/Edge
      docElement.msRequestFullscreen();
    }
  }

  // Hide loading indicator once the iframe content is loaded
  powerAppFrame.addEventListener("load", () => {
    setTimeout(() => {
      loadingElement.style.opacity = "0";
      setTimeout(() => {
        loadingElement.style.display = "none";
      }, 500);
    }, 1000);

    // Set up message listener for potential communication from the iframe
    window.addEventListener("message", (event) => {
      // Make sure the message is from the PowerApp domain
      if (event.origin.includes("powerapps.com")) {
        // You could handle messages from the PowerApp here
        console.log("Message from PowerApp:", event.data);
      }
    });
  });

  // Add fullscreen button for iOS (which doesn't support automatic fullscreen)
  const isiOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isiOS) {
    const fullscreenButton = document.createElement("button");
    fullscreenButton.textContent = "Enter Full Screen";
    fullscreenButton.className = "fullscreen-button";
    fullscreenButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
        `;

    document.body.appendChild(fullscreenButton);

    setTimeout(() => {
      fullscreenButton.style.display = "block";
    }, 2000);

    fullscreenButton.addEventListener("click", () => {
      requestFullScreen();
      fullscreenButton.style.display = "none";
    });
  }

  // Handle user interaction to enable fullscreen mode
  document.addEventListener(
    "click",
    () => {
      // Try to request camera permission early
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            // Stop all tracks to release camera immediately
            stream.getTracks().forEach((track) => track.stop());

            // Now that we have camera permission, try for fullscreen
            requestFullScreen();
          })
          .catch((error) => {
            console.log("Camera permission denied or error:", error);
            // Try fullscreen anyway
            requestFullScreen();
          });
      } else {
        requestFullScreen();
      }
    },
    { once: true }
  );

  // Add orientation change handler
  window.addEventListener("orientationchange", () => {
    // Reset fullscreen after orientation changes
    if (document.fullscreenElement) {
      setTimeout(() => {
        document
          .exitFullscreen()
          .then(() => {
            requestFullScreen();
          })
          .catch((err) => console.error(err));
      }, 300);
    }
  });
});
