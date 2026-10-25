import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_GRADING_SCALES } from '../src/constants/presets.ts';
import { convertAcrossSystems, convertToAllMajorSystems } from '../src/utils/conversion.ts';

test('preset grading scales include 16 general regional systems across 4 regions', () => {
  assert.equal(PRESET_GRADING_SCALES.length, 16);
  const ids = new Set(PRESET_GRADING_SCALES.map((s) => s.id));
  for (const expectedId of [
    'vtu',
    'anna-univ',
    'generic-10',
    'cbse-central-10',
    'autonomous-10',
    'mumbai-univ',
    'ktu',
    'jntu',
    'us-4gpa',
    'canada-433',
    'uk-honours',
    'ects-europe',
    'german-scale',
    'french-20',
    'aus-7gpa',
    'singapore-5',
  ]) {
    assert.ok(ids.has(expectedId), `Missing expected preset ${expectedId}`);
  }
});

test('convertAcrossSystems converts accurately between VTU, US 4.0, German 1.0-5.0, and UK Honours', () => {
  const vtu = PRESET_GRADING_SCALES.find((s) => s.id === 'vtu');
  const us4 = PRESET_GRADING_SCALES.find((s) => s.id === 'us-4gpa');
  const german = PRESET_GRADING_SCALES.find((s) => s.id === 'german-scale');
  const uk = PRESET_GRADING_SCALES.find((s) => s.id === 'uk-honours');

  // VTU 8.75 -> (8.75 - 0.75) * 10 = 80.00%
  // 80% on US 4.0 -> 3.20
  const vtuToUs = convertAcrossSystems(8.75, vtu, us4);
  assert.equal(vtuToUs.percentage, 80);
  assert.equal(vtuToUs.value, 3.2);

  // 80% on German scale -> 5.0 - (0.8 * 4.0) = 1.80 (Gut)
  const vtuToGerman = convertAcrossSystems(8.75, vtu, german);
  assert.equal(vtuToGerman.value, 1.8);
  assert.equal(vtuToGerman.classification, 'Gut');

  // 80% on UK Honours -> First-Class Honours (1st)
  const vtuToUk = convertAcrossSystems(8.75, vtu, uk);
  assert.equal(vtuToUk.classification, 'First-Class Honours (1st)');

  // Reverse: US 3.20 (80%) back to VTU -> 8.75
  const usToVtu = convertAcrossSystems(3.2, us4, vtu);
  assert.equal(usToVtu.value, 8.75);
});

test('convertToAllMajorSystems returns complete global conversion table', () => {
  const generic10 = PRESET_GRADING_SCALES.find((s) => s.id === 'generic-10');
  const table = convertToAllMajorSystems(8.5, generic10);
  assert.equal(table.length, 11);

  const byId = Object.fromEntries(table.map((row) => [row.systemId, row]));
  assert.equal(byId['percentage'].valueString, '85.00%');
  assert.equal(byId['us-4gpa'].valueString, '3.40 / 4.0');
  assert.equal(byId['french-20'].valueString, '17.00 / 20');
  assert.equal(byId['vtu'].valueString, '9.25 / 10');
});
