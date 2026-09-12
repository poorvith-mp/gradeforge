import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distAssetsDir = path.resolve(__dirname, '../dist/assets');

const ALLOWED_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'gradeforge.poorvithmp.com',
  'poorvithmp.com',
  'github.com',
  'api.whatsapp.com',
  'twitter.com',
  'schema.org',
  'vtu.ac.in',
  'annauniv.edu',
  'ugc.gov.in',
  'mu.ac.in',
  'ktu.edu.in',
  'jntuh.ac.in',
  'en.wikipedia.org',
  'w3.org',
  'reactjs.org',
  'react.dev',
];

test('built client JS assets contain zero unapproved external network endpoints', (t) => {
  if (!fs.existsSync(distAssetsDir)) {
    t.skip('dist/assets not built yet; runs post-build');
    return;
  }

  const jsFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.js'));
  const urlRegex = /https:\/\/([a-zA-Z0-9.-]+)/g;

  for (const file of jsFiles) {
    const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      const domain = match[1];
      const isAllowed = ALLOWED_DOMAINS.some(
        (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
      );
      assert.ok(
        isAllowed,
        `Disallowed external URL found in ${file}: https://${domain}`
      );
    }
  }
});
