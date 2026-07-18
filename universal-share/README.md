# Universal Share

A native mobile-style Share Sheet for Chrome. Share any page to WhatsApp, Telegram, X, LinkedIn, and more.

**Built by [Algobots](https://algobots.co.uk)** — booking systems, automation & growth for service businesses.

![Universal Share](icons/icon128.png)

## Features

- Auto-detects tab URL, title, favicon, and selected text
- 14+ share targets with protocol handler fallbacks
- Pin favourites and recently used apps
- Quick copy actions and QR code generation
- Light / Dark / System themes
- Context menu and `Ctrl+Shift+S` shortcut

## Installation (Developer Mode)

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select this folder

## Publish to Chrome Web Store

```bash
npm install
npm run prepare:store
```

| Output | Location |
|--------|----------|
| Icons | `icons/` |
| Store screenshots | `store-assets/upload/` |
| Upload ZIP | `release/universal-share-v1.0.0.zip` |

See **`PUBLISHING.md`** and **`STORE_LISTING.md`** for full submission guide.

### Deploy to algobots.co.uk

| Local file | URL |
|------------|-----|
| `privacy-policy.html` | `https://algobots.co.uk/privacy/universal-share` |
| `website/landing-page.html` | `https://algobots.co.uk/tools/universal-share` |

## Links

- [algobots.co.uk](https://algobots.co.uk)
- [Extension homepage](https://algobots.co.uk/tools/universal-share)
- [Privacy policy](https://algobots.co.uk/privacy/universal-share)

## License

MIT — © [Algobots](https://algobots.co.uk)
