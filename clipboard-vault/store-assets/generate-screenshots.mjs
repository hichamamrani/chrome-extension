/**
 * Generates Chrome Web Store screenshots (1280×800) and promo tile (440×280).
 * Run: npm run generate:assets
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
  {
    file: 'screenshot-1-main.png',
    params: 'caption=Your+clipboard+history%2C+always+at+hand',
  },
  {
    file: 'screenshot-2-favourites.png',
    params: 'theme=dark&view=favourites&caption=Pin+favourites+and+search+instantly',
  },
  {
    file: 'screenshot-3-settings.png',
    params: 'view=settings&caption=Customizable+settings+with+dark+mode',
  },
];

const templatePath = path.join(__dirname, 'screenshot-template.html');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  for (const shot of shots) {
    const url = `file://${templatePath}?${shot.params}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('#scene');
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(outDir, shot.file),
      type: 'png',
    });
    console.log(`✓ ${shot.file}`);
  }

  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#scene');
  const fullBuffer = await page.screenshot({ type: 'png' });
  await page.setViewport({ width: 440, height: 280 });
  await page.setContent(`
    <html><body style="margin:0;background:#eff6ff;">
      <img src="data:image/png;base64,${fullBuffer.toString('base64')}"
           style="width:880px;height:550px;object-fit:cover;object-position:right center;margin-left:-280px;margin-top:-60px;">
    </body></html>
  `);
  await page.screenshot({
    path: path.join(outDir, 'promo-tile-440x280.png'),
    type: 'png',
  });
  console.log('✓ promo-tile-440x280.png');

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
