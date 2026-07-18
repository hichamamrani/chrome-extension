# Quick QR — Complete Chrome Web Store Listing

**Extension ID:** `coaleedekcefgidcagialepfiaeppapij`  
**Store URL (after publish):** https://chromewebstore.google.com/detail/quick-qr/coaleedekcefgidcagialepfiaeppapij

All graphic assets are in **`store-assets/upload/`** — upload these directly to the dashboard.

---

## TAB 1: Store Listing

### Product details (auto-filled from package — do NOT change)

| Field | Value |
|---|---|
| **Title** | Quick QR |
| **Summary** | Instantly generate a QR code for the current tab's URL. Free, fast, and customizable. |

### Description *(paste into the Description box)*

```
Quick QR instantly creates a scannable QR code for whatever page you're viewing in Chrome — with zero setup and zero sign-up.

HOW IT WORKS
1. Click the Quick QR icon in your toolbar (or press Ctrl+Shift+Q)
2. A QR code is generated automatically for the current page
3. Copy the URL, download a high-res PNG, or scan the code with your phone

KEY FEATURES
• Auto-generates QR code when you open the popup
• Shows the page favicon, title, and full URL
• Copy URL to clipboard with one click
• Download high-resolution PNG (4× scale for print quality)
• Customize QR size, margin, foreground and background colors
• Color presets: Black/White, Brand Blue, Inverted
• Light and dark mode with glassmorphism design
• Right-click any page → "Generate QR for this page"
• Keyboard shortcut: Ctrl+Shift+Q (Cmd+Shift+Q on Mac)
• Remembers your last settings locally

PERFECT FOR
• Sharing links in presentations and meetings
• Printing QR codes for events, menus, and signage
• Quickly transferring URLs to your phone
• Developers sharing localhost or staging URLs

PRIVACY FIRST
Quick QR works entirely on your device. Your browsing data is never sent to external servers. Only your theme and QR preferences are saved locally using Chrome's storage API.

Built by Algobots — https://algobots.co.uk
Privacy policy: https://algobots.co.uk/privacy/quick-qr
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
| **Screenshot 2** | `store-assets/upload/screenshot-2-dark-mode.png` | 1280 × 800 px |
| **Screenshot 3** | `store-assets/upload/screenshot-3-options.png` | 1280 × 800 px |
| **Promo tile** *(optional, recommended)* | `store-assets/upload/promo-tile-440x280.png` | 440 × 280 px |

### Screenshot captions (optional, add in dashboard if prompted)

1. **Instant QR codes for any webpage**
2. **Beautiful dark mode support**
3. **Customize size, colors and margin**

---

## TAB 2: Privacy

### Single purpose description

```
Quick QR generates QR codes for the user's current browser tab URL. It reads the active tab's URL, title, and favicon only when the user opens the extension popup or uses the context menu. No data is transmitted to external servers.
```

### Permission justifications *(paste each one)*

**activeTab**
```
Required to read the active tab's URL when the user opens the popup, so a QR code can be generated for the current page.
```

**tabs**
```
Required to retrieve the page title and favicon URL to display alongside the generated QR code in the popup.
```

**storage**
```
Required to save the user's local preferences (theme, QR size, margin, and color settings) so they persist between sessions.
```

**contextMenus**
```
Required to add the "Generate QR for this page" option to the browser's right-click context menu.
```

**Host permission / content script (`<all_urls>`)**
```
Required to inject a fallback QR overlay on the page when the popup cannot be opened programmatically from the context menu click.
```

### Privacy practices — check these boxes

| Data type | Collected? | Purpose | Notes |
|---|---|---|---|
| **Website content** | Yes | App functionality | URL/title read locally only when popup opens; never transmitted |
| **User activity** | Yes | App functionality | Active tab URL read on user action only; not stored remotely |
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
https://algobots.co.uk/privacy/quick-qr
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
| **Homepage URL** | https://algobots.co.uk/tools/quick-qr |
| **Support email/URL** | https://algobots.co.uk (or your support email) |
| **Mature content** | No |

---

## Website Pages to Deploy

Upload these files to your Algobots website:

| Local file | Deploy to URL |
|---|---|
| `privacy-policy.html` | `https://algobots.co.uk/privacy/quick-qr` |
| `website/landing-page.html` | `https://algobots.co.uk/tools/quick-qr` |
| `website/assets/*.png` | Host alongside landing page |

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
[ ] Host landing-page.html on algobots.co.uk/tools/quick-qr
[ ] Click Save draft
[ ] Click Submit for review
```

Review typically takes **1–3 business days**.

---

## After Approval

1. Verify install button works on landing page
2. Share store link: https://chromewebstore.google.com/detail/quick-qr/coaleedekcefgidcagialepfiaeppapij
3. Announce on Algobots social channels
