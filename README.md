# Auto Salone Checkout PWA

This is a Progressive Web App that loads a PowerApps application in a full-screen iframe with camera access enabled.

## Features

- Full-screen display
- Camera access in cross-domain iframe
- Offline capability with service worker
- Installable as a PWA on supported devices
- Works on both iOS and Android

## Setup Instructions

1. Create an `icons` folder and add the required icon images as specified in the manifest.json
2. Deploy the application to a web server that supports HTTPS (required for camera access)
3. Access the application on your mobile device
4. For iOS, use "Add to Home Screen" from Safari's share menu
5. For Android, you'll get a prompt to install the app

## Cross-Domain Camera Access

This application uses the Permissions-Policy header to allow the PowerApps iframe to access the device camera.

## Development

To modify this application, simply edit the files in this directory.
