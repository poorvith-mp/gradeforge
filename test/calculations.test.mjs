import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_GRADING_SCALES } from '../src/constants/presets.ts';
import { convertToPercentage } from '../src/utils/calculations.ts';

test('percentage conversion distinguishes VTU, MU, German, and standard 10 scales', () => {
  assert.equal(convertToPercentage(9.0, 'vtu'), '82.50% (VTU)');
  assert.equal(convertToPercentage(8.0, 'mumbai-univ'), '71.20% (MU)');
  assert.equal(convertToPercentage(6.0, 'mumbai-univ'), '53.60% (MU)');
  assert.equal(convertToPercentage(1.0, 'german-scale'), '100.00% (German Equiv)');
  assert.equal(convertToPercentage(3.8, 'us-4gpa', 4), '95.00%');
  assert.equal(convertToPercentage(8.5, 'generic-10', 10), '85.00%');
  assert.equal(convertToPercentage(null, 'vtu'), '—');
});

test('preset scales include regional groupings and international scales', () => {
  const regions = new Set(PRESET_GRADING_SCALES.map((s) => s.region));
  assert.ok(regions.has('India'));
  assert.ok(regions.has('North America'));
  assert.ok(regions.has('UK & Europe'));
  assert.ok(regions.has('Australia & Asia-Pacific'));
});
