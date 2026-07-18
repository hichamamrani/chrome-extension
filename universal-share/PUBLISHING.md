# Universal Share — Chrome Web Store Publishing Guide

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
- [x] Upload ZIP (`release/universal-share-v1.0.0.zip`)
- [ ] Host privacy policy at `https://algobots.co.uk/privacy/universal-share`
- [ ] Deploy landing page at `https://algobots.co.uk/tools/universal-share`

---

## Generate Store Assets & Package

From the `universal-share/` folder:

```bash
npm install
npm run prepare:store
```

| Output | Location |
|--------|----------|
| Icons | `icons/icon16.png`, `icon48.png`, `icon128.png` |
| Screenshots + store icon | `store-assets/upload/` |
| Extension ZIP | `release/universal-share-v1.0.0.zip` |

---

## Submit

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → **New item**
2. Upload `release/universal-share-v1.0.0.zip`
3. Upload assets from `store-assets/upload/`
4. Paste listing copy from `STORE_LISTING.md`
5. Host `privacy-policy.html` at `https://algobots.co.uk/privacy/universal-share`
6. Submit for review (1–3 business days)

---

## Required URLs

| Page | URL |
|------|-----|
| Privacy policy | `https://algobots.co.uk/privacy/universal-share` |
| Landing page | `https://algobots.co.uk/tools/universal-share` |
| Developer website | `https://algobots.co.uk` |
