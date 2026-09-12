import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const devIndexHtmlPath = path.resolve(__dirname, '../index.html');
const distIndexHtmlPath = path.join(distDir, 'index.html');
const distSwPath = path.join(distDir, 'sw.js');

test('dev index.html links manifest but does not reference sw.js directly', () => {
  const devHtml = fs.readFileSync(devIndexHtmlPath, 'utf8');
  assert.match(devHtml, /rel="manifest" href="\/manifest\.webmanifest"/);
  assert.doesNotMatch(devHtml, /sw\.js/);
});

test('dist build artifacts contain manifest and complete precached asset list', (t) => {
  if (!fs.existsSync(distSwPath) || !fs.existsSync(distIndexHtmlPath)) {
    t.skip('dist artifacts not built yet; test runs post-build');
    return;
  }

  const distHtml = fs.readFileSync(distIndexHtmlPath, 'utf8');
  assert.match(distHtml, /rel="manifest" href="\/manifest\.webmanifest"/);

  const swContent = fs.readFileSync(distSwPath, 'utf8');
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    for (const file of assetFiles) {
      assert.ok(
        swContent.includes(`/assets/${file}`),
        `dist/sw.js must precache asset: /assets/${file}`
      );
    }
  }
});
