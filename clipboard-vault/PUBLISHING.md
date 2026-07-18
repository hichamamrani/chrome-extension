# Clipboard Vault — Chrome Web Store Publishing Guide

Built by [Algobots](https://algobots.co.uk).

---

## Pre-Launch Checklist

- [x] Manifest V3 with `author` and `homepage_url`
- [x] Extension icons (16, 48, 128 px)
- [x] Algobots backlink in popup footer
- [x] Algobots backlink in settings page
- [x] Privacy policy template (`privacy-policy.html`)
- [x] Store listing copy (`STORE_LISTING.md`)
- [x] Store screenshots + promo tile (`store-assets/upload/`)
- [x] Landing page template (`website/landing-page.html`)
- [x] Upload ZIP (`release/clipboard-vault-v1.0.1.zip`)
- [ ] Host privacy policy at `https://algobots.co.uk/privacy/clipboard-vault`
- [ ] Deploy landing page at `https://algobots.co.uk/tools/clipboard-vault`
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
| Privacy policy | `https://algobots.co.uk/privacy/clipboard-vault` | `privacy-policy.html` |
| Landing / install page | `https://algobots.co.uk/tools/clipboard-vault` | `website/landing-page.html` |

The landing page should link to your Chrome Web Store listing once published.

---

## 3. Generate Store Assets & Package

From this folder (`clipboard-vault/`):

```bash
npm install
npm run prepare:store
```

This creates:

| Output | Location |
|---|---|
| Store screenshots + icon + promo tile | `store-assets/upload/` |
| Extension ZIP for upload | `release/clipboard-vault-v1.0.1.zip` |

To regenerate only screenshots:

```bash
npm run generate:assets
```

To regenerate only the ZIP:

```bash
npm run package
```

---

## 4. Store Listing Copy

See **`STORE_LISTING.md`** for complete copy-paste content.

### Name
```
Clipboard Vault
```

### Short description (132 chars max)
```
Automatically save your last copied text snippets. Search, pin favourites, and export — all stored locally.
```

### Category
**Productivity**

### Developer website
```
https://algobots.co.uk
```

### Privacy policy URL
```
https://algobots.co.uk/privacy/clipboard-vault
```

---

## 5. Permission Justifications

| Permission | Justification |
|---|---|
| `storage` | Saves clipboard history and user settings locally on the device. |
| `contextMenus` | Adds "Save selected text" to the browser right-click menu. |
| `notifications` | Shows optional notifications when text is saved via the context menu. |
| `scripting` | Injects the copy listener into already-open tabs on install/update. |
| `activeTab` | Supports extension functionality on the active browser tab. |
| Host permissions | Required so the content script can listen for copy events on webpages. |

---

## 6. Privacy Practices (Dashboard Tab)

- **Website content** — Copied text read locally when user copies; not transmitted
- **User activity** — Copy events used to build local history only; not stored remotely
- Check **Limited Use** certification

---

## 7. Submit

1. Dashboard → **New item** → upload `release/clipboard-vault-v1.0.1.zip`
2. Fill all listing fields using `STORE_LISTING.md`
3. Upload screenshots from `store-assets/upload/`
4. Add privacy policy URL and permission justifications
5. Choose **Public** distribution
6. Submit for review (typically 1–3 business days)

---

## 8. After Approval

1. Add the Chrome Web Store install link to `https://algobots.co.uk/tools/clipboard-vault`
2. Announce on Algobots blog / social channels
3. Bump `version` in `manifest.json` for every future update

---

## Backlink Loop

```
Algobots site  →  Chrome Web Store listing  →  Extension popup  →  Algobots site
     ↑                                                              ↓
     └──────────── landing page with install button ────────────────┘
```
