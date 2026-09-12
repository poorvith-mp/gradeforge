import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRESET_GRADING_SCALES } from '../src/constants/presets.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('preset IDs are unique', () => {
  const ids = new Set();
  for (const scale of PRESET_GRADING_SCALES) {
    assert.ok(!ids.has(scale.id), `Duplicate preset ID: ${scale.id}`);
    ids.add(scale.id);
  }
});

test('preset provenance fields match expected shape when present', () => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  for (const scale of PRESET_GRADING_SCALES) {
    if (scale.verifiedAgainst) {
      assert.ok(
        scale.verifiedAgainst.startsWith('https://'),
        `Preset ${scale.id} verifiedAgainst must be a secure URL: ${scale.verifiedAgainst}`
      );
      assert.ok(
        scale.verifiedOn && dateRegex.test(scale.verifiedOn),
        `Preset ${scale.id} verifiedOn must match YYYY-MM-DD: ${scale.verifiedOn}`
      );
    }
  }
});

test('presidency-univ preset matches ideas specification or is cleanly omitted', () => {
  const presidencyPath = path.resolve(__dirname, '../../../personal-brand/ideas/gradeforge/presets/presidency.md');
  const presidencyExists = fs.existsSync(presidencyPath);
  const presidencyPreset = PRESET_GRADING_SCALES.find((s) => s.id === 'presidency-univ');

  if (presidencyExists) {
    assert.ok(presidencyPreset, 'presidency-univ preset must be present when presidency.md is supplied');
  } else {
    // Per spec: if not supplied, Antigravity does not guess, leave the preset out
    assert.equal(presidencyPreset, undefined, 'presidency-univ preset must not be guessed when presidency.md is absent');
  }
});
