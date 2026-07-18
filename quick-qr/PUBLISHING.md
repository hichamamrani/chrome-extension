# Quick QR — Chrome Web Store Publishing Guide

Built by [Algobots](https://algobots.co.uk).

---

## Pre-Launch Checklist

- [x] Manifest V3 with `author` and `homepage_url`
- [x] Extension icons (16, 48, 128 px)
- [x] Algobots backlink in popup footer
- [x] Algobots backlink in context-menu overlay
- [x] Privacy policy template (`privacy-policy.html`)
- [x] Store listing copy (`STORE_LISTING.md`)
- [x] Store screenshots + promo tile (`store-assets/upload/`)
- [x] Landing page template (`website/landing-page.html`)
- [ ] Host privacy policy at `https://algobots.co.uk/privacy/quick-qr`
- [ ] Deploy landing page at `https://algobots.co.uk/tools/quick-qr`
- [ ] Upload assets from `store-assets/upload/` to Chrome Developer Dashboard

---

## 1. Register Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time **$5** registration fee
3. Enable **2-Step Verification** on your Google account

---

## 2. Host Required Pages on Algobots

Upload these to your website:

| Page | URL | File |
|---|---|---|
| Privacy policy | `https://algobots.co.uk/privacy/quick-qr` | `privacy-policy.html` |
| Landing / install page | `https://algobots.co.uk/tools/quick-qr` | Create with install button + screenshots |

The landing page should link to your Chrome Web Store listing once published.

---

## 3. Package the Extension

```bash
cd quick-qr
zip -r ../quick-qr-v1.0.0.zip . -x "*.DS_Store" -x "PUBLISHING.md" -x "privacy-policy.html"
```

> Exclude `PUBLISHING.md` and `privacy-policy.html` from the ZIP — they are for your website, not the extension bundle.

---

## 4. Store Listing Copy

### Name
```
Quick QR
```

### Short description (132 chars max)
```
Instantly generate a QR code for the current tab's URL. Customizable, high-quality, and free.
```

### Detailed description
```
Quick QR instantly creates a scannable QR code for whatever page you're viewing in Chrome.

FEATURES
• Auto-generates QR code when you open the popup
• Shows page favicon, title, and URL
• Copy URL to clipboard
• Download high-resolution PNG (4× scale)
• Customize size, margin, and colors
• Light and dark mode
• Right-click context menu: "Generate QR for this page"
• Keyboard shortcut: Ctrl+Shift+Q (Cmd+Shift+Q on Mac)

PRIVACY FIRST
Quick QR works entirely on your device. Your browsing data is never sent to external servers. Only your theme and QR preferences are saved locally.

Built by Algobots — https://algobots.co.uk
```

### Category
**Productivity**

### Developer website
```
https://algobots.co.uk
```

### Privacy policy URL
```
https://algobots.co.uk/privacy/quick-qr
```

---

## 5. Permission Justifications

Use these in the Chrome Developer Dashboard:

| Permission | Justification |
|---|---|
| `activeTab` | Reads the active tab's URL to generate its QR code when the popup opens. |
| `tabs` | Retrieves the tab title and favicon to display alongside the QR code. |
| `storage` | Saves user preferences locally (theme, QR size, colors, margin). |
| `contextMenus` | Adds "Generate QR for this page" to the browser right-click menu. |
| `<all_urls>` (content script) | Shows an in-page QR overlay as a fallback when the popup cannot open from the context menu. |

---

## 6. Privacy Practices (Dashboard Tab)

Declare the following:

- **Website content** — Used locally to generate QR codes; not transmitted
- **User activity** — Tab URL read only when popup is opened; not stored remotely
- Check **Limited Use** certification

---

## 7. Submit

1. Dashboard → **New item** → upload ZIP
2. Fill all listing fields, upload screenshots + icon
3. Add privacy policy URL and permission justifications
4. Choose **Public** distribution
5. Submit for review (typically 1–3 business days)

---

## 8. After Approval

1. Add the Chrome Web Store install link to `https://algobots.co.uk/tools/quick-qr`
2. Announce on Algobots blog / social channels
3. Bump `version` in `manifest.json` for every future update

---

## Backlink Loop

```
Algobots site  →  Chrome Web Store listing  →  Extension popup  →  Algobots site
     ↑                                                              ↓
     └──────────── landing page with install button ────────────────┘
```
