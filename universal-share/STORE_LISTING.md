# Universal Share — Complete Chrome Web Store Listing

Regenerate assets: `npm run prepare:store`

Upload ZIP: **`release/universal-share-v1.0.0.zip`**

---

## TAB 1: Store Listing

| Field | Value |
|-------|-------|
| **Title** | Universal Share |
| **Summary** | Native mobile-style Share Sheet for Chrome. Share any page to WhatsApp, Telegram, X, LinkedIn, and more. |

### Description

```
Universal Share brings a native mobile-style Share Sheet to Chrome — share any page instantly, just like on your phone.

HOW IT WORKS
1. Click the Universal Share icon (or press Ctrl+Shift+S)
2. See the current page title, URL, favicon, and selected text
3. Tap any app to share instantly

SHARE TO
• WhatsApp (desktop app or web fallback)
• Telegram (desktop app or web fallback)
• Facebook · Messenger · X (Twitter)
• LinkedIn · Reddit · Pinterest
• Email · SMS
• Copy Link · Copy Selection · QR Code · Open in Browser

KEY FEATURES
• Auto-detects tab URL, title, favicon, and selected text
• Beautiful bottom-sheet popup with search
• Pin favourite apps — they always appear first
• Recently used apps section
• Quick copy: URL, title, Markdown link, HTML link, citation
• QR code generation in popup or new tab
• Protocol handlers with automatic web fallback
• Light, dark, and system themes
• Right-click → Share Page / Share Selection
• Keyboard shortcut: Ctrl+Shift+S (Cmd+Shift+S on Mac)

PRIVACY FIRST
Universal Share reads your active tab only when you open the popup. Nothing is sent to external servers. Settings and preferences are stored locally.

Built by Algobots — https://algobots.co.uk
Privacy policy: https://algobots.co.uk/privacy/universal-share
```

### Category: **Productivity**

---

## Graphic Assets

| Asset | File | Size |
|-------|------|------|
| Store icon | `store-assets/upload/store-icon-128x128.png` | 128×128 |
| Screenshot 1 | `screenshot-1-main.png` | 1280×800 |
| Screenshot 2 | `screenshot-2-dark-mode.png` | 1280×800 |
| Screenshot 3 | `screenshot-3-share-targets.png` | 1280×800 |
| Promo tile | `promo-tile-440x280.png` | 440×280 |

---

## TAB 2: Privacy

### Single purpose
```
Universal Share displays a share sheet for the user's current browser tab, allowing them to share the page URL, title, and selected text to popular platforms. Tab data is read only when the user opens the extension popup or uses the context menu. No data is transmitted to external servers.
```

### Permission justifications

**storage** — Save theme, pinned apps, recent apps, and settings locally.

**tabs** — Read the active tab URL, title, and favicon for the share sheet.

**activeTab** — Access the current tab when the popup opens.

**scripting** — Read selected text from the page for sharing.

**contextMenus** — Add "Share Page" and "Share Selection" to the right-click menu.

**notifications** — Optional notifications after sharing (disable in settings).

**Host permission** — Required to read selected text from webpages via scripting.

### Privacy policy URL
```
https://algobots.co.uk/privacy/universal-share
```

✅ Check **Limited Use** certification

---

## Submit Checklist

```
[ ] Upload release/universal-share-v1.0.0.zip
[ ] Upload store-icon + 3 screenshots
[ ] Paste description above
[ ] Fill Privacy tab
[ ] Host privacy-policy.html on algobots.co.uk
[ ] Host landing-page.html on algobots.co.uk/tools/universal-share
[ ] Submit for review
```
