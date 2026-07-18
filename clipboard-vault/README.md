# Clipboard Vault

Automatically save, search, and manage your copied text snippets — stored locally on your device.

**Built by [Algobots](https://algobots.co.uk)** — booking systems, automation & growth for service businesses.

![Clipboard Vault](icons/icon128.png)

## Features

- **Automatic capture** — Saves text whenever you copy on any webpage
- **Smart deduplication** — Ignores consecutive duplicate copies
- **Configurable history** — Keep 10, 25, 50, or 100 items
- **Favourites** — Pin important snippets; they always stay at the top
- **Search** — Filter your clipboard history instantly
- **Export / Import** — Back up and restore your history as JSON
- **Context menu** — Right-click selected text → "Save selected text"
- **Keyboard shortcut** — `Ctrl+Shift+V` (Mac: `Cmd+Shift+V`)
- **Themes** — Light, Dark, or System

## Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this `clipboard-vault` folder
5. Refresh any open tabs, then copy text on a webpage

## Publishing

See **[STORE_LISTING.md](STORE_LISTING.md)** for complete copy-paste store listing content, privacy tab answers, and upload instructions.

See **[PUBLISHING.md](PUBLISHING.md)** for the submission workflow.

### Generate everything for the Chrome Web Store

From this folder:

```bash
npm install
npm run prepare:store
```

### Store assets (ready to upload)

All files in **`store-assets/upload/`**:

| File | Use |
|---|---|
| `store-icon-128x128.png` | Store icon field |
| `screenshot-1-main.png` | Screenshot 1 (required) |
| `screenshot-2-favourites.png` | Screenshot 2 |
| `screenshot-3-settings.png` | Screenshot 3 |
| `promo-tile-440x280.png` | Promo tile (optional) |

### Extension ZIP (ready to upload)

| File | Use |
|---|---|
| `release/clipboard-vault-v1.0.1.zip` | Upload to Chrome Web Store Developer Dashboard |

### Website files (deploy to algobots.co.uk)

| Local file | Deploy to |
|---|---|
| `privacy-policy.html` | `https://algobots.co.uk/privacy/clipboard-vault` |
| `website/landing-page.html` | `https://algobots.co.uk/tools/clipboard-vault` |

## Usage

| Action | How |
|---|---|
| Open popup | Click toolbar icon or press `Ctrl+Shift+V` |
| Search | Type in the search bar |
| Copy again | Click **Copy** on any item |
| Pin / Unpin | Click **Pin** to move to Favourites |
| Delete | Click **Delete** on any item |
| Clear all | Click **Clear All** in the toolbar |
| Export / Import | Use **Export JSON** / **Import JSON** buttons |
| Settings | Click the gear icon or open Extension options |

## Project Structure

```
clipboard-vault/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker — storage, context menu
├── content.js             # Copy event listener on all pages
├── popup.html/css/js      # Popup UI
├── options.html/js        # Settings page
├── icons/                 # Extension icons
├── privacy-policy.html    # Host on algobots.co.uk (not in ZIP)
├── PUBLISHING.md          # Chrome Web Store submission guide
├── STORE_LISTING.md       # Copy-paste store listing content
├── store-assets/
│   ├── generate-screenshots.mjs
│   ├── screenshot-template.html
│   └── upload/            # Generated store assets
├── website/
│   └── landing-page.html  # Deploy to algobots.co.uk
├── scripts/
│   └── package-extension.mjs
└── release/
    └── clipboard-vault-v1.0.1.zip
```

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Save clipboard history and settings locally |
| `contextMenus` | Add "Save selected text" to right-click menu |
| `notifications` | Optional save notifications |
| `scripting` | Inject copy listener into open tabs on install |
| `activeTab` | Support extension on active tab |
| Host permissions | Listen for copy events on webpages |

## Links

- **Algobots**: [algobots.co.uk](https://algobots.co.uk)
- **Extension homepage**: [algobots.co.uk/tools/clipboard-vault](https://algobots.co.uk/tools/clipboard-vault)
- **Privacy policy**: [algobots.co.uk/privacy/clipboard-vault](https://algobots.co.uk/privacy/clipboard-vault)

## License

MIT — © [Algobots](https://algobots.co.uk)
