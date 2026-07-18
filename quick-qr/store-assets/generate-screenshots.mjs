/**
 * Generates Chrome Web Store screenshots (1280×800) and promo tile (440×280).
 * Run: node store-assets/generate-screenshots.mjs
 */
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(__dirname, 'upload');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const shots = [
  { file: 'screenshot-1-main.png', params: 'caption=Instant+QR+codes+for+any+webpage' },
  { file: 'screenshot-2-dark-mode.png', params: 'theme=dark&caption=Beautiful+dark+mode+support' },
  { file: 'screenshot-3-options.png', params: 'options=open&caption=Customize+size%2C+colors+and+margin' },
];

const templatePath = path.join(__dirname, 'screenshot-template.html');

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  for (const shot of shots) {
    const url = `file://${templatePath}?${shot.params}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('#qrCanvas');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(outDir, shot.file), type: 'png' });
    console.log(`✓ ${shot.file}`);
  }

  // Promo tile 440×280 — crop center of main screenshot
  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#qrCanvas');
  const fullBuffer = await page.screenshot({ type: 'png' });
  await page.setViewport({ width: 440, height: 280 });
  await page.setContent(`
    <html><body style="margin:0;background:#eef2ff;">
      <img src="data:image/png;base64,${fullBuffer.toString('base64')}"
           style="width:880px;height:550px;object-fit:cover;object-position:right center;margin-left:-300px;margin-top:-80px;">
    </body></html>
  `);
  await page.screenshot({ path: path.join(outDir, 'promo-tile-440x280.png'), type: 'png' });
  console.log('✓ promo-tile-440x280.png');

  // Copy store icon
  const iconSrc = path.join(root, 'icons', 'icon128.png');
  const iconDst = path.join(outDir, 'store-icon-128x128.png');
  fs.copyFileSync(iconSrc, iconDst);
  console.log('✓ store-icon-128x128.png');

  await browser.close();
  console.log(`\nAll assets saved to: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
