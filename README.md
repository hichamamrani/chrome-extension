# Chrome Extensions

A monorepo of Chrome extensions (Manifest V3) built by [Algobots](https://algobots.co.uk).

## Extensions

| Extension | Folder | Description |
|-----------|--------|-------------|
| **Quick QR** | [`quick-qr/`](quick-qr/) | Instantly generate a QR code for the current tab's URL |
| **Clipboard Vault** | [`clipboard-vault/`](clipboard-vault/) | Automatically save and manage your last copied text snippets |
| **Universal Share** | [`universal-share/`](universal-share/) | Native mobile-style Share Sheet for Chrome |

Each extension folder is self-contained with its own manifest, source code, store assets, and publishing docs.

## Getting Started

### Load an extension in Chrome (Developer Mode)

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the extension folder (e.g. `quick-qr/` or `clipboard-vault/`)

### Build store assets (per extension)

```bash
cd quick-qr          # or clipboard-vault
npm install
npm run prepare:store   # clipboard-vault — generates screenshots + ZIP
npm run generate:assets # quick-qr — generates screenshots
```

See each extension's `PUBLISHING.md` and `STORE_LISTING.md` for Chrome Web Store submission.

| Extension | ZIP location |
|-----------|--------------|
| Quick QR | Build manually (see `quick-qr/PUBLISHING.md`) |
| Clipboard Vault | `clipboard-vault/release/clipboard-vault-v1.0.1.zip` |
| Universal Share | `universal-share/release/universal-share-v1.0.0.zip` |

## Repository Structure

```
chrome-extension/
├── .gitignore
├── README.md
├── quick-qr/              # Quick QR extension
├── clipboard-vault/       # Clipboard Vault extension
└── universal-share/       # Universal Share extension
```

## Links

- **Algobots**: [algobots.co.uk](https://algobots.co.uk)

## License

MIT — © [Algobots](https://algobots.co.uk)
