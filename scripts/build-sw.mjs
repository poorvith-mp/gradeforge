import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const swTemplatePath = path.resolve(__dirname, '../public/sw.js');
const targetSwPath = path.join(distDir, 'sw.js');

if (!fs.existsSync(distDir)) {
  console.error('dist/ does not exist. Run vite build first.');
  process.exit(1);
}

const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).map((f) => `/assets/${f}`)
  : [];

// Hash based on asset files content
const hash = crypto.createHash('sha256');
for (const relPath of assetFiles) {
  const fullPath = path.join(distDir, relPath);
  if (fs.existsSync(fullPath)) {
    hash.update(fs.readFileSync(fullPath));
  }
}
const buildHash = hash.digest('hex').slice(0, 10);

let swContent = fs.readFileSync(swTemplatePath, 'utf8');

// Replace BUILD_HASH
swContent = swContent.replace('BUILD_HASH', buildHash);

// Inject assets
const assetsFormatted = assetFiles.map((f) => `  ${JSON.stringify(f)},`).join('\n');
swContent = swContent.replace('  /* INJECT_PRECACHE_ASSETS */', assetsFormatted);

fs.writeFileSync(targetSwPath, swContent, 'utf8');
console.log(`Injected ${assetFiles.length} assets into dist/sw.js with build hash ${buildHash}`);
