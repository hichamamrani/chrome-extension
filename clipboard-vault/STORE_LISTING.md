# Clipboard Vault — Complete Chrome Web Store Listing

**Store URL (after publish):** https://chromewebstore.google.com/detail/clipboard-vault/YOUR_EXTENSION_ID

All graphic assets are in **`store-assets/upload/`** — upload these directly to the dashboard.

Regenerate assets anytime from the `clipboard-vault/` folder:

```bash
npm install
npm run generate:assets
```

Upload ZIP from **`release/clipboard-vault-v1.0.1.zip`**.

---

## TAB 1: Store Listing

### Product details

| Field | Value |
|---|---|
| **Title** | Clipboard Vault |
| **Summary** | Automatically save your last copied text snippets. Search, pin favourites, and export — all stored locally. |

### Description *(paste into the Description box)*

```
Clipboard Vault automatically saves text you copy in Chrome — so you never lose an important snippet again.

HOW IT WORKS
1. Copy text on any webpage as you normally would
2. Open Clipboard Vault from your toolbar (or press Ctrl+Shift+V)
3. Search, pin favourites, copy again, or export your history

KEY FEATURES
• Automatically saves copied text in the background
• Keeps your latest 10, 25, 50, or 100 snippets
• Pin favourites — pinned items always stay at the top
• Search your full clipboard history instantly
• Copy again, pin, or delete any item
• Export and import history as JSON
• Right-click → "Save selected text"
• Keyboard shortcut: Ctrl+Shift+V (Cmd+Shift+V on Mac)
• Light, dark, and system themes
• Optional save notifications
• Modern UI with smooth animations

PERFECT FOR
• Developers copying code snippets, URLs, and commands
• Writers and researchers collecting quotes and references
• Anyone who copies the same text repeatedly throughout the day
• Power users who want a lightweight local clipboard manager

PRIVACY FIRST
Everything stays on your device. No account, no cloud sync, no analytics, no data sent to external servers. Your clipboard history is stored locally using Chrome's storage API.

Built by Algobots — https://algobots.co.uk
Privacy policy: https://algobots.co.uk/privacy/clipboard-vault
```

### Category

```
Productivity
```

### Language

```
English
```

---

## Graphic Assets — Upload These Files

| Asset | File to upload | Size |
|---|---|---|
| **Store icon** *(required)* | `store-assets/upload/store-icon-128x128.png` | 128 × 128 px |
| **Screenshot 1** *(required)* | `store-assets/upload/screenshot-1-main.png` | 1280 × 800 px |
| **Screenshot 2** | `store-assets/upload/screenshot-2-favourites.png` | 1280 × 800 px |
| **Screenshot 3** | `store-assets/upload/screenshot-3-settings.png` | 1280 × 800 px |
| **Promo tile** *(optional)* | `store-assets/upload/promo-tile-440x280.png` | 440 × 280 px |

### Screenshot captions (optional)

1. **Your clipboard history, always at hand**
2. **Pin favourites and search instantly**
3. **Customizable settings with dark mode**

---

## TAB 2: Privacy

### Single purpose description

```
Clipboard Vault saves text the user copies in their browser to a local clipboard history on their device. Copied text is captured when the user copies on a webpage or saves selected text via the context menu. No data is transmitted to external servers.
```

### Permission justifications *(paste each one)*

**storage**
```
Required to save the user's clipboard history and settings (history size limit, theme, and notification preference) locally on their device.
```

**contextMenus**
```
Required to add the "Save selected text" option to the browser's right-click context menu.
```

**notifications**
```
Required to show optional notifications when text is saved via the context menu. Users can disable notifications in settings.
```

**scripting**
```
Required to inject the copy listener into already-open browser tabs when the extension is installed or updated.
```

**activeTab**
```
Required to support extension functionality on the user's active browser tab.
```

**Host permission (`http://*/*`, `https://*/*`, `file://*/*`)**
```
Required so the content script can listen for copy events on webpages and automatically save copied text to the user's local history.
```

### Privacy practices — check these boxes

| Data type | Collected? | Purpose | Notes |
|---|---|---|---|
| **Website content** | Yes | App functionality | Copied text captured locally on copy; never transmitted |
| **User activity** | Yes | App functionality | Copy events used to build local history only; not stored remotely |
| **Personally identifiable info** | No | — | — |
| **Health info** | No | — | — |
| **Financial info** | No | — | — |
| **Authentication info** | No | — | — |
| **Personal communications** | No | — | — |
| **Location** | No | — | — |
| **Web history** | No | — | — |

✅ Check **"I certify that my data use complies with the Limited Use policy"**

### Privacy policy URL

```
https://algobots.co.uk/privacy/clipboard-vault
```

> Upload `privacy-policy.html` to your Algobots site at this URL before submitting.

---

## TAB 3: Distribution

| Setting | Value |
|---|---|
| **Visibility** | Public |
| **Regions** | All regions (or restrict as needed) |
| **Pricing** | Free |

---

## Additional Dashboard Fields

| Field | Value |
|---|---|
| **Developer website** | https://algobots.co.uk |
| **Homepage URL** | https://algobots.co.uk/tools/clipboard-vault |
| **Support email/URL** | https://algobots.co.uk |
| **Mature content** | No |

---

## Website Pages to Deploy

| Local file | Deploy to URL |
|---|---|
| `privacy-policy.html` | `https://algobots.co.uk/privacy/clipboard-vault` |
| `website/landing-page.html` | `https://algobots.co.uk/tools/clipboard-vault` |

---

## Submit Checklist

```
[ ] Upload store-icon-128x128.png to Store icon field
[ ] Upload 3 screenshots (1280×800)
[ ] Paste description above
[ ] Set category: Productivity
[ ] Set language: English
[ ] Fill Privacy tab (justifications + policy URL)
[ ] Host privacy-policy.html on algobots.co.uk
[ ] Host landing-page.html on algobots.co.uk/tools/clipboard-vault
[ ] Upload release/clipboard-vault-v1.0.1.zip
[ ] Click Save draft
[ ] Click Submit for review
```

Review typically takes **1–3 business days**.

---

## After Approval

1. Update landing page with Chrome Web Store install link
2. Share store link on Algobots social channels
3. Bump version in `manifest.json` for future updates
