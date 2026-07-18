# Quick QR

A lightweight Chrome Extension (Manifest V3) that instantly generates a QR code for the current tab's URL.

**Built by [Algobots](https://algobots.co.uk)** — booking systems, automation & growth for service businesses.

![Quick QR](icons/icon128.png)

## Features

- **Instant QR generation** — Opens the popup and generates a QR code for the active tab automatically
- **Page metadata** — Shows the website favicon, page title, and full URL
- **High-quality output** — Downloads a 4× resolution PNG for crisp printing
- **Customizable** — Adjust QR size, margin, foreground/background colors, and color presets
- **Light / Dark mode** — Toggle themes with persistent preference
- **Context menu** — Right-click any page → "Generate QR for this page"
- **Keyboard shortcut** — `Ctrl+Shift+Q` (Windows/Linux) or `Cmd+Shift+Q` (macOS)
- **Settings persistence** — Remembers your last-used options via `chrome.storage`

## Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `quick-qr` folder
6. Click the Quick QR icon on any webpage

## Publishing

See **[STORE_LISTING.md](STORE_LISTING.md)** for complete copy-paste store listing content, privacy tab answers, and upload instructions.

See **[PUBLISHING.md](PUBLISHING.md)** for the submission workflow.

### Store assets (ready to upload)

All files in **`store-assets/upload/`**:

| File | Use |
|---|---|
| `store-icon-128x128.png` | Store icon field |
| `screenshot-1-main.png` | Screenshot 1 (required) |
| `screenshot-2-dark-mode.png` | Screenshot 2 |
| `screenshot-3-options.png` | Screenshot 3 |
| `promo-tile-440x280.png` | Promo tile (optional) |

### Website files (deploy to algobots.co.uk)

| Local file | Deploy to |
|---|---|
| `privacy-policy.html` | `https://algobots.co.uk/privacy/quick-qr` |
| `website/landing-page.html` + `website/assets/` | `https://algobots.co.uk/tools/quick-qr` |

## Usage

| Action | How |
|---|---|
| Open popup | Click the toolbar icon or press `Ctrl+Shift+Q` |
| Copy URL | Click **Copy URL** in the popup |
| Download QR | Click **Download** for a high-res PNG |
| Open website | Click **Open Site** to visit the page |
| Refresh QR | Click **Refresh** to re-detect the tab |
| Customize | Expand **Options** to change size, colors, and margin |
| Context menu | Right-click on any page → **Generate QR for this page** |

## Project Structure

```
quick-qr/
├── manifest.json          # Extension manifest (MV3)
├── popup.html             # Popup markup
├── popup.css              # Glassmorphism UI styles
├── popup.js               # Popup logic & QR generation
├── background.js          # Service worker (context menu, shortcuts)
├── content.js             # In-page QR overlay (context menu fallback)
├── lib/
│   └── qrcode.bundle.js   # Bundled QR code library
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── privacy-policy.html    # Host on algobots.co.uk (not bundled in ZIP)
├── PUBLISHING.md          # Chrome Web Store submission guide
└── README.md
```

## Tech Stack

- **Manifest V3** — Latest Chrome extension platform
- **Pure HTML / CSS / JavaScript** — No frameworks
- **Inter font** — Loaded from Google Fonts
- **Lucide icons** — Inline SVG icons
- **[qrcode](https://github.com/soldair/node-qrcode)** — QR code generation library (bundled locally)

## Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Read the current tab's URL, title, and favicon |
| `tabs` | Query active tab information |
| `storage` | Persist user settings (theme, colors, size) |
| `contextMenus` | Add the right-click "Generate QR" menu item |

## Links

- **Algobots**: [algobots.co.uk](https://algobots.co.uk)
- **Extension homepage**: [algobots.co.uk/tools/quick-qr](https://algobots.co.uk/tools/quick-qr)
- **Privacy policy**: [algobots.co.uk/privacy/quick-qr](https://algobots.co.uk/privacy/quick-qr)

## License

MIT — © [Algobots](https://algobots.co.uk)
