import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_GRADING_SCALES } from '../src/constants/presets.ts';
import { convertToPercentage, validateScaleEntries } from '../src/utils/calculations.ts';

test('percentage conversion distinguishes VTU, MU, German, and standard 10 scales', () => {
  assert.equal(convertToPercentage(9.0, 'vtu'), '82.50% (VTU)');
  assert.equal(convertToPercentage(8.0, 'mumbai-univ'), '71.20% (MU)');
  assert.equal(convertToPercentage(6.0, 'mumbai-univ'), '53.60% (MU)');
  assert.equal(convertToPercentage(1.0, 'german-scale'), '100.00% (German Equiv)');
  assert.equal(convertToPercentage(3.8, 'us-4gpa', 4), '95.00%');
  assert.equal(convertToPercentage(8.5, 'generic-10', 10), '85.00%');
  assert.equal(convertToPercentage(null, 'vtu'), '—');
});

test('percentage conversion respects custom scale formulas and maxScale > 10', () => {
  const custom95Scale = {
    id: 'custom-95',
    name: 'My 9.5x Scale',
    maxScale: 10,
    isCustom: true,
    formula: {
      sgpa: 'SGPA = Σ(credit × grade point) ÷ Σ(credit)',
      cgpa: 'CGPA = Σ(semester SGPA × semester credits) ÷ Σ(total credits)',
      percentage: 'CGPA × 9.5',
    },
    grades: [{ label: 'O', point: 10 }],
  };
  assert.equal(convertToPercentage(8.0, custom95Scale, 10), '76.00%');

  const custom20Scale = {
    id: 'custom-20',
    name: 'My 20-Point Scale',
    maxScale: 20,
    isCustom: true,
    formula: {
      sgpa: 'SGPA = Σ(credit × grade point) ÷ Σ(credit)',
      cgpa: 'CGPA = Σ(semester SGPA × semester credits) ÷ Σ(total credits)',
      percentage: '(CGPA ÷ 20) × 100',
    },
    grades: [{ label: 'TB', point: 18 }],
  };
  assert.equal(convertToPercentage(16.0, custom20Scale, 20), '80.00%');
});

test('validateScaleEntries enforces dynamic maxScale up to 100', () => {
  const defaultCap = validateScaleEntries([{ label: 'A', point: 15 }], 10);
  assert.equal(defaultCap.valid, false);
  assert.match(defaultCap.errors[0], /between 0 and 10/);

  const scale20 = validateScaleEntries([{ label: 'TB', point: 18 }, { label: 'B', point: 15 }], 20);
  assert.equal(scale20.valid, true);
  assert.equal(scale20.entries.length, 2);
  assert.equal(scale20.entries[0].point, 18);
});

test('preset scales include regional groupings and international scales', () => {
  const regions = new Set(PRESET_GRADING_SCALES.map((s) => s.region));
  assert.ok(regions.has('India'));
  assert.ok(regions.has('North America'));
  assert.ok(regions.has('UK & Europe'));
  assert.ok(regions.has('Australia & Asia-Pacific'));
});
