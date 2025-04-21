document.addEventListener("DOMContentLoaded", () => {
  const powerAppFrame = document.getElementById("powerapp-frame");
  const loadingElement = document.getElementById("loading");

  // Function to request fullscreen mode
  function requestFullScreen() {
    const docElement = document.documentElement;

    // Skip for iOS as it handles fullscreen differently
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      return;
    }

    // Request fullscreen using the appropriate method
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
      docElement.webkitRequestFullscreen();
    } else if (docElement.mozRequestFullscreen) {
      docElement.mozRequestFullscreen();
    } else if (docElement.msRequestFullscreen) {
      docElement.msRequestFullscreen();
    }
  }

  // Add code to verify icon loading
  function checkIconsExist() {
    const iconUrls = ["icons/icon-192x192.png", "icons/icon-512x512.png"];

    iconUrls.forEach((url) => {
      const img = new Image();
      img.onload = () => console.log(`Icon loaded successfully: ${url}`);
      img.onerror = () => console.error(`Failed to load icon: ${url}`);
      img.src = url;
    });
  }

  // Call icon check function
  checkIconsExist();

  // Hide loading indicator once the iframe content is loaded
  powerAppFrame.addEventListener("load", () => {
    setTimeout(() => {
      loadingElement.style.opacity = "0";
      setTimeout(() => (loadingElement.style.display = "none"), 500);
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

  // Handle user interaction to enable fullscreen mode
  document.addEventListener(
    "click",
    () => {
      // Try to request camera permission early
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            requestFullScreen();
          })
          .catch(() => requestFullScreen());
      } else {
        requestFullScreen();
      }
    },
    { once: true }
  );

  // Add orientation change handler
  window.addEventListener("orientationchange", () => {
    if (document.fullscreenElement) {
      setTimeout(() => {
        document
          .exitFullscreen()
          .then(requestFullScreen)
          .catch((err) => console.error(err));
      }, 300);
    }
  });
});
