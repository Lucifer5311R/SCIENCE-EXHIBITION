# Science Exhibition Wayfinder PWA

This is an offline-capable Progressive Web App (PWA) for the Science Exhibition navigation.

## Features
-   **Interactive Map**: View the layout of the exhibition.
-   **Dynamic Pathfinding**: Select a stall to see the path from Registration.
-   **Offline Mode**: Works without internet after the first load.
-   **QR Code**: Easily shareable via QR code.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    # or
    cmd /c "npm install"
    ```

2.  Run locally:
    ```bash
    npm run dev
    ```

## Building for Production

To create the offline-ready version:

```bash
npm run build
```

This will generate a `dist` folder containing the static website.

## Generating QR Code

To generate a QR code for your deployed URL (or local network URL):

```bash
node generate-qr.js <YOUR_APP_URL>
```

Example:
```bash
node generate-qr.js https://my-exhibition-map.vercel.app
```
This will save `public/app-qr-code.png` and print the QR code in the terminal.

## Deployment

You can deploy the `dist` folder to any static host:
-   **Vercel** (Recommended): `npx vercel`
-   **Netlify**: Drag and drop `dist` folder.
-   **GitHub Pages**: Push to `gh-pages` branch.
