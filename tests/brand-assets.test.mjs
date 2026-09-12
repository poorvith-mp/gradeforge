import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const asset = (name) => readFile(new URL(`../public/${name}`, import.meta.url));
const pngSize = (source) => ({ width: source.readUInt32BE(16), height: source.readUInt32BE(20) });

test('GradeForge ships the approved academic identity', async () => {
  const [logo, cover, favicon, apple, og, icon192, icon512, ...pages] = await Promise.all([
    asset('logo-mark.svg'), asset('cover.svg'), asset('favicon.png'), asset('apple-touch-icon.png'), asset('og.png'),
    asset('icons/icon-192.png'), asset('icons/icon-512.png'),
    ...['index.html', 'calculator.html', 'about.html', 'docs.html', 'contact.html'].map((name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8')),
  ]);
  assert.match(logo.toString(), /<title[^>]*>GradeForge logo<\/title>/);
  assert.match(cover.toString(), /Calculate SGPA and CGPA without a spreadsheet\./);
  assert.deepEqual(pngSize(favicon), { width: 32, height: 32 });
  assert.deepEqual(pngSize(apple), { width: 180, height: 180 });
  assert.deepEqual(pngSize(og), { width: 1200, height: 630 });
  assert.deepEqual(pngSize(icon192), { width: 192, height: 192 });
  assert.deepEqual(pngSize(icon512), { width: 512, height: 512 });
  for (const page of pages) {
    assert.match(page, /rel="apple-touch-icon" href="\/apple-touch-icon\.png"/);
    assert.match(page, /property="og:image" content="https:\/\/gradeforge\.poorvithmp\.com\/og\.png"/);
  }
});
