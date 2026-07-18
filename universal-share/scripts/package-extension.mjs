/**
 * Creates universal-share-v1.0.0.zip inside release/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const releaseDir = path.join(root, 'release');

if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')
);
const zipName = `universal-share-v${manifest.version}.zip`;
const zipPath = path.join(releaseDir, zipName);

const excludes = [
  'release/*',
  'node_modules/*',
  'store-assets/*',
  'website/*',
  'scripts/*',
  'PUBLISHING.md',
  'STORE_LISTING.md',
  'privacy-policy.html',
  'package.json',
  'package-lock.json',
  '.gitignore',
  '*.zip',
  '.DS_Store',
];

execSync(
  `cd "${root}" && zip -r "${zipPath}" . ${excludes.map((e) => `-x "${e}"`).join(' ')}`,
  { stdio: 'inherit' }
);

console.log(`\n✓ Package created: release/${zipName}`);
